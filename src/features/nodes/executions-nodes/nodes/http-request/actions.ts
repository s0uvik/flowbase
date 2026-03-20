"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/features/nodes/executions-nodes/nodes/http-request/channel";
import {
  executeHttpRequest,
  HTTP_REQUEST_TEST_CONTEXT,
  HttpRequestExecutionError,
} from "@/features/nodes/executions-nodes/nodes/http-request/request";
import {
  getDefaultHttpRequestConfig,
  type StoredHttpRequestNodeData,
} from "@/features/nodes/executions-nodes/nodes/http-request/types";
import { inngest } from "@/inngest/client";

export type HttpRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ["status"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });

  return token;
}

export type HttpRequestTestResult =
  | {
      ok: true;
      response: Awaited<ReturnType<typeof executeHttpRequest>>;
    }
  | {
      ok: false;
      error: {
        message: string;
        status?: number;
        headers?: Record<string, string>;
        data?: unknown;
        isTimeout?: boolean;
      };
    };

export async function sendHttpRequestTest(
  data: StoredHttpRequestNodeData,
): Promise<HttpRequestTestResult> {
  const config = getDefaultHttpRequestConfig(data);

  try {
    const response = await executeHttpRequest({
      config,
      context: HTTP_REQUEST_TEST_CONTEXT,
    });

    return {
      ok: true,
      response,
    };
  } catch (error) {
    if (error instanceof HttpRequestExecutionError) {
      return {
        ok: false,
        error: {
          message: error.message,
          status: error.status,
          headers: error.headers,
          data: error.data,
          isTimeout: error.isTimeout,
        },
      };
    }

    return {
      ok: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to send test request.",
      },
    };
  }
}
