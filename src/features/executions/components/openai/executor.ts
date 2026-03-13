import type { NodeExecutor } from "@/features/executions/types";
import Handlebars from "handlebars";
import { OpenAIFormType } from "./dialog";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { openaiChannel } from "@/inngest/channels/openai";

type OpenAIData = {
  variableName?: string;
  model?: OpenAIFormType["model"];
  systemPrompt?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const openAIExecutor: NodeExecutor<OpenAIData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    openaiChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  if (!data.variableName) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Openai node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Openai node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credential that user selected

  const API_KEY = process.env.OPENAI_API_KEY;
  const openai = createOpenAI({
    apiKey: API_KEY,
  });
  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai(data.model || "gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openaiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
