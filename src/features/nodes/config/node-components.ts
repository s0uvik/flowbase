import { InitialNode } from "@/components/initial-node";
import { DiscordNode } from "@/features/nodes/executions-nodes/nodes/discord/node";
import { GeminiNode } from "@/features/nodes/executions-nodes/nodes/gemini/node";
import { HttpRequestNode } from "@/features/nodes/executions-nodes/nodes/http-request/node";
import { OpenAINode } from "@/features/nodes/executions-nodes/nodes/openai/node";
import { SlackNode } from "@/features/nodes/executions-nodes/nodes/slack/node";
import { GoogleFormTriggerNode } from "@/features/nodes/triggers-nodes/nodes/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/nodes/triggers-nodes/nodes/manual-trigger/node";
import { StripeTriggerNode } from "@/features/nodes/triggers-nodes/nodes/stripe-trigger/node";
import { NodeType } from "@prisma/client";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
