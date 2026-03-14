"use client";

import { CredentialForm } from "@/features/credentials/components/credential-form";
import { useSuspenseCredential } from "@/features/credentials/hooks/use-credentials";

export const EditCredential = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return (
    <CredentialForm
      initialData={{
        id: credential.id,
        name: credential.name,
        type: credential.type,
        value: credential.value ?? "",
      }}
    />
  );
};
