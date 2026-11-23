"use client";
import React from "react";
import { RequestTab } from "../store/useRequestStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRunRequest, useRunDirectRequest } from "../hooks/request";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Kbd } from "@/components/ui/kbd";
import { getMethodColor } from "@/lib/status-colors";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

/*
  The one place to act on a request: method, URL, send. The URL field is
  monospace because URLs are data, and ⌘↵ sends from anywhere in the editor.
*/
const RequestBar = ({ tab, updateTab }: Props) => {
  const { mutateAsync: runSavedRequest, isPending: isSavedPending } =
    useRunRequest(tab?.requestId ?? "");
  const { mutateAsync: runDirectRequest, isPending: isDirectPending } =
    useRunDirectRequest();

  const isPending = isSavedPending || isDirectPending;
  const canSend = Boolean(tab?.url?.trim()) && !isPending;

  const onSendRequest = async () => {
    if (!canSend) return;
    try {
      // Saved requests run through the collection; unsaved ones run directly.
      if (tab.requestId) {
        await runSavedRequest();
      } else {
        await runDirectRequest();
      }
    } catch {
      toast.error("Couldn't send the request. Check the URL and try again.");
    }
  };

  useHotkeys(
    "mod+enter",
    (e) => {
      e.preventDefault();
      onSendRequest();
    },
    { enableOnFormTags: true },
    [tab?.id, tab?.url, tab?.requestId, isPending],
  );

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-3">
      <Select
        value={tab.method}
        onValueChange={(value) => updateTab(tab.id, { method: value })}
      >
        <SelectTrigger
          aria-label="HTTP method"
          className="h-8 w-[104px] shrink-0 border-input bg-surface-raised font-mono text-[13px] font-semibold"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {METHODS.map((method) => (
            <SelectItem
              key={method}
              value={method}
              className={`font-mono font-semibold ${getMethodColor(method)}`}
            >
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={tab?.url || ""}
        onChange={(e) => updateTab(tab.id, { url: e.target.value })}
        onKeyDown={(e) => {
          // Plain Enter sends here; ⌘/Ctrl+Enter is handled by the hotkey below.
          if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onSendRequest();
          }
        }}
        placeholder="https://api.example.com/resource"
        aria-label="Request URL"
        spellCheck={false}
        autoComplete="off"
        className="h-8 min-w-0 flex-1 font-mono text-[13px]"
      />

      <Button
        type="button"
        onClick={onSendRequest}
        disabled={!canSend}
        className="h-8 min-w-[88px] gap-2 px-4"
        aria-keyshortcuts="Meta+Enter Control+Enter"
      >
        {isPending ? (
          <>
            <Spinner />
            Sending
          </>
        ) : (
          <>
            <Send />
            Send
            <Kbd className="ml-1 hidden border-primary-foreground/25 bg-primary-foreground/15 text-primary-foreground sm:inline-flex">
              ⌘↵
            </Kbd>
          </>
        )}
      </Button>
    </div>
  );
};

export default RequestBar;
