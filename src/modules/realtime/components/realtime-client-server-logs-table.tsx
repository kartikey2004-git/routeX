/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useWsStore } from "../hooks/useWs";
import { ArrowDownLeft, ArrowUpRight, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formatTimestamp = (timestamp: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  }).format(timestamp);

const formatMessageData = (data: any) => {
  if (typeof data === "string") {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
};

const previewOf = (data: any) =>
  typeof data === "string" ? data : JSON.stringify(data);

/*
  Message log. Sent and received are told apart by direction (arrow and
  colour) rather than by colour alone. Arrow keys move through messages while
  the list is focused, and Enter expands the selected one.
*/
const RealtimeClientServerLogsTable = () => {
  const { messages, clearMessages } = useWsStore();
  const [selected, setSelected] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Follow new traffic unless the user has picked a message.
  useEffect(() => {
    if (messages.length > 0 && selected === -1 && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, selected]);

  const focusRow = (index: number) => {
    setSelected(index);
    rowRefs.current[index]?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (messages.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusRow(selected < 0 ? 0 : Math.min(messages.length - 1, selected + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusRow(
        selected < 0 ? messages.length - 1 : Math.max(0, selected - 1),
      );
    } else if (e.key === "Escape") {
      setSelected(-1);
    }
  };

  const copyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied");
    } catch {
      toast.error("Couldn't copy the message.");
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-md border border-border">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-3">
        <h2 className="text-sm font-semibold text-foreground">
          Messages
          <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
            {messages.length}
          </span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[13px] text-muted-foreground hover:text-destructive"
          onClick={clearMessages}
          disabled={messages.length === 0}
        >
          <Trash2 />
          Clear
        </Button>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Sent and received messages appear here as they happen."
          className="px-4 py-8"
        />
      ) : (
        <div
          ref={listRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Message log. Use arrow keys to move between messages."
          className="min-h-0 flex-1 overflow-auto outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <ul className="divide-y divide-border">
            {messages.map((message, index) => {
              const isSent = message.type === "sent";
              const isOpen = selected === index;
              return (
                <li
                  key={message.id}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className={cn(
                    "group cursor-pointer px-3 py-2 transition-colors",
                    isOpen ? "bg-muted" : "hover:bg-muted/50",
                  )}
                  onClick={() => setSelected(isOpen ? -1 : index)}
                  aria-current={isOpen ? "true" : undefined}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "flex items-center gap-1 font-medium",
                        isSent ? "text-primary" : "text-success",
                      )}
                    >
                      {isSent ? (
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                      )}
                      <span className="sr-only">{isSent ? "Sent" : "Received"}</span>
                      <span aria-hidden="true">{isSent ? "Sent" : "Received"}</span>
                    </span>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto size-6 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Copy message"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyMessage(message.raw || formatMessageData(message.data));
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>

                  {isOpen ? (
                    <div className="mt-2 space-y-2">
                      <pre className="overflow-x-auto rounded-sm border border-border bg-background p-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
                        {formatMessageData(message.data)}
                      </pre>
                      {message.raw &&
                        message.raw !== formatMessageData(message.data) && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer select-none hover:text-foreground">
                              Raw frame
                            </summary>
                            <pre className="mt-1.5 overflow-x-auto rounded-sm border border-border bg-background p-2.5 font-mono whitespace-pre-wrap break-words">
                              {message.raw}
                            </pre>
                          </details>
                        )}
                    </div>
                  ) : (
                    <p className="mt-1 truncate font-mono text-[12px] text-muted-foreground">
                      {previewOf(message.data)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {selected >= 0 && (
        <div className="shrink-0 border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
          <span className="font-mono">
            {selected + 1} / {messages.length}
          </span>
          <span> · ↑↓ move · esc clear selection</span>
        </div>
      )}
    </section>
  );
};

export default RealtimeClientServerLogsTable;
