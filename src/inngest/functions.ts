import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecutor } from "@/features/nodes/lib/executor-registry";
import { httpRequestChannel } from "../features/nodes/executions-nodes/nodes/http-request/channel";
import { manualTriggerChannel } from "../features/nodes/triggers-nodes/nodes/manual-trigger/channel";
import { googleFormTriggerChannel } from "../features/nodes/triggers-nodes/nodes/google-form-trigger/channel";
import { stripeTriggerChannel } from "../features/nodes/triggers-nodes/nodes/stripe-trigger/channel";
import { geminiChannel } from "../features/nodes/executions-nodes/nodes/gemini/channel";
import { openaiChannel } from "../features/nodes/executions-nodes/nodes/openai/channel";
import { slackChannel } from "../features/nodes/executions-nodes/nodes/slack/channel";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 2 : 0,
    onFailure: async ({ event, step }) => {
      return step.run("update-execution", async () => {
        return prisma.execution.update({
          where: { inngestEventId: event.data.event.id },
          data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack,
          },
        });
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      slackChannel(),
    ],
  },

  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!workflowId || !inngestEventId) {
      throw new NonRetriableError("Workflow ID or Event ID missing");
    }

    await step.run("create-execution", async () =>
      prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      }),
    );

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("get-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });
      return workflow.userId;
    });

    // initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // execute each nodes
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
        userId,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.COMPLETED,
          output: context,
          completedAt: new Date(),
        },
      });
    });

    return { workflowId, result: context };
  },
);
