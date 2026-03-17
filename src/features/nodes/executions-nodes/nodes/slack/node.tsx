"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../components/base-execution-node";
import { SlackDialog, SlackFormType } from "./dialog";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/features/nodes/executions-nodes/nodes/slack/channel";

type SlackNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });

  const { setNodes } = useReactFlow();
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleSubmit = (values: SlackFormType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <SlackDialog
        open={openSettingsDialog}
        onOpenChange={setOpenSettingsDialog}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
