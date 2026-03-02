"use client";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  // status ?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const handleDelete = useCallback(() => {}, []);
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <BaseNode
          onDoubleClick={onDoubleClick}
          className=" rounded-l-2xl relative group"
        >
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
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  },
);
BaseTriggerNode.displayName = "BaseTriggerNode";
