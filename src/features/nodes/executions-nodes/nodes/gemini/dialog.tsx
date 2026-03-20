"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialType } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";

const AVAILABLE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "Prompt is required" }),
});

export type GeminiFormType = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormType) => void;
  defaultValues?: Partial<GeminiFormType>;
};

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const { data: credentials, isPending: isPendingCredentials } =
    useCredentialByType(CredentialType.GEMINI);

  const form = useForm<GeminiFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      credentialId: defaultValues?.credentialId || "",
      model: defaultValues?.model || AVAILABLE_MODELS[0],
      systemPrompt: defaultValues?.systemPrompt || "",
      userPrompt: defaultValues?.userPrompt || "",
    },
  });

  // Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        credentialId: defaultValues?.credentialId || "",
        model: defaultValues?.model || AVAILABLE_MODELS[0],
        systemPrompt: defaultValues?.systemPrompt || "",
        userPrompt: defaultValues?.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "result";

  const handleSubmit = (values: GeminiFormType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gemini</DialogTitle>
          <DialogDescription>
            Configure settings for the Gemini node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 border rounded-lg p-6"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="result" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPendingCredentials || !credentials?.length}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isPendingCredentials
                              ? "Loading credentials..."
                              : "Select a credential"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {credentials && credentials.length > 0 ? (
                          credentials.map((credential) => (
                            <SelectItem
                              key={credential.id}
                              value={credential.id}
                            >
                              <div className=" flex items-center gap-2">
                                <Image
                                  src="/icons/gemini.svg"
                                  alt="Gemini"
                                  width={16}
                                  height={16}
                                />

                                {credential.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No Gemini credentials found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a Gemini API credential to use for this node.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The model to use for the AI generation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional system instructions to guide the model's behavior"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give the model instructions on how it should behave.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your prompt here..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use values from earlier nodes like{" "}
                    {"{{previousResult.text}}"} or {"{{json apiResponse.data}}"}
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button className=" w-full" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
