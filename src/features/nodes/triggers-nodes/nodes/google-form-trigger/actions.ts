"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { googleFormTriggerChannel } from "@/features/nodes/triggers-nodes/nodes/google-form-trigger/channel";

export type GoogleFormTriggerToken = Realtime.Token<
  typeof googleFormTriggerChannel,
  ["status"]
>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
