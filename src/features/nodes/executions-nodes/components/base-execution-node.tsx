"use client";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== id && edge.target !== id),
      );
    };
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator variant="border" status={status}>
          <BaseNode status={status} onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              <div className="flex items-center gap-2">
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={name}
                    width={16}
                    height={16}
                    className=""
                  />
                ) : (
                  <Icon className="size-5 text-muted-foreground" />
                )}
                {children}
              </div>
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);
BaseExecutionNode.displayName = "BaseExecutionNode";
