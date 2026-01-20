import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlugZap, Plug, AlertCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useWsStore } from "../hooks/useWs";
import { toast } from "sonner";

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

  // keep local input in sync with connectedUrl

  useEffect(() => {
    setUrl(connectedUrl || "");
  }, [connectedUrl]);

  const getConnectionColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-600 hover:bg-green-700";
      case "connecting":
      case "reconnecting":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-muted hover:bg-muted/80";
    }
  };

  const getConnectionIcon = () => {
    switch (status) {
      case "connected":
        return <Plug size={20} />;
      case "connecting":
      case "reconnecting":
        return <PlugZap size={20} className="animate-pulse" />;
      case "error":
        return <AlertCircle size={20} />;
      default:
        return <PlugZap size={20} />;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "connected":
        return "Disconnect";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return `Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`;
      case "error":
        return "Retry";
      default:
        return "Connect";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "reconnecting":
        return `reconnecting (${reconnectAttempts}/${maxReconnectAttempts})`;
      default:
        return status;
    }
  };

  const onConnect = useCallback(() => {
    if (!url.trim()) {
      toast.info("Please enter a WebSocket URL");
      return;
    }

    if (isConnected) {
      // Disconnect if already connected
      disconnect();
    } else {
      // Connect to WebSocket
      connect(url, {
        onOpen: () => {
          console.log("Successfully connected to:", url);
        },
        onClose: () => {
          console.log("Disconnected from WebSocket");
        },
        onError: (error) => {
          console.error("WebSocket connection error:", error);
        },
        onMessage: (event) => {
          console.log("Received message:", event.data);
        },
        autoReconnect: true,
        reconnectDelay: 3000,
      });
    }
  }, [url, isConnected, connect, disconnect]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onConnect();
      }
    },
    [onConnect],
  );

  return (
    <div className="flex flex-row items-center justify-between bg-card border rounded-md px-2 py-2 w-full shadow-sm">
      <div className="flex flex-row items-center gap-2 flex-1">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter WebSocket URL (e.g., ws://localhost:8080)"
          className="flex-1 bg-background border-input text-foreground placeholder-muted-foreground"
          disabled={status === "connecting" || status === "reconnecting"}
        />
      </div>

      <div className="flex items-center gap-2 ">
        {/* Connection Status Indicator */}
        <div className="flex px-2 flex-col items-end text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "connected"
                  ? "bg-green-600"
                  : status === "connecting" || status === "reconnecting"
                    ? "bg-yellow-600 animate-pulse"
                    : status === "error"
                      ? "bg-red-600"
                      : "bg-muted-foreground"
              }`}
            />
            <span className="capitalize">{getStatusText()}</span>
          </div>
          {connectedUrl && (
            <div className="text-[10px] text-muted-foreground max-w-32 truncate">
              {connectedUrl}
            </div>
          )}
          {error && (
            <div className="text-[10px] text-destructive max-w-32 truncate">
              {error}
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={onConnect}
          disabled={status === "connecting" || status === "reconnecting"}
          className={`ml-2 text-primary-foreground font-semibold transition-colors ${getConnectionColor()}`}
        >
          <span className="flex items-center gap-2">
            {getConnectionIcon()}
            {getButtonText()}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default RealtimeConnectionBar;
