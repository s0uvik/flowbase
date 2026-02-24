"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsSearch = () => {
  const [params, setSearchParams] = useWorkflowParams();
  const { search, onSearchChange } = useEntitySearch({
    params,
    setSearch: setSearchParams,
  });
  return (
    <EntitySearch
      value={search}
      onChange={onSearchChange}
      placeholder="Search workflows"
    />
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setSearchParams] = useWorkflowParams();
  return (
    <EntityPagination
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
      onPageChange={(page) => setSearchParams({ ...params, page })}
      disabled={workflows.isFetching}
    />
  );
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();
  return (
    <div>
      <h1>{JSON.stringify(workflows.data)}</h1>
    </div>
  );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreateWorkflow}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
