export const HTTP_REQUEST_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

export const HTTP_REQUEST_AUTH_TYPES = [
  "none",
  "bearer",
  "apiKey",
  "basic",
] as const;

export const HTTP_REQUEST_BODY_TYPES = [
  "json",
  "formdata",
  "urlencoded",
  "none",
] as const;

export type HttpRequestMethod = (typeof HTTP_REQUEST_METHODS)[number];
export type HttpRequestAuthType = (typeof HTTP_REQUEST_AUTH_TYPES)[number];
export type HttpRequestBodyType = (typeof HTTP_REQUEST_BODY_TYPES)[number];

export type HttpRequestKeyValuePair = {
  key: string;
  value: string;
};

export type HttpRequestAuthConfig = {
  type: HttpRequestAuthType;
  token?: string;
  apiKeyName?: string;
  apiKeyValue?: string;
  apiKeyIn?: "header" | "query";
  username?: string;
  password?: string;
};

export type HttpRequestConfig = {
  method: HttpRequestMethod;
  url: string;
  auth: HttpRequestAuthConfig;
  headers: HttpRequestKeyValuePair[];
  bodyType: HttpRequestBodyType;
  body: string | HttpRequestKeyValuePair[];
  outputVariableName: string;
  timeout: number;
};

type LegacyHttpRequestData = Partial<{
  variableName: string;
  endpoint: string;
}>;

export type StoredHttpRequestNodeData = Partial<HttpRequestConfig> &
  LegacyHttpRequestData;

export const DEFAULT_HTTP_REQUEST_TIMEOUT = 10000;
export const DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME = "http";

export const createEmptyHttpKeyValuePair = (): HttpRequestKeyValuePair => ({
  key: "",
  value: "",
});

export const getDefaultHttpRequestConfig = (
  data?: StoredHttpRequestNodeData,
): HttpRequestConfig => {
  const method = data?.method ?? "GET";
  const shouldHideBody = method === "GET" || method === "DELETE";
  const bodyType =
    data?.bodyType ??
    (shouldHideBody ? "none" : Array.isArray(data?.body) ? "formdata" : "json");

  return {
    method,
    url: data?.url ?? data?.endpoint ?? "",
    auth: {
      type: data?.auth?.type ?? "none",
      token: data?.auth?.token ?? "",
      apiKeyName: data?.auth?.apiKeyName ?? "",
      apiKeyValue: data?.auth?.apiKeyValue ?? "",
      apiKeyIn: data?.auth?.apiKeyIn ?? "header",
      username: data?.auth?.username ?? "",
      password: data?.auth?.password ?? "",
    },
    headers:
      data?.headers?.map((header) => ({
        key: header.key ?? "",
        value: header.value ?? "",
      })) ?? [],
    bodyType,
    body:
      bodyType === "json" || bodyType === "none"
        ? typeof data?.body === "string"
          ? data.body
          : ""
        : Array.isArray(data?.body)
          ? data.body.map((item) => ({
              key: item.key ?? "",
              value: item.value ?? "",
            }))
          : [createEmptyHttpKeyValuePair()],
    outputVariableName:
      data?.outputVariableName ??
      data?.variableName ??
      DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME,
    timeout: data?.timeout ?? DEFAULT_HTTP_REQUEST_TIMEOUT,
  };
};
