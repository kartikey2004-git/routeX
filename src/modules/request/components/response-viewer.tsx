"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Eraser, AlertTriangle } from "lucide-react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useTheme } from "next-themes";
import { getStatusColor } from "@/lib/status-colors";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-48 w-full rounded-md" />,
});

type HeadersMap = Record<string, string>;

interface RequestRun {
  id: string;
  requestId?: string;
  status?: number;
  statusText?: string;
  headers?: HeadersMap;
  body?: string | object | null;
  durationMs?: number;
  createdAt?: string;
}

interface Result {
  status?: number;
  statusText?: string;
  duration?: number;
  size?: number;
}

export interface ResponseData {
  success: boolean;
  error?: string;
  requestRun: RequestRun;
  result?: Result;
}

interface Props {
  responseData: ResponseData;
}

// Timing bar scale: anything at or beyond this fills the bar.
const TIMING_SCALE_MS = 2000;

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ResponseViewer = ({ responseData }: Props) => {
  const [activeTab, setActiveTab] = useState("body");
  const [pretty, setPretty] = useState(true);
  const [copied, setCopied] = useState(false);
  const { clearResponseViewerData } = useRequestPlaygroundStore();
  const { resolvedTheme } = useTheme();

  const rawBody = responseData.requestRun?.body;
  const rawText =
    typeof rawBody === "string"
      ? rawBody
      : rawBody == null
        ? ""
        : JSON.stringify(rawBody, null, 2);

  // Pretty view formats JSON when it parses; anything else is shown as-is.
  const formattedJson = useMemo(() => {
    if (!rawText) return null;
    try {
      return JSON.stringify(JSON.parse(rawText), null, 2);
    } catch {
      return null;
    }
  }, [rawText]);

  const isJson = formattedJson !== null;
  const prettyText = formattedJson ?? rawText;
  const shownText = pretty ? prettyText : rawText;

  const status: number | undefined =
    responseData.result?.status ?? responseData.requestRun?.status;
  const statusText: string | undefined =
    responseData.result?.statusText ?? responseData.requestRun?.statusText;
  const duration: number | undefined =
    responseData.result?.duration ?? responseData.requestRun?.durationMs;

  const size =
    responseData.result?.size ??
    (rawText ? new TextEncoder().encode(rawText).length : 0);

  const headerEntries = Object.entries(responseData.requestRun?.headers ?? {});
  const failed = !responseData.success || !status;

  const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "vs-light";

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; nothing else to do */
    }
  };

  const timingWidth = Math.min(
    100,
    ((duration ?? 0) / TIMING_SCALE_MS) * 100,
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Status line: the first thing anyone reads after sending. */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-border bg-background px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-mono text-2xl leading-none font-semibold tabular-nums",
              getStatusColor(status),
            )}
          >
            {status ?? "—"}
          </span>
          <span className="max-w-[18ch] truncate text-sm text-muted-foreground">
            {statusText || (failed ? "No response" : "")}
          </span>
        </div>

        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between font-mono text-xs text-foreground tabular-nums">
            <span>{duration != null ? `${duration} ms` : "—"}</span>
            <span className="text-muted-foreground">
              {formatBytes(size)}
            </span>
          </div>
          <Progress
            value={timingWidth}
            className="h-1"
            aria-label="Response time"
            title={`Scale: ${TIMING_SCALE_MS / 1000} s`}
          />
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={copied ? "Copied" : "Copy response body"}
            title="Copy body"
            onClick={() => copy(shownText)}
            disabled={!shownText}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Clear response"
            title="Clear response"
            onClick={clearResponseViewerData}
          >
            <Eraser />
          </Button>
        </div>
      </div>

      {failed && responseData.error && (
        <div className="flex shrink-0 items-start gap-2 border-b border-border bg-destructive/5 px-4 py-2.5 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="min-w-0 break-words text-foreground">
            {responseData.error}
          </p>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="min-h-0 flex-1 gap-0"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4">
          <TabsList className="h-8 gap-4 bg-transparent p-0">
            <TabsTrigger
              value="body"
              className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[13px] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Body
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[13px] text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Headers
              <span className="ml-1.5 rounded-sm bg-muted px-1 font-mono text-[11px] text-muted-foreground">
                {headerEntries.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {activeTab === "body" && rawText && isJson && (
            <div
              role="group"
              aria-label="Body view"
              className="flex items-center rounded-sm bg-muted p-0.5 text-xs"
            >
              {(["Pretty", "Raw"] as const).map((label) => {
                const isPretty = label === "Pretty";
                const selected = pretty === isPretty;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPretty(isPretty)}
                    className={cn(
                      "rounded-sm px-2 py-0.5 transition-colors",
                      selected
                        ? "bg-surface-raised text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <TabsContent value="body" className="min-h-0 flex-1">
          {shownText ? (
            <div className="h-full min-h-48">
              <MonacoEditor
                height="100%"
                language={pretty && isJson ? "json" : "plaintext"}
                value={shownText}
                theme={editorTheme}
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 8,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "none",
                  padding: { top: 10, bottom: 10 },
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            </div>
          ) : (
            <EmptyState
              title="This response has no body"
              description="The server answered without content. Check the status and headers for details."
              className="px-4 py-6"
            />
          )}
        </TabsContent>

        <TabsContent value="headers" className="min-h-0 flex-1 overflow-y-auto">
          {headerEntries.length === 0 ? (
            <EmptyState
              title="No headers"
              description="The response didn't include any headers."
              className="px-4 py-6"
            />
          ) : (
            <dl className="divide-y divide-border">
              {headerEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="group grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-start gap-4 px-4 py-2 text-[13px]"
                >
                  <dt className="font-mono text-foreground break-all">{key}</dt>
                  <dd className="font-mono break-all text-muted-foreground">
                    {String(value)}
                  </dd>
                  <button
                    type="button"
                    onClick={() => copy(`${key}: ${value}`)}
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-foreground"
                    aria-label={`Copy header ${key}`}
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              ))}
            </dl>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;
