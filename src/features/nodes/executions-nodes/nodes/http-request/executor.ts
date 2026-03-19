import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/features/nodes/executions-nodes/nodes/http-request/channel";
import {
  executeHttpRequest,
  HttpRequestExecutionError,
} from "@/features/nodes/executions-nodes/nodes/http-request/request";
import {
  getDefaultHttpRequestConfig,
  type StoredHttpRequestNodeData,
} from "@/features/nodes/executions-nodes/nodes/http-request/types";

export const httpRequestExecutor: NodeExecutor<
  StoredHttpRequestNodeData
> = async ({ data, nodeId, context, step, publish }) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const config = getDefaultHttpRequestConfig(data);

  try {
    const result = await step.run("http-request", async () => {
      if (!config.url) {
        throw new NonRetriableError("HTTP Request node: URL is missing.");
      }

      if (!config.outputVariableName) {
        throw new NonRetriableError(
          "HTTP Request node: Output variable name is missing.",
        );
      }

      const response = await executeHttpRequest({
        config,
        context,
      });

      return {
        ...context,
        [config.outputVariableName]: response,
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );

    if (error instanceof NonRetriableError) {
      throw error;
    }

    if (error instanceof HttpRequestExecutionError) {
      throw new NonRetriableError(`HTTP Request node: ${error.message}`);
    }

    throw new NonRetriableError(
      error instanceof Error
        ? `HTTP Request node: ${error.message}`
        : "HTTP Request node: Error executing request.",
    );
  }
};
