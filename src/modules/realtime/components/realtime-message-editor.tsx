/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Copy, Trash2, RefreshCw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import { useWsStore } from "../hooks/useWs";
import RealtimeClientServerLogsTable from "./realtime-client-server-logs-table";
import { useTheme } from "next-themes";

const RealtimeMessageEditor = () => {
  const { send, status, isConnected, draftMessage, setDraftMessage, messages } =
    useWsStore();

  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState("");
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!draftMessage) {
      const initial =
        '{\n  "type": "message",\n  "content": "Hello WebSocket!",\n  "timestamp": "' +
        new Date().toISOString() +
        '"\n}';
      setDraftMessage(initial);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!status || status !== "connected") {
      toast.info("WebSocket is not connected!");
      return;
    }

    if (!draftMessage || !draftMessage.trim()) {
      toast.info("Please enter a message!");
      return;
    }

    try {
      setIsSending(true);

      // Try to parse JSON to validate
      let messageToSend;
      try {
        messageToSend = JSON.parse(draftMessage);
      } catch (e) {
        // If not valid JSON, send as string
        messageToSend = draftMessage;
      }

      const success = send(messageToSend);
      if (success) {
        setLastSent(draftMessage);
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        "Error sending message: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsSending(false);
    }
  }, [draftMessage, send, isConnected]);

  // Initialize Monaco Editor

  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: true,
      });

      // Set editor options
      editor.updateOptions({
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        formatOnPaste: true,
        formatOnType: true,
      });

      // Add keyboard shortcut for sending (Ctrl+Enter)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        handleSendMessage();
      });
    },
    [handleSendMessage],
  );

  const handleFormatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(draftMessage);
      const formatted = JSON.stringify(parsed, null, 2);
      setDraftMessage(formatted);
      if (editorRef.current) {
        // @ts-ignore
        editorRef.current.setValue(formatted);
      }
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  }, [draftMessage, setDraftMessage]);

  const handleClearMessage = useCallback(() => {
    const emptyMessage = "{\n  \n}";
    setDraftMessage(emptyMessage);
    if (editorRef.current) {
      // @ts-ignore
      editorRef.current.setValue(emptyMessage);
      // @ts-ignore
      editorRef.current.focus();
    }
  }, [setDraftMessage]);

  const handleCopyMessage = useCallback(() => {
    navigator.clipboard
      .writeText(draftMessage)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message:", err);
      });
  }, [draftMessage]);

  return (
    <Card className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Message Editor
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={status === "connected" ? "success" : "destructive"}>
            {status === "connected" ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div className="overflow-hidden rounded-md border border-border">
          {/* Monaco Editor */}
          <Editor
            height="150px"
            language="json"
            theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
            value={draftMessage}
            onChange={(value) => setDraftMessage(value || "")}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              folding: true,
              lineNumbers: "on",
              renderWhitespace: "boundary",
              cursorStyle: "line",
              contextmenu: true,
              mouseWheelZoom: false,
            }}
            loading={<Skeleton className="h-[150px] w-full rounded-none" />}
          />
        </div>

        {/* Editor Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFormatJSON}
            className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="size-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopyMessage}
            className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Copy className="size-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClearMessage}
            className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      {/* Send Button and Info */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Press Ctrl+Enter to send • JSON auto-validation enabled
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={status !== "connected" || isSending}
          className="font-medium"
        >
          <Send size={16} className="mr-2" />
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>

      <RealtimeClientServerLogsTable />
    </Card>
  );
};

export default RealtimeMessageEditor;
