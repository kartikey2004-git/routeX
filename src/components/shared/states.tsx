import type { LucideIcon } from "lucide-react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";

/*
  Every list, panel and page has three designed states besides its content:
  empty (an invitation to act), loading (the shape of the content), and error
  (what happened and what to do next). All three use the same shadcn parts,
  so they look the same everywhere.
*/

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
  shortcut?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  shortcut,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn("gap-4 border-0 p-6 text-left md:p-8", className)}>
      <EmptyHeader className="items-start gap-2 text-left">
        {Icon && (
          <EmptyMedia variant="icon" className="mb-1">
            <Icon strokeWidth={1.5} />
          </EmptyMedia>
        )}
        <EmptyTitle className="text-sm font-medium">{title}</EmptyTitle>
        {description && (
          <EmptyDescription className="max-w-[32ch] text-sm leading-relaxed">
            {description}
          </EmptyDescription>
        )}
      </EmptyHeader>
      {action && (
        <EmptyContent className="items-start">
          <Button size="sm" variant="secondary" onClick={action.onClick}>
            {action.icon && <action.icon />}
            {action.label}
            {shortcut && <Kbd className="ml-1">{shortcut}</Kbd>}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      className={cn("border-destructive/30 bg-destructive/5", className)}
    >
      <AlertTriangle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="mt-2 h-7 text-foreground"
            onClick={onRetry}
          >
            <RotateCw />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-6 rounded-sm"
          style={{ width: `${70 - index * 8}%` }}
        />
      ))}
    </div>
  );
}
