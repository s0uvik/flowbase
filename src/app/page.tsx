"use client";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { caller, trpc } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const page = () => {
  // await requireAuth();

  const trpc = useTRPC();

  // const data = await caller.getUsers();
  const testAI = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: () => {
        toast.success("Success");
      },
      onError: () => {
        toast.error("Error");
      },
    }),
  );
  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        Test AI
      </Button>
    </div>
  );
};

export default page;
