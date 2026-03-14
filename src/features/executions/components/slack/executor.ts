import type { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.webhookUrl) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Slack node: Webhook URL is missing");
  }

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Slack node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("send-slack-message", async () => {
      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          }),
        );

        throw new NonRetriableError("Slack node: Variable name is missing");
      }

      await ky.post(data.webhookUrl!, {
        json: {
          content, // this key depend on slack webhook configuration
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
      slackChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
