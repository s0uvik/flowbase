"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ManualTriggerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ManualTriggerDialog = ({
  open,
  onOpenChange,
}: ManualTriggerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            COnfigure settings for the trigger node.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className=" text-sm text-muted-foreground">
            Use to manually trigger the workflow.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
