/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useWsStore } from "../hooks/useWs";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const RealtimeClientServerLogsTable = () => {
  const { messages, clearMessages } = useWsStore();
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && selectedMessageIndex === -1) {
      scrollToBottom();
    }
  }, [messages.length, selectedMessageIndex]);

  // Update row refs array when messages change
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, messages.length);
  }, [messages.length]);

  const scrollToBottom = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  };

  const scrollToRow = (index: number) => {
    const row = rowRefs.current[index];
    if (row && tableRef.current) {
      const containerRect = tableRef.current.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();

      if (
        rowRect.top < containerRect.top ||
        rowRect.bottom > containerRect.bottom
      ) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleNavigateUp = () => {
    if (messages.length === 0) return;

    const newIndex =
      selectedMessageIndex === -1
        ? messages.length - 1
        : Math.max(0, selectedMessageIndex - 1);

    setSelectedMessageIndex(newIndex);
    scrollToRow(newIndex);
  };

  const handleNavigateDown = () => {
    if (messages.length === 0) return;

    const newIndex =
      selectedMessageIndex === -1
        ? 0
        : selectedMessageIndex + 1 < messages.length
          ? selectedMessageIndex + 1
          : -1;

    setSelectedMessageIndex(newIndex);

    if (newIndex === -1) {
      scrollToBottom();
    } else {
      scrollToRow(newIndex);
    }
  };

  const handleRowClick = (index: number) => {
    setSelectedMessageIndex(selectedMessageIndex === index ? -1 : index);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    }).format(timestamp);
  };

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

  const getMessageTypeIcon = (type: "sent" | "received") => {
    return type === "sent" ? (
      <ArrowUpRight size={16} className="text-primary" />
    ) : (
      <ArrowDownLeft size={16} className="text-success" />
    );
  };

  return (
    <Card className="flex h-full flex-col gap-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Message Logs</h3>
          <span className="text-xs text-muted-foreground">
            ({messages.length} messages)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavigateUp}
            disabled={messages.length === 0}
            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Navigate up (previous message)"
          >
            <ChevronUp size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavigateDown}
            disabled={messages.length === 0}
            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Navigate down (next message)"
          >
            <ChevronDown size={16} />
          </Button>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Clear messages */}
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-destructive"
            title="Clear all messages"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Messages Table */}
      <div ref={tableRef} className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center px-4">
            <Inbox className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No messages yet. Connect to a WebSocket to see message logs.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={`
                  cursor-pointer rounded-md border border-border p-3 transition-colors duration-200
               
                  ${
                    selectedMessageIndex === index
                      ? "bg-muted ring-1 ring-ring"
                      : "hover:bg-muted/60"
                  }
                `}
                onClick={() => handleRowClick(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon(message.type)}
                    <span
                      className={`text-sm font-medium capitalize ${
                        message.type === "sent"
                          ? "text-primary"
                          : "text-success"
                      }`}
                    >
                      {message.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          message.raw || formatMessageData(message.data),
                        );
                      }}
                      className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Copy message"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-foreground">
                  <div className="overflow-x-auto rounded-md border border-border bg-background p-2 font-mono">
                    {selectedMessageIndex === index ? (
                      <pre className="whitespace-pre-wrap wrap-break-word">
                        {formatMessageData(message.data)}
                      </pre>
                    ) : (
                      <div className="truncate">
                        {typeof message.data === "string"
                          ? message.data
                          : JSON.stringify(message.data)}
                      </div>
                    )}
                  </div>
                </div>

                {selectedMessageIndex === index &&
                  message.raw &&
                  message.raw !== formatMessageData(message.data) && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div className="mb-1 text-muted-foreground">Raw:</div>
                      <div className="overflow-x-auto rounded-md border border-border bg-background p-2 font-mono">
                        <pre className="whitespace-pre-wrap wrap-break-word">
                          {message.raw}
                        </pre>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with selection info */}
      {selectedMessageIndex >= 0 && (
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          Message {selectedMessageIndex + 1} of {messages.length} selected
          {selectedMessageIndex < messages.length - 1 && (
            <span> • Press ↓ for next</span>
          )}
          {selectedMessageIndex > 0 && <span> • Press ↑ for previous</span>}
        </div>
      )}
    </Card>
  );
};

export default RealtimeClientServerLogsTable;
