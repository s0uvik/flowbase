import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import {
  ExecutionsContainer,
  ExecutionsErrorView,
  ExecutionsList,
  ExecutionsLoadingView,
} from "@/features/executions/components/executions";

type Props = {
  searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await executionsParamsLoader(searchParams);
  prefetchExecutions(params);

  return (
    <HydrateClient>
      <ExecutionsContainer>
        <ErrorBoundary fallback={<ExecutionsErrorView />}>
          <Suspense fallback={<ExecutionsLoadingView />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </ExecutionsContainer>
    </HydrateClient>
  );
};

export default page;
