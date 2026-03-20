"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { openaiChannel } from "@/features/nodes/executions-nodes/nodes/openai/channel";

export type OpenAIToken = Realtime.Token<typeof openaiChannel, ["status"]>;

export async function fetchOpenAIRealtimeToken(): Promise<OpenAIToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: openaiChannel(),
    topics: ["status"],
  });

  return token;
}
