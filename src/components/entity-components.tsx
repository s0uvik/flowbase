import {
  AlertTriangleIcon,
  ChevronLeft,
  ChevronRight,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button disabled={disabled || isCreating} onClick={onNew} size="sm">
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button disabled={disabled || isCreating} size="sm" asChild>
          <Link prefetch href={newButtonHref}>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-fuly">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
  disabled,
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        className=" max-w-[200px] bg-background shadow-none border-border pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <p>
          Page {page} of {totalPages}
        </p>
      </div>
      <div className="flex flex-row items-center gap-x-4">
        <Button
          disabled={page === 1 || disabled}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          size="sm"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          size="sm"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

type StateViewProps = {
  message?: string;
};

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-destructive" />
      {!!message && <p className="text-sm text-destructive">{message}</p>}
      <Button size="sm" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
};

type EmptyViewProps = StateViewProps & {
  onNew: () => void;
};

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button size="sm" onClick={onNew}>
            <PlusIcon className="size-4" />
            New workflow
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

type EntityListProps<T> = {
  items: T[];
  children: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string;
  className?: string;
  emptyView?: React.ReactNode;
};

export const EntityList = <T,>({
  items,
  children,
  getKey,
  className,
  emptyView,
}: EntityListProps<T>) => {
  if (items.length === 0 && emptyView) {
    return (
      <div className=" flex fex-1 justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => {
        return (
          <div key={getKey ? getKey(item, index) : index}>
            {children(item, index)}
          </div>
        );
      })}
    </div>
  );
};

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
};

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    console.log("first");
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;
    if (onRemove) await onRemove();
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && " opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div className="">
              <CardTitle className=" text-base font-medium">{title}</CardTitle>
              {!!subtitle && <CardDescription>{subtitle}</CardDescription>}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className=" flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isRemoving}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    onClick={(e) => e.stopPropagation()}
                    align="end"
                  >
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className=" size-4" /> Delete..
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
