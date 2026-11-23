import { specimen } from "../content";
import { cn } from "@/lib/utils";

/*
  A static copy of the real workbench: request bar, body, and response status
  line. The timing bar fills once on load and the response rises in, which is
  the page's one orchestrated motion; reduced motion skips it.
  `bare` drops the outer frame and title bar when a parent already provides them.
*/
export function Specimen({ bare = false }: { bare?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden text-left",
        !bare &&
          "rounded-lg border border-border bg-background",
      )}
    >
      {!bare && (
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </span>
          <span className="ml-2 text-xs text-muted-foreground">Orders · Create order</span>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="w-[72px] shrink-0 rounded-sm border border-border px-2 py-1 text-center font-mono text-xs font-semibold text-accent-text">
          {specimen.method}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
          {specimen.url}
        </span>
        <span className="shrink-0 rounded-sm bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Send
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="space-y-2 p-4">
          <p className="text-xs font-medium text-muted-foreground">Body</p>
          <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed whitespace-pre text-foreground">
            {specimen.requestBody}
          </pre>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl leading-none font-semibold text-success tabular-nums">
              {specimen.status}
            </span>
            <span className="text-xs text-muted-foreground">{specimen.statusText}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
              <span>{specimen.durationMs} ms</span>
              <span>{specimen.sizeLabel}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="motion-safe:animate-[bench-sweep_900ms_cubic-bezier(0.2,0.7,0.2,1)_400ms_both] h-full w-full origin-left rounded-full bg-primary"
                style={{ width: `${(specimen.durationMs / 2000) * 100}%` }}
              />
            </div>
          </div>

          <pre className="motion-safe:animate-[bench-rise_500ms_ease-out_700ms_both] overflow-x-auto font-mono text-[12px] leading-relaxed whitespace-pre text-foreground">
            {specimen.responseBody}
          </pre>
        </div>
      </div>
    </div>
  );
}
