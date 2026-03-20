"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/features/nodes/executions-nodes/nodes/http-request/channel";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { BaseExecutionNode } from "../../components/base-execution-node";
import { fetchHttpRequestRealtimeToken } from "./actions";
import { HTTPRequestDialog, type HTTPRequestFormType } from "./dialog";
import {
  getDefaultHttpRequestConfig,
  type StoredHttpRequestNodeData,
} from "./types";

type HttpRequestNodeType = Node<StoredHttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = getDefaultHttpRequestConfig(props.data);
  const description = nodeData.url
    ? `${nodeData.method}: ${nodeData.url} -> ${nodeData.outputVariableName}`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
  });

  const { setNodes } = useReactFlow();
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleSubmit = (values: HTTPRequestFormType) => {
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
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <HTTPRequestDialog
        open={openSettingsDialog}
        onOpenChange={setOpenSettingsDialog}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
