import type { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { discordChannel } from "@/features/nodes/executions-nodes/nodes/discord/channel";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.webhookUrl) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Discord node: Webhook URL is missing");
  }

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Discord node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("send-discord-message", async () => {
      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          }),
        );

        throw new NonRetriableError("Discord node: Variable name is missing");
      }

      await ky.post(data.webhookUrl!, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          messageContent: content,
          messageSent: true,
        },
      };
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
