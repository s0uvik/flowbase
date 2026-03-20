import Handlebars from "handlebars";
import type { WorkflowContext } from "@/features/executions/types";
import type {
  HttpRequestConfig,
  HttpRequestKeyValuePair,
} from "@/features/nodes/executions-nodes/nodes/http-request/types";

if (!Handlebars.helpers.json) {
  Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);
  });
}

export const HTTP_REQUEST_TEST_CONTEXT: WorkflowContext = {
  field: "sample-value",
  user: {
    id: "sample-user-id",
    email: "sample@example.com",
    name: "Sample User",
  },
  order: {
    id: "order_123",
    total: 149.99,
  },
};

export type HttpRequestResponsePayload = {
  status: number;
  headers: Record<string, string>;
  data: unknown;
};

type HttpRequestExecutionErrorOptions = {
  status?: number;
  headers?: Record<string, string>;
  data?: unknown;
  isTimeout?: boolean;
};

export class HttpRequestExecutionError extends Error {
  status?: number;
  headers?: Record<string, string>;
  data?: unknown;
  isTimeout: boolean;

  constructor(message: string, options: HttpRequestExecutionErrorOptions = {}) {
    super(message);
    this.name = "HttpRequestExecutionError";
    this.status = options.status;
    this.headers = options.headers;
    this.data = options.data;
    this.isTimeout = options.isTimeout ?? false;
  }
}

const resolveTemplate = (value: string, context: WorkflowContext) => {
  return Handlebars.compile(value)(context);
};

const normalizeHeaders = (headers: Headers) => {
  return Object.fromEntries(headers.entries());
};

const formatErrorData = (data: unknown) => {
  if (data == null || data === "") {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
};

const resolveKeyValuePairs = (
  pairs: HttpRequestKeyValuePair[],
  context: WorkflowContext,
) => {
  return pairs.reduce<Array<{ key: string; value: string }>>((acc, pair) => {
    const key = resolveTemplate(pair.key, context).trim();

    if (!key) {
      return acc;
    }

    acc.push({
      key,
      value: resolveTemplate(pair.value, context),
    });

    return acc;
  }, []);
};

const getAuthHeaders = (
  config: HttpRequestConfig,
  context: WorkflowContext,
) => {
  switch (config.auth.type) {
    case "bearer": {
      const token = resolveTemplate(config.auth.token ?? "", context).trim();

      if (!token) {
        throw new HttpRequestExecutionError("Bearer token is required.");
      }

      return {
        Authorization: `Bearer ${token}`,
      };
    }
    case "apiKey": {
      const apiKeyName = resolveTemplate(
        config.auth.apiKeyName ?? "",
        context,
      ).trim();
      const apiKeyValue = resolveTemplate(
        config.auth.apiKeyValue ?? "",
        context,
      );

      if (!apiKeyName || !apiKeyValue) {
        throw new HttpRequestExecutionError(
          "API key name and value are required.",
        );
      }

      if (config.auth.apiKeyIn === "header") {
        return {
          [apiKeyName]: apiKeyValue,
        };
      }

      return {};
    }
    case "basic": {
      const username = resolveTemplate(config.auth.username ?? "", context);
      const password = resolveTemplate(config.auth.password ?? "", context);

      if (!username || !password) {
        throw new HttpRequestExecutionError(
          "Basic auth username and password are required.",
        );
      }

      const credentials = Buffer.from(`${username}:${password}`).toString(
        "base64",
      );

      return {
        Authorization: `Basic ${credentials}`,
      };
    }
    default:
      return {};
  }
};

const appendApiKeyQueryParam = (
  url: URL,
  config: HttpRequestConfig,
  context: WorkflowContext,
) => {
  if (config.auth.type !== "apiKey" || config.auth.apiKeyIn !== "query") {
    return;
  }

  const apiKeyName = resolveTemplate(
    config.auth.apiKeyName ?? "",
    context,
  ).trim();
  const apiKeyValue = resolveTemplate(config.auth.apiKeyValue ?? "", context);

  if (!apiKeyName || !apiKeyValue) {
    throw new HttpRequestExecutionError("API key name and value are required.");
  }

  url.searchParams.set(apiKeyName, apiKeyValue);
};

const getRequestBody = (
  config: HttpRequestConfig,
  context: WorkflowContext,
): {
  body?: BodyInit;
  headers?: Record<string, string>;
} => {
  if (
    config.method === "GET" ||
    config.method === "DELETE" ||
    config.bodyType === "none"
  ) {
    return {};
  }

  if (config.bodyType === "json") {
    const rawBody = resolveTemplate(
      typeof config.body === "string" ? config.body : "",
      context,
    ).trim();

    if (!rawBody) {
      return {};
    }

    try {
      const parsedBody = JSON.parse(rawBody);

      return {
        body: JSON.stringify(parsedBody),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch {
      throw new HttpRequestExecutionError(
        "Raw JSON body is invalid after resolving variables.",
      );
    }
  }

  const pairs = resolveKeyValuePairs(
    Array.isArray(config.body) ? config.body : [],
    context,
  );

  if (config.bodyType === "urlencoded") {
    const searchParams = new URLSearchParams();

    for (const pair of pairs) {
      searchParams.append(pair.key, pair.value);
    }

    return {
      body: searchParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  }

  if (config.bodyType === "formdata") {
    const formData = new FormData();

    for (const pair of pairs) {
      formData.append(pair.key, pair.value);
    }

    return {
      body: formData,
    };
  }

  return {};
};

export const executeHttpRequest = async ({
  config,
  context,
}: {
  config: HttpRequestConfig;
  context: WorkflowContext;
}): Promise<HttpRequestResponsePayload> => {
  const resolvedUrl = resolveTemplate(config.url, context).trim();

  if (!resolvedUrl) {
    throw new HttpRequestExecutionError("Request URL is required.");
  }

  let requestUrl: URL;

  try {
    requestUrl = new URL(resolvedUrl);
  } catch {
    throw new HttpRequestExecutionError(
      "Request URL must be a valid absolute URL.",
    );
  }

  appendApiKeyQueryParam(requestUrl, config, context);

  const customHeaders = Object.fromEntries(
    resolveKeyValuePairs(config.headers, context).map((header) => [
      header.key,
      header.value,
    ]),
  );
  const authHeaders = getAuthHeaders(config, context);
  const requestBody = getRequestBody(config, context);
  const headers = {
    ...customHeaders,
    ...authHeaders,
    ...requestBody.headers,
  };

  const controller = new AbortController();
  const timeout = Number.isFinite(config.timeout) ? config.timeout : 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(requestUrl.toString(), {
      method: config.method,
      headers,
      body: requestBody.body,
      signal: controller.signal,
      cache: "no-store",
    });

    const responseHeaders = normalizeHeaders(response.headers);
    const responseData = await parseResponseBody(response);
    const responsePayload = {
      status: response.status,
      headers: responseHeaders,
      data: responseData,
    };

    if (!response.ok) {
      const errorBody = formatErrorData(responseData);
      const errorMessage = errorBody
        ? `Request failed with status ${response.status}: ${errorBody}`
        : `Request failed with status ${response.status}.`;

      throw new HttpRequestExecutionError(errorMessage, {
        status: response.status,
        headers: responseHeaders,
        data: responseData,
      });
    }

    return responsePayload;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || controller.signal.aborted)
    ) {
      throw new HttpRequestExecutionError("Request timed out.", {
        isTimeout: true,
      });
    }

    if (error instanceof HttpRequestExecutionError) {
      throw error;
    }

    throw new HttpRequestExecutionError(
      error instanceof Error ? error.message : "Failed to send HTTP request.",
    );
  } finally {
    clearTimeout(timeoutId);
  }
};
