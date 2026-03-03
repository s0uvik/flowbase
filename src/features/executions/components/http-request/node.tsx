"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { HTTPRequestDialog, HTTPRequestFormType } from "./dialog";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint} -> ${nodeData.variableName}`
    : "Not configured";

  const nodeStatus = "error";
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
        defaultValues={nodeData}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
