import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";
import { ExecutionStatus } from "@prisma/client";

const POLLING_INTERVAL = 3000; // 3 seconds

// Hook to fetch all executions using suspense
// Polls every 3s when any execution is still RUNNING
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery({
    ...trpc.executions.getAll.queryOptions(params),
    refetchInterval: (query) => {
      const hasRunning = query.state.data?.items.some(
        (item) => item.status === ExecutionStatus.RUNNING,
      );
      return hasRunning ? POLLING_INTERVAL : false;
    },
  });
};

// Hook to fetch single execution using suspense
// Polls every 3s while the execution is still RUNNING
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.executions.getOne.queryOptions({ id }),
    refetchInterval: (query) => {
      return query.state.data?.status === ExecutionStatus.RUNNING
        ? POLLING_INTERVAL
        : false;
    },
  });
};
