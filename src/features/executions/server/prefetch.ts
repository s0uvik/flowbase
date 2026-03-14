import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getAll>;

/**
 * Prefetch all executions
 */
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getAll.queryOptions(params));
};

/**
 * Prefetch single execution
 */
export const prefetchExecution = (id: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
};
