"use client";

import { useSuspenseExecution } from "../hooks/use-executions";
import { ExecutionStatus } from "@prisma/client";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleXIcon,
  ClockIcon,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import { format, formatDistanceToNow, differenceInSeconds } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  const totalSeconds = differenceInSeconds(completedAt, startedAt);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m ${seconds}s`;
}

export const ExecutionDetail = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const config = statusConfig[execution.status];

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center gap-x-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/executions">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-semibold">
            Execution Details
          </h1>
          <p className="text-sm text-muted-foreground">{execution.id}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 font-medium text-sm px-3 py-1",
            config.className,
          )}
        >
          {config.icon}
          {config.label}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1.5">
              <WorkflowIcon className="size-3.5" />
              Workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/workflows/${execution.workflowId}`}
              className="text-sm font-medium hover:underline text-primary"
            >
              View Workflow →
            </Link>
          </CardContent>
        </Card>

        {/* Duration card - hide for failed executions */}
        {execution.status !== ExecutionStatus.FAILED && (
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1.5">
                <ClockIcon className="size-3.5" />
                Duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {execution.completedAt
                  ? formatDuration(
                      new Date(execution.startedAt),
                      new Date(execution.completedAt),
                    )
                  : "In progress..."}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5" />
              Started At
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {format(new Date(execution.startedAt), "PPpp")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(execution.startedAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Completed At card - hide for failed executions */}
        {execution.status !== ExecutionStatus.FAILED && (
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1.5">
                <CalendarIcon className="size-3.5" />
                Completed At
              </CardDescription>
            </CardHeader>
            <CardContent>
              {execution.completedAt ? (
                <>
                  <p className="text-sm font-medium">
                    {format(new Date(execution.completedAt), "PPpp")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(execution.completedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Not completed yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {execution.status === ExecutionStatus.FAILED && execution.error && (
        <Card className="shadow-none border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base text-red-600 dark:text-red-400 flex items-center gap-2">
              <CircleXIcon className="size-4" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-red-500/5 border border-red-500/10 p-4">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {execution.error}
              </p>
            </div>
            {execution.errorStack && (
              <details className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Show stack trace
                </summary>
                <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                  {execution.errorStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )}

      {execution.output && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Output</CardTitle>
            <CardDescription>
              The output data produced by this execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
