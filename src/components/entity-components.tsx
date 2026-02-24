import { ChevronLeft, ChevronRight, PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

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
      <div
        className="mx-auto max-w-screen-xl w-full flex flex-col
gap-y-8 h-fuly"
      >
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
