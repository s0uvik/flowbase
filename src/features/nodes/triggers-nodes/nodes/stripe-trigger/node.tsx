import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../../components/base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useState } from "react";
import { useNodeStatus } from "@/features/nodes/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/features/nodes/triggers-nodes/nodes/stripe-trigger/channel";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon="/icons/stripe.svg"
        name="Stripe"
        description="When a payment is created"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});
