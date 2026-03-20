import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../../components/base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useState } from "react";
import { useNodeStatus } from "@/features/nodes/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/features/nodes/triggers-nodes/nodes/google-form-trigger/channel";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon="/icons/googleform.svg"
        name="Google Form"
        description="When a Google Form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});
