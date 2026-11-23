import { Skeleton } from "@/components/ui/skeleton";

/*
  Shape of the workbench while it loads: the header, the collections column,
  and the request and response panes. Matching the real layout means content
  fills in without the page jumping.
*/
export function WorkbenchSkeleton({ label = "Loading workbench" }: { label?: string }) {
  return (
    <div
      className="flex h-full min-h-0 w-full flex-1"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <aside className="hidden w-[22%] min-w-52 shrink-0 space-y-3 border-r border-border bg-surface p-3 md:block">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3 p-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="mt-auto space-y-3 border-t border-border p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
