"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useRouter } from "next/navigation";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { ExecutionStatus } from "@prisma/client";
import {
  CheckCircle2Icon,
  CircleXIcon,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow, differenceInSeconds } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ExecutionStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  [ExecutionStatus.RUNNING]: {
    label: "Running",
    icon: <Loader2Icon className="size-3 animate-spin" />,
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  [ExecutionStatus.COMPLETED]: {
    label: "Completed",
    icon: <CheckCircle2Icon className="size-3" />,
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
  [ExecutionStatus.FAILED]: {
    label: "Failed",
    icon: <CircleXIcon className="size-3" />,
    className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  },
};

function formatDuration(startedAt: Date, completedAt: Date): string {
  const totalSeconds = differenceInSeconds(
    new Date(completedAt),
    new Date(startedAt),
  );
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m ${seconds}s`;
}

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setSearchParams] = useExecutionsParams();
  return (
    <EntityPagination
      page={executions.data.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => setSearchParams({ ...params, page })}
      disabled={executions.isFetching}
    />
  );
};

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(item) => item.id}
      emptyView={<ExecutionsEmptyView />}
    >
      {(execution) => <ExecutionItem execution={execution} />}
    </EntityList>
  );
};

export const ExecutionsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Executions"
      description="View and monitor your workflow executions"
      newButtonLabel="New execution"
      disabled={disabled}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoadingView = () => {
  return <LoadingView message="Loading executions..." />;
};

export const ExecutionsErrorView = () => {
  return <ErrorView message="Failed to load executions..." />;
};

export const ExecutionsEmptyView = () => {
  const router = useRouter();
  return (
    <EmptyView
      onNew={() => {
        router.push("/workflows");
      }}
      message="No executions yet. Run a workflow to see executions here."
    />
  );
};

const StatusBadge = ({ status }: { status: ExecutionStatus }) => {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

type ExecutionWithWorkflow = {
  id: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  error: string | null;
  workflow: {
    id: string;
    name: string;
  };
};

export const ExecutionItem = ({
  execution,
}: {
  execution: ExecutionWithWorkflow;
}) => {
  const durationText = execution.completedAt
    ? `Duration: ${formatDuration(execution.startedAt, execution.completedAt)}`
    : "In progress...";

  return (
    <EntityItem
      href={`/executions/${execution.id}`}
      title={execution.workflow.name}
      subtitle={
        <>
          Started{" "}
          {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
          {execution.completedAt && <> &bull; {durationText}</>}
        </>
      }
      image={
        <div className="flex justify-center items-center rounded-md bg-muted p-2">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      actions={<StatusBadge status={execution.status} />}
    />
  );
};
