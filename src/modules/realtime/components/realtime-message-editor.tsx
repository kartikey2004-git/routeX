/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlignLeft, Copy, Eraser, Send } from "lucide-react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import { useWsStore } from "../hooks/useWs";
import RealtimeClientServerLogsTable from "./realtime-client-server-logs-table";
import { useTheme } from "next-themes";

/*
  Outgoing message composer on top, the live message log below. Sending is
  only possible while connected, and the reason is shown next to the button
  instead of leaving a silently disabled control.
*/
const RealtimeMessageEditor = () => {
  const { send, status, draftMessage, setDraftMessage } =
    useWsStore();

  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  const isLive = status === "connected";

  useEffect(() => {
    if (!draftMessage) {
      const initial =
        '{\n  "type": "message",\n  "content": "Hello WebSocket!",\n  "timestamp": "' +
        new Date().toISOString() +
        '"\n}';
      setDraftMessage(initial);
    }
  }, [draftMessage, setDraftMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!isLive) {
      toast.info("Connect to a server before sending.");
      return;
    }
    if (!draftMessage || !draftMessage.trim()) {
      toast.info("Write a message to send.");
      return;
    }

    try {
      setIsSending(true);
      let messageToSend;
      try {
        messageToSend = JSON.parse(draftMessage);
      } catch {
        // Not JSON: send the text as-is.
        messageToSend = draftMessage;
      }

      const success = send(messageToSend);
      if (!success) {
        toast.error("The message didn't send. The connection may have dropped.");
      }
    } catch (error) {
      toast.error(
        "Couldn't send: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsSending(false);
    }
  }, [draftMessage, send, isLive]);

  // The editor's Ctrl+Enter command is registered once on mount. Route it through
  // a ref so it always calls the latest send handler (with current connection state).
  const sendRef = useRef(handleSendMessage);
  sendRef.current = handleSendMessage;

  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: true,
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        sendRef.current();
      });
    },
    [],
  );

  const handleFormatJSON = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(draftMessage), null, 2);
      setDraftMessage(formatted);
      editorRef.current?.setValue(formatted);
    } catch {
      toast.error("This isn't valid JSON, so it can't be formatted.");
    }
  }, [draftMessage, setDraftMessage]);

  const handleClearMessage = useCallback(() => {
    const emptyMessage = "{\n  \n}";
    setDraftMessage(emptyMessage);
    editorRef.current?.setValue(emptyMessage);
    editorRef.current?.focus();
  }, [setDraftMessage]);

  const handleCopyMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(draftMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  }, [draftMessage]);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Outgoing message</h2>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" className="h-7 text-[13px]" onClick={handleFormatJSON}>
            <AlignLeft />
            Format
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[13px]" onClick={handleCopyMessage}>
            <Copy />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[13px]" onClick={handleClearMessage}>
            <Eraser />
            Clear
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <Editor
          height="160px"
          language="json"
          theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
          value={draftMessage}
          onChange={(value) => setDraftMessage(value || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            formatOnPaste: true,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            lineNumbers: "on",
            renderWhitespace: "boundary",
            contextmenu: true,
            mouseWheelZoom: false,
            padding: { top: 10, bottom: 10 },
          }}
          loading={<Skeleton className="h-40 w-full rounded-none" />}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {isLive ? (
            <>
              Send with <kbd className="font-mono">Ctrl</kbd>+<kbd className="font-mono">Enter</kbd>.
            </>
          ) : (
            "Connect to a server to send messages."
          )}
        </p>
        <Button
          onClick={handleSendMessage}
          disabled={!isLive || isSending}
          className="min-w-[112px]"
        >
          <Send />
          {isSending ? "Sending…" : "Send"}
        </Button>
      </div>

      <RealtimeClientServerLogsTable />
    </section>
  );
};

export default RealtimeMessageEditor;
