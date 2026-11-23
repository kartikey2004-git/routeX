import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect } from "react";
import { useWsStore } from "../hooks/useWs";
import { toast } from "sonner";
import { getConnectionDotColor, type ConnectionState } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

const toConnectionState = (status: string): ConnectionState => {
  if (status === "connected") return "connected";
  if (status === "connecting" || status === "reconnecting")
    return "connecting";
  if (status === "error") return "error";
  return "disconnected";
};

/*
  One connection row: endpoint, state, and a single action. Connect is the
  primary (orange) action; when a socket is live, Disconnect becomes a quiet
  outline so the view doesn't invite a destructive click by accident.
*/
const RealtimeConnectionBar = () => {
  const {
    status,
    isConnected,
    error,
    url: connectedUrl,
    reconnectAttempts,
    maxReconnectAttempts,
    connect,
    disconnect,
  } = useWsStore();

  const [url, setUrl] = useState(connectedUrl || "");

  useEffect(() => {
    setUrl(connectedUrl || "");
  }, [connectedUrl]);

  const connectionState = toConnectionState(status);
  const isBusy = status === "connecting" || status === "reconnecting";

  const statusLabel =
    status === "reconnecting"
      ? `Reconnecting (${reconnectAttempts}/${maxReconnectAttempts})`
      : status === "connected"
        ? "Connected"
        : status === "connecting"
          ? "Connecting"
          : status === "error"
            ? "Connection failed"
            : "Not connected";

  const buttonLabel =
    status === "connected"
      ? "Disconnect"
      : isBusy
        ? "Connecting…"
        : status === "error"
          ? "Try again"
          : "Connect";

  const onConnect = useCallback(() => {
    if (isConnected) {
      disconnect();
      return;
    }
    if (!url.trim()) {
      toast.info("Enter a WebSocket URL, such as ws://localhost:8080");
      return;
    }
    connect(url, {
      onError: (err) => {
        console.error("WebSocket connection error:", err);
      },
      autoReconnect: true,
      reconnectDelay: 3000,
    });
  }, [url, isConnected, connect, disconnect]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor="ws-url" className="sr-only">
          WebSocket URL
        </label>
        <Input
          id="ws-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConnect();
          }}
          placeholder="ws://localhost:8080"
          spellCheck={false}
          autoComplete="off"
          disabled={isBusy}
          className="h-8 flex-1 font-mono text-[13px]"
        />
        <Button
          type="button"
          onClick={onConnect}
          disabled={isBusy}
          variant={status === "connected" ? "outline" : "default"}
          className="h-8 min-w-[112px]"
        >
          {buttonLabel}
        </Button>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground" role="status">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            getConnectionDotColor(connectionState),
            isBusy && "animate-pulse",
          )}
        />
        <span className="shrink-0 text-foreground">{statusLabel}</span>
        {connectedUrl && (
          <span className="min-w-0 truncate font-mono">· {connectedUrl}</span>
        )}
        {error && (
          <span className="min-w-0 truncate text-destructive">· {error}</span>
        )}
      </div>
    </div>
  );
};

export default RealtimeConnectionBar;
