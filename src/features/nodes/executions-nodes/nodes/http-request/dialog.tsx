"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type HttpRequestTestResult, sendHttpRequestTest } from "./actions";
import {
  createEmptyHttpKeyValuePair,
  DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME,
  DEFAULT_HTTP_REQUEST_TIMEOUT,
  getDefaultHttpRequestConfig,
  HTTP_REQUEST_AUTH_TYPES,
  HTTP_REQUEST_BODY_TYPES,
  HTTP_REQUEST_METHODS,
  type HttpRequestConfig,
  type HttpRequestKeyValuePair,
  type StoredHttpRequestNodeData,
} from "./types";

const BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);

const variableNameSchema = z
  .string()
  .min(1, { message: "Output variable name is required." })
  .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
    message:
      "Output variable name must start with a letter or underscore and contain only letters, numbers, and underscores.",
  });

const keyValueSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const formSchema = z
  .object({
    method: z.enum(HTTP_REQUEST_METHODS),
    url: z.string().min(1, { message: "URL is required." }),
    auth: z.object({
      type: z.enum(HTTP_REQUEST_AUTH_TYPES),
      token: z.string().optional(),
      apiKeyName: z.string().optional(),
      apiKeyValue: z.string().optional(),
      apiKeyIn: z.enum(["header", "query"]).optional(),
      username: z.string().optional(),
      password: z.string().optional(),
    }),
    headers: z.array(keyValueSchema),
    bodyType: z.enum(HTTP_REQUEST_BODY_TYPES),
    body: z.union([z.string(), z.array(keyValueSchema)]),
    outputVariableName: variableNameSchema,
    timeout: z.coerce
      .number()
      .int({ message: "Timeout must be a whole number." })
      .positive({ message: "Timeout must be greater than zero." }),
  })
  .superRefine((value, ctx) => {
    if (value.auth.type === "bearer" && !value.auth.token?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["auth", "token"],
        message: "Bearer token is required.",
      });
    }

    if (value.auth.type === "apiKey") {
      if (!value.auth.apiKeyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["auth", "apiKeyName"],
          message: "API key name is required.",
        });
      }

      if (!value.auth.apiKeyValue?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["auth", "apiKeyValue"],
          message: "API key value is required.",
        });
      }
    }

    if (value.auth.type === "basic") {
      if (!value.auth.username?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["auth", "username"],
          message: "Username is required.",
        });
      }

      if (!value.auth.password?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["auth", "password"],
          message: "Password is required.",
        });
      }
    }

    const supportsBody = BODY_METHODS.has(value.method);

    if (!supportsBody && value.bodyType !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bodyType"],
        message: "This method does not support a request body.",
      });
    }

    if (value.bodyType === "json" && typeof value.body !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Raw JSON body must be text.",
      });
    }

    if (
      (value.bodyType === "formdata" || value.bodyType === "urlencoded") &&
      !Array.isArray(value.body)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Key-value pairs are required for this body type.",
      });
    }
  });

export type HTTPRequestFormType = HttpRequestConfig;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HTTPRequestFormType) => void;
  defaultValues?: StoredHttpRequestNodeData;
};

type ErrorMap = Record<string, string>;

const getErrorMap = (error: z.ZodError<HTTPRequestFormType>) => {
  return error.issues.reduce<ErrorMap>((acc, issue) => {
    const path = issue.path.join(".");

    if (!acc[path]) {
      acc[path] = issue.message;
    }

    return acc;
  }, {});
};

const supportsBodyForMethod = (method: HTTPRequestFormType["method"]) => {
  return BODY_METHODS.has(method);
};

const normalizeBodyForType = (
  bodyType: HTTPRequestFormType["bodyType"],
  currentBody: HTTPRequestFormType["body"],
) => {
  if (bodyType === "json" || bodyType === "none") {
    return typeof currentBody === "string" ? currentBody : "";
  }

  return Array.isArray(currentBody) && currentBody.length > 0
    ? currentBody
    : [createEmptyHttpKeyValuePair()];
};

const getInitialValues = (defaultValues?: StoredHttpRequestNodeData) => {
  return getDefaultHttpRequestConfig(defaultValues);
};

const updatePairList = (
  items: HttpRequestKeyValuePair[],
  index: number,
  patch: Partial<HttpRequestKeyValuePair>,
) => {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  );
};

const formatResponseData = (data: unknown) => {
  if (typeof data === "string") {
    return data;
  }

  if (data == null) {
    return "null";
  }

  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

const FieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
};

const TextField = ({
  id,
  label,
  value,
  placeholder,
  description,
  error,
  type = "text",
  onChange,
}: {
  id: string;
  label: string;
  value: string | number;
  placeholder?: string;
  description?: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <FieldError message={error} />
    </div>
  );
};

const KeyValueBuilder = ({
  title,
  description,
  addLabel,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  description?: string;
  addLabel: string;
  items: HttpRequestKeyValuePair[];
  onAdd: () => void;
  onChange: (
    index: number,
    key: keyof HttpRequestKeyValuePair,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">{title}</h4>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${title}-${item.key}-${item.value}`}
              className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_1fr_auto]"
            >
              <Input
                value={item.key}
                placeholder="Key"
                onChange={(event) => onChange(index, "key", event.target.value)}
              />
              <Input
                value={item.value}
                placeholder="Value or {{variable}}"
                onChange={(event) =>
                  onChange(index, "value", event.target.value)
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove(index)}
                className="shrink-0"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No rows added yet.
        </div>
      )}

      <Button type="button" variant="outline" onClick={onAdd}>
        <PlusIcon className="mr-2 size-4" />
        {addLabel}
      </Button>
    </div>
  );
};

const ResponsePreview = ({ result }: { result: HttpRequestTestResult }) => {
  const [open, setOpen] = useState(true);
  const [headersOpen, setHeadersOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(true);

  const status = result.ok ? result.response.status : result.error.status;
  const isSuccess = result.ok;
  const headers = result.ok ? result.response.headers : result.error.headers;
  const responseBody = result.ok ? result.response.data : result.error.data;
  const message = result.ok
    ? "Preview response received."
    : result.error.message;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border bg-muted/20"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                isSuccess
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              Status {status ?? "Error"}
            </span>
            {!isSuccess && result.error.isTimeout ? (
              <span className="text-xs text-destructive">Timed out</span>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm">
            {open ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
            {open ? "Hide Preview" : "Show Preview"}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-3 border-t px-4 py-4">
        <Collapsible open={headersOpen} onOpenChange={setHeadersOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" className="px-0">
              {headersOpen ? (
                <ChevronDownIcon className="mr-2 size-4" />
              ) : (
                <ChevronRightIcon className="mr-2 size-4" />
              )}
              Response Headers
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="max-h-56 overflow-auto rounded-md bg-background p-3 text-xs">
              {formatResponseData(headers ?? {})}
            </pre>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={bodyOpen} onOpenChange={setBodyOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" className="px-0">
              {bodyOpen ? (
                <ChevronDownIcon className="mr-2 size-4" />
              ) : (
                <ChevronRightIcon className="mr-2 size-4" />
              )}
              Response Body
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="max-h-72 overflow-auto rounded-md bg-background p-3 text-xs">
              {formatResponseData(responseBody)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const HTTPRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const [values, setValues] = useState<HTTPRequestFormType>(() =>
    getInitialValues(defaultValues),
  );
  const [errors, setErrors] = useState<ErrorMap>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<HttpRequestTestResult | null>(
    null,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(getInitialValues(defaultValues));
    setErrors({});
    setTestResult(null);
    setIsTesting(false);
  }, [defaultValues, open]);

  const supportsBody = supportsBodyForMethod(values.method);
  const bodyValue = typeof values.body === "string" ? values.body : "";
  const bodyPairs = Array.isArray(values.body)
    ? values.body
    : [createEmptyHttpKeyValuePair()];

  const validateValues = (nextValues: HTTPRequestFormType) => {
    const parsed = formSchema.safeParse(nextValues);

    if (!parsed.success) {
      setErrors(getErrorMap(parsed.error));
      return null;
    }

    setErrors({});
    return parsed.data;
  };

  const setValue = <K extends keyof HTTPRequestFormType>(
    key: K,
    value: HTTPRequestFormType[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleMethodChange = (method: HTTPRequestFormType["method"]) => {
    setValues((current) => {
      const nextBodyType = supportsBodyForMethod(method)
        ? current.bodyType === "none"
          ? "json"
          : current.bodyType
        : "none";

      return {
        ...current,
        method,
        bodyType: nextBodyType,
        body: normalizeBodyForType(nextBodyType, current.body),
      };
    });
  };

  const handleBodyTypeChange = (bodyType: HTTPRequestFormType["bodyType"]) => {
    setValues((current) => ({
      ...current,
      bodyType,
      body: normalizeBodyForType(bodyType, current.body),
    }));
  };

  const handleAuthChange = (patch: Partial<HTTPRequestFormType["auth"]>) => {
    setValues((current) => ({
      ...current,
      auth: {
        ...current.auth,
        ...patch,
      },
    }));
  };

  const handleHeaderChange = (
    index: number,
    key: keyof HttpRequestKeyValuePair,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      headers: updatePairList(current.headers, index, {
        [key]: value,
      }),
    }));
  };

  const handleBodyPairChange = (
    index: number,
    key: keyof HttpRequestKeyValuePair,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      body: updatePairList(
        Array.isArray(current.body) ? current.body : [],
        index,
        {
          [key]: value,
        },
      ),
    }));
  };

  const handleSave = () => {
    const parsedValues = validateValues(values);

    if (!parsedValues) {
      return;
    }

    onSubmit(parsedValues);
    onOpenChange(false);
  };

  const handleTestRequest = async () => {
    const parsedValues = validateValues(values);

    if (!parsedValues) {
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await sendHttpRequestTest(parsedValues);
      setTestResult(result);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure the request, preview it with sample data, and map the
            response into your workflow context.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 rounded-lg border p-6">
          <Section
            title="Request"
            description="All request fields support {{variable}} interpolation."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="http-method">
                  Method
                </label>
                <Select
                  value={values.method}
                  onValueChange={(value) =>
                    handleMethodChange(value as HTTPRequestFormType["method"])
                  }
                >
                  <SelectTrigger id="http-method" className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_REQUEST_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TextField
                id="http-timeout"
                label="Timeout (ms)"
                type="number"
                value={values.timeout}
                placeholder={String(DEFAULT_HTTP_REQUEST_TIMEOUT)}
                description="Abort the request if it exceeds this duration."
                error={errors.timeout}
                onChange={(value) => setValue("timeout", Number(value))}
              />
            </div>

            <TextField
              id="http-url"
              label="URL"
              value={values.url}
              placeholder="https://api.example.com/items/{{order.id}}"
              description="Use absolute URLs and {{variables}} from earlier nodes."
              error={errors.url}
              onChange={(value) => setValue("url", value)}
            />
          </Section>

          <Section
            title="Authentication"
            description="Choose how this request should authenticate."
          >
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="http-auth-type">
                Auth Type
              </label>
              <Select
                value={values.auth.type}
                onValueChange={(value) =>
                  handleAuthChange({
                    type: value as HTTPRequestFormType["auth"]["type"],
                  })
                }
              >
                <SelectTrigger id="http-auth-type" className="w-full">
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Auth</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="apiKey">API Key</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {values.auth.type === "bearer" ? (
              <TextField
                id="http-auth-token"
                label="Bearer Token"
                value={values.auth.token ?? ""}
                placeholder="{{api.token}}"
                description="The token will be sent as Authorization: Bearer <token>."
                error={errors["auth.token"]}
                onChange={(value) => handleAuthChange({ token: value })}
              />
            ) : null}

            {values.auth.type === "apiKey" ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    id="http-auth-api-key-name"
                    label="API Key Name"
                    value={values.auth.apiKeyName ?? ""}
                    placeholder="x-api-key"
                    error={errors["auth.apiKeyName"]}
                    onChange={(value) =>
                      handleAuthChange({ apiKeyName: value })
                    }
                  />
                  <TextField
                    id="http-auth-api-key-value"
                    label="API Key Value"
                    value={values.auth.apiKeyValue ?? ""}
                    placeholder="{{credentials.apiKey}}"
                    error={errors["auth.apiKeyValue"]}
                    onChange={(value) =>
                      handleAuthChange({ apiKeyValue: value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Send as Header</p>
                    <p className="text-sm text-muted-foreground">
                      Turn this off to append the API key as a query parameter.
                    </p>
                  </div>
                  <Switch
                    checked={(values.auth.apiKeyIn ?? "header") === "header"}
                    onCheckedChange={(checked) =>
                      handleAuthChange({
                        apiKeyIn: checked ? "header" : "query",
                      })
                    }
                  />
                </div>
              </div>
            ) : null}

            {values.auth.type === "basic" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="http-auth-username"
                  label="Username"
                  value={values.auth.username ?? ""}
                  placeholder="{{user.email}}"
                  error={errors["auth.username"]}
                  onChange={(value) => handleAuthChange({ username: value })}
                />
                <TextField
                  id="http-auth-password"
                  label="Password"
                  type="password"
                  value={values.auth.password ?? ""}
                  placeholder="{{secrets.password}}"
                  error={errors["auth.password"]}
                  onChange={(value) => handleAuthChange({ password: value })}
                />
              </div>
            ) : null}
          </Section>

          <Section
            title="Headers"
            description="Custom headers are merged with auth headers before sending."
          >
            <KeyValueBuilder
              title="Custom Headers"
              description="Header values support {{variable}} interpolation."
              addLabel="Add Header"
              items={values.headers}
              onAdd={() =>
                setValue("headers", [
                  ...values.headers,
                  createEmptyHttpKeyValuePair(),
                ])
              }
              onChange={handleHeaderChange}
              onRemove={(index) =>
                setValue(
                  "headers",
                  values.headers.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          </Section>

          {supportsBody ? (
            <Section
              title="Body"
              description="Choose how the request body should be sent."
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="http-body-type">
                  Body Type
                </label>
                <Select
                  value={values.bodyType}
                  onValueChange={(value) =>
                    handleBodyTypeChange(
                      value as HTTPRequestFormType["bodyType"],
                    )
                  }
                >
                  <SelectTrigger id="http-body-type" className="w-full">
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">Raw JSON</SelectItem>
                    <SelectItem value="formdata">Form Data</SelectItem>
                    <SelectItem value="urlencoded">
                      x-www-form-urlencoded
                    </SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.bodyType} />
              </div>

              {values.bodyType === "json" ? (
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="http-body-json"
                  >
                    Raw JSON
                  </label>
                  <Textarea
                    id="http-body-json"
                    rows={10}
                    value={bodyValue}
                    placeholder={`{\n  "userId": "{{user.id}}"\n}`}
                    onChange={(event) => setValue("body", event.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use {"{{variables}}"} for simple values or{" "}
                    {"{{json variable}}"}
                    to stringify objects.
                  </p>
                  <FieldError message={errors.body} />
                </div>
              ) : null}

              {values.bodyType === "formdata" ||
              values.bodyType === "urlencoded" ? (
                <>
                  <KeyValueBuilder
                    title={
                      values.bodyType === "formdata"
                        ? "Form Data Fields"
                        : "URL Encoded Fields"
                    }
                    description="Body values support {{variable}} interpolation."
                    addLabel="Add Field"
                    items={bodyPairs}
                    onAdd={() =>
                      setValue("body", [
                        ...bodyPairs,
                        createEmptyHttpKeyValuePair(),
                      ])
                    }
                    onChange={handleBodyPairChange}
                    onRemove={(index) =>
                      setValue(
                        "body",
                        bodyPairs.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  />
                  <FieldError message={errors.body} />
                </>
              ) : null}

              {values.bodyType === "none" ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No body will be sent for this request.
                </div>
              ) : null}
            </Section>
          ) : null}

          <Section
            title="Response Mapping"
            description="Successful responses are stored in workflow context as { status, headers, data }."
          >
            <TextField
              id="http-output-variable"
              label="Output Variable Name"
              value={values.outputVariableName}
              placeholder={DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME}
              description={`Other nodes can use {{${values.outputVariableName || DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME}.data.fieldName}} or {{${values.outputVariableName || DEFAULT_HTTP_REQUEST_OUTPUT_VARIABLE_NAME}.status}}.`}
              error={errors.outputVariableName}
              onChange={(value) => setValue("outputVariableName", value)}
            />
          </Section>

          <Section
            title="Test Request"
            description="Preview uses sample data for template variables and does not execute the workflow."
          >
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestRequest}
                disabled={isTesting}
                className="w-full sm:w-auto"
              >
                {isTesting ? (
                  <>
                    <Spinner className="mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Test Request"
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                Sample preview data includes {"{{field}}"}, {"{{user.id}}"}, and{" "}
                {"{{order.id}}"}.
              </p>

              {testResult ? <ResponsePreview result={testResult} /> : null}
            </div>
          </Section>

          <Separator />

          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
