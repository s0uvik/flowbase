import {
  WorkflowsContainer,
  WorkflowsErrorView,
  WorkflowsList,
  WorkflowsLoadingView,
} from "@/features/workflows/components/workflows";
import { workflowParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await workflowParamsLoader(searchParams);
  prefetchWorkflows(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsErrorView />}>
          <Suspense fallback={<WorkflowsLoadingView />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};

export default page;
