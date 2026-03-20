import { requireAuth } from "@/lib/auth-utils";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { ExecutionDetail } from "@/features/executions/components/execution-detail";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ExecutionsErrorView,
  ExecutionsLoadingView,
} from "@/features/executions/components/executions";

type Props = {
  params: Promise<{ executionId: string }>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();
  const { executionId } = await params;
  prefetchExecution(executionId);

  return (
    <HydrateClient>
      <div className="p-4 md:p-10 h-full">
        <div className="mx-auto w-full flex flex-col gap-y-8 h-full">
          <ErrorBoundary fallback={<ExecutionsErrorView />}>
            <Suspense fallback={<ExecutionsLoadingView />}>
              <ExecutionDetail executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
