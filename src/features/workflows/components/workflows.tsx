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
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Workflow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    <EntityList
      items={workflows.data.items}
      getKey={(item) => item.id}
      emptyView={<WorkflowsEmptyView />}
    >
      {(workflow) => <WorkflowItem workflow={workflow} />}
    </EntityList>
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

export const WorkflowsLoadingView = () => {
  return <LoadingView message="Loading workflows..." />;
};

export const WorkflowsErrorView = () => {
  return <ErrorView message="Failed to load workflows..." />;
};

export const WorkflowsEmptyView = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  const handleCreate = () => {
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
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any workflows yet."
      />
    </>
  );
};

export const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: workflow.id });
  };
  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex justify-center items-center">
          <WorkflowIcon className=" size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
