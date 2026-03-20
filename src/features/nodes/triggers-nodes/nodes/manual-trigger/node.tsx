import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../../components/base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useState } from "react";
import { useNodeStatus } from "@/features/nodes/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/features/nodes/triggers-nodes/nodes/manual-trigger/channel";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});
