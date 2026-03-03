import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for http-request

  if (!data.endpoint) {
    // TODO: Publish "error" state for http request
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variableName) {
    // TODO: Publish "error" state for http request
    throw new NonRetriableError(
      "HTTP Request node: No variable name configured",
    );
  }

  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;
    const body = data.body;
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
      },
    };

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }
    return {
      ...context,
      ...responsePayload,
    };
  });

  // TODO: Publish "success" state for http-request

  return result;
};
