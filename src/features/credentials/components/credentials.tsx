"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useParams, useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Credential, CredentialType } from "@prisma/client";
import { KeyRoundIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export const CredentialsSearch = () => {
  const [params, setSearchParams] = useCredentialsParams();
  const { search, onSearchChange } = useEntitySearch({
    params,
    setSearch: setSearchParams,
  });
  return (
    <EntitySearch
      value={search}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setSearchParams] = useCredentialsParams();
  return (
    <EntityPagination
      page={credentials.data.page}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => setSearchParams({ ...params, page })}
      disabled={credentials.isFetching}
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(item) => item.id}
      emptyView={<CredentialsEmptyView />}
    >
      {(credential) => <CredentialItem credential={credential} />}
    </EntityList>
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref="/credentials/create"
      newButtonLabel="New credential"
      disabled={disabled}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoadingView = () => {
  return <LoadingView message="Loading credentials..." />;
};

export const CredentialsErrorView = () => {
  return <ErrorView message="Failed to load credentials..." />;
};

export const CredentialsEmptyView = () => {
  const router = useRouter();
  return (
    <EmptyView
      onNew={() => {
        router.push("/credentials/create");
      }}
      message="You haven't created any credentials yet."
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/icons/openai.svg",
  [CredentialType.GEMINI]: "/icons/gemini.svg",
};

export const CredentialItem = ({
  credential,
}: {
  credential: Pick<
    Credential,
    "id" | "name" | "type" | "createdAt" | "updatedAt"
  >;
}) => {
  const removeCredential = useRemoveCredential();
  const logo = credentialLogos[credential.type];

  const handleRemove = () => {
    removeCredential.mutate({ id: credential.id });
  };
  return (
    <EntityItem
      href={`/credentials/${credential.id}`}
      title={credential.name}
      subtitle={
        <>
          {credential.type} &bull; Updated{" "}
          {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex justify-center items-center">
          <Image
            src={logo}
            alt={credential.type}
            width={20}
            height={20}
            className=" size-5 text-muted-foreground"
          />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
