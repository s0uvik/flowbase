"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../components/base-execution-node";
import { GeminiDialog, GeminiFormType } from "./dialog";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { GEMINI_CHANNEL_NAME } from "@/features/nodes/executions-nodes/nodes/gemini/channel";

type GeminiNodeData = {
  variableName?: string;
  credentialId?: string;
  model?: GeminiFormType["model"];
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const { setNodes } = useReactFlow();
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleSubmit = (values: GeminiFormType) => {
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
        icon="/icons/gemini.svg"
        name="Gemini"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <GeminiDialog
        open={openSettingsDialog}
        onOpenChange={setOpenSettingsDialog}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
