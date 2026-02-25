import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflow-params";

// Hook to fetch all workflows using suspense
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();

  return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params));
};

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed ot create workflow: ${error.message}`);
      },
    }),
  );
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} removed successfully`);
        queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed ot remove workflow: ${error.message}`);
      },
    }),
  );
};
