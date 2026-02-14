import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap("run-ai", generateText, {
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant.",
      prompt: "who is the pm of india?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  },
);
