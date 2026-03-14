import { requireAuth } from "@/lib/auth-utils";
import { CredentialForm } from "@/features/credentials/components/credential-form";
import { CredentialType } from "@prisma/client";

const Page = async () => {
  await requireAuth();
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <CredentialForm
          initialData={{
            name: "",
            type: CredentialType.OPENAI,
            value: "",
          }}
        />
      </div>
    </div>
  );
};

export default Page;
