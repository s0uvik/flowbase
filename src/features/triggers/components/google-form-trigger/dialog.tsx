"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

type GoogleFormTriggerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: GoogleFormTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyWebhookUrl = () => {
    try {
      navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy webhook URL");
    }
  };

  const copyGoogleAppsScript = async () => {
    const script = generateGoogleFormScript(webhookUrl);
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Google Apps Script copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Google Apps Script");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Form</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form's Apps Script to trigger
            this workflow when a form is submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button type="button" size="icon" onClick={copyWebhookUrl}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-base">Setup instructions :</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>Click the three dots menu &gt; Script editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook URL above</li>
              <li>Save and click "Triggers" &gt; Add Trigger</li>
              <li>Choose: Form from &gt; On form submit &gt; save</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-base">Apps Script :</h4>
            <Button
              type="button"
              variant="outline"
              onClick={copyGoogleAppsScript}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Google Apps Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className=" flex flex-col">
                - Respondent's email
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondentEmail}}"}
                </code>
              </li>
              <li className=" flex flex-col">
                - Specific answer
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm. responses ['Question Name' ]}}"}
                </code>
              </li>
              <li className=" flex flex-col">
                - All responses as JSON
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm. responses}}"}
                </code>{" "}
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
