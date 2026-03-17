import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../../executions/types";
import { manualTriggerExecutor } from "@/features/nodes/triggers-nodes/nodes/manual-trigger/executor";
import { httpRequestExecutor } from "../executions-nodes/nodes/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/nodes/triggers-nodes/nodes/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/nodes/triggers-nodes/nodes/stripe-trigger/executor";
import { geminiExecutor } from "../executions-nodes/nodes/gemini/executor";
import { openAIExecutor } from "../executions-nodes/nodes/openai/executor";
import { discordExecutor } from "../executions-nodes/nodes/discord/executor";
import { slackExecutor } from "../executions-nodes/nodes/slack/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openAIExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor as NodeExecutor;
};
