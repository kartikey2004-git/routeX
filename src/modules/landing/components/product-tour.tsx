"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { tour, type TourTab } from "../content";
import { Specimen } from "./specimen";

/* ---- Mock panels: faithful to the workbench, shown as illustrations ---- */

function WebSocketMock() {
  const log = [
    { dir: "out", time: "10:42:07.113", text: '{"type":"subscribe","channel":"orders"}' },
    { dir: "in", time: "10:42:07.201", text: '{"type":"ack","channel":"orders"}' },
    { dir: "in", time: "10:42:09.744", text: '{"type":"order.updated","id":"ord_8f2c1a","status":"paid"}' },
    { dir: "out", time: "10:42:12.030", text: '{"type":"ping"}' },
  ];
  return (
    <div className="text-left">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        <span className="font-mono text-xs text-foreground">wss://realtime.example.com/ws</span>
        <span className="ml-auto text-xs text-muted-foreground">Connected</span>
      </div>
      <ul className="divide-y divide-border">
        {log.map((row, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-3">
            <span
              className={cn(
                "mt-px w-20 shrink-0 font-mono text-[11px] font-semibold",
                row.dir === "out" ? "text-accent-text" : "text-success",
              )}
            >
              {row.dir === "out" ? "↑ Sent" : "↓ Received"}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground">
              {row.text}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {row.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollectionsMock() {
  const requests = [
    { method: "GET", name: "List orders", active: false },
    { method: "POST", name: "Create order", active: true },
    { method: "PATCH", name: "Update status", active: false },
    { method: "DELETE", name: "Cancel order", active: false },
  ];
  const methodColor: Record<string, string> = {
    GET: "text-success",
    POST: "text-info",
    PATCH: "text-method-patch",
    DELETE: "text-destructive",
  };
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] text-left">
      <aside className="space-y-1 border-r border-border bg-surface p-3">
        <p className="px-1.5 pt-1 pb-2 text-[13px] font-semibold text-foreground">Collections</p>
        <p className="flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-[13px] font-medium text-foreground">
          <span className="text-muted-foreground">▾</span> Orders
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">4</span>
        </p>
        <ul className="ml-2 space-y-px border-l border-border pl-2">
          {requests.map((r) => (
            <li
              key={r.name}
              className={cn(
                "relative flex items-center gap-2 rounded-sm px-2 py-1 text-[12px]",
                r.active ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              {r.active && (
                <span className="absolute inset-y-1 left-0 w-0.5 bg-primary" aria-hidden="true" />
              )}
              <span className={cn("w-12 shrink-0 font-mono text-[10px] font-semibold", methodColor[r.method])}>
                {r.method}
              </span>
              <span className="truncate">{r.name}</span>
            </li>
          ))}
        </ul>
      </aside>
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-sm border border-border px-2.5 py-2">
          <span className="font-mono text-[11px] font-semibold text-info">POST</span>
          <span className="truncate font-mono text-[12px] text-foreground">
            https://api.example.com/v1/orders
          </span>
        </div>
        <div className="mt-4 flex gap-4 border-b border-border text-[12px]">
          <span className="border-b-2 border-primary pb-1.5 text-foreground">Body</span>
          <span className="pb-1.5 text-muted-foreground">
            Headers <span className="font-mono text-[10px]">2</span>
          </span>
        </div>
        <pre className="mt-4 font-mono text-[12px] leading-relaxed text-foreground">{`{
  "sku": "KB-104",
  "quantity": 2
}`}</pre>
      </div>
    </div>
  );
}

function AiMock() {
  return (
    <div className="space-y-4 p-5 text-left">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Describe the body you need</p>
        <div className="rounded-sm border border-border bg-background px-3 py-2 text-[13px] text-foreground">
          A user registration with email, password and a marketing opt-in
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Replaces the current body</span>
        <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          Generate
        </span>
      </div>
      <pre className="rounded-sm border border-border bg-surface p-3 font-mono text-[12px] leading-relaxed text-foreground">{`{
  "email": "user@example.com",
  "password": "••••••••",
  "marketingOptIn": false
}`}</pre>
    </div>
  );
}

function PanelFor({ id }: { id: TourTab["id"] }) {
  switch (id) {
    case "rest":
      return <Specimen bare />;
    case "websocket":
      return <WebSocketMock />;
    case "collections":
      return <CollectionsMock />;
    case "ai":
      return <AiMock />;
  }
}

/* ---- Tour: segmented control, framed window, arrow-key navigation ---- */

export function ProductTour() {
  const [activeId, setActiveId] = useState(tour[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = tour.find((t) => t.id === activeId) ?? tour[0];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tour.findIndex((t) => t.id === activeId);
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tour.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tour.length) % tour.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tour.length - 1;
    else return;
    e.preventDefault();
    setActiveId(tour[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="product"
      aria-labelledby="product-heading"
      className="scroll-mt-16 mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="max-w-2xl space-y-4">
        <h2 id="product-heading" className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
          One workbench for the whole request
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Build, send, read and keep requests without switching tools.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Product areas"
        onKeyDown={onKeyDown}
        className="mt-12 inline-flex max-w-full overflow-x-auto rounded-md border border-border bg-surface p-1"
      >
        {tour.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "rounded-sm px-4 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-background font-medium text-foreground shadow-[0_0_0_1px_var(--border)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-14">
        <div
          className="space-y-4 lg:pt-6"
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          <h3 className="text-xl font-semibold tracking-tight text-foreground">{active.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{active.body}</p>
          <ul className="space-y-3 pt-2 text-sm text-foreground">
            {active.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </span>
            <span className="ml-2 text-xs text-muted-foreground">{active.label}</span>
          </div>
          <div key={active.id} className="motion-safe:animate-[bench-rise_400ms_ease-out_both] min-h-[300px]">
            <PanelFor id={active.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
