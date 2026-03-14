import { requireAuth } from "@/lib/auth-utils";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { EditCredential } from "@/features/credentials/components/edit-credential";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CredentialsErrorView,
  CredentialsLoadingView,
} from "@/features/credentials/components/credentials";

type Props = {
  params: Promise<{ credentialId: string }>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();
  const { credentialId } = await params;
  prefetchCredential(credentialId);

  return (
    <HydrateClient>
      <div className="p-4 md:px-10 md:py-6 h-full">
        <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
          <ErrorBoundary fallback={<CredentialsErrorView />}>
            <Suspense fallback={<CredentialsLoadingView />}>
              <EditCredential credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
