"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlignLeft, Check, Copy, Eraser, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useGenerateJsonBody } from "@/modules/ai/hooks/ai-suggestion";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { describeAiError } from "@/modules/ai/services/describe-error";

// Monaco is heavy; load it only when a body is being edited.
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-56 w-full rounded-md" />,
});

type ContentType = "application/json" | "text/plain";

interface BodyEditorProps {
  initialData?: {
    contentType?: ContentType;
    body?: string;
  };
  onSubmit: (data: { contentType: ContentType; body?: string }) => void;
  className?: string;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "application/json", label: "JSON" },
  { value: "text/plain", label: "Plain text" },
];

/*
  Request body. Saves as you type (like the parameter tables), so there is no
  "unsaved" state to remember. Format and copy act on the current text only.
*/
const BodyEditor: React.FC<BodyEditorProps> = ({
  initialData = { contentType: "application/json", body: "" },
  onSubmit,
  className,
}) => {
  const [contentType, setContentType] = useState<ContentType>(
    initialData.contentType || "application/json",
  );
  const [body, setBody] = useState(initialData.body || "");
  const [copied, setCopied] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { resolvedTheme } = useTheme();
  const { tabs, activeTabId } = useRequestPlaygroundStore();
  const { mutateAsync, isPending } = useGenerateJsonBody();

  const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "vs-light";

  // Autosave, debounced so typing doesn't write on every key.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSubmitRef.current({ contentType, body });
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [body, contentType]);

  const handleCopy = async () => {
    if (!body) return;
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  const handleFormat = () => {
    if (contentType !== "application/json" || !body) return;
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      toast.error("This isn't valid JSON, so it can't be formatted.");
    }
  };

  const onGenerateBody = async (promptText: string) => {
    try {
      const active = tabs.find((t) => t.id === activeTabId);
      const result = await mutateAsync({
        prompt: promptText,
        method: active?.method || "POST",
        endpoint: active?.url || "/",
        context: `Generate a JSON body with the following requirements: ${promptText}`,
      });
      if (result?.jsonBody) {
        setBody(JSON.stringify(result.jsonBody, null, 2));
      }
      setShowGenerateDialog(false);
      setPrompt("");
    } catch (error) {
      toast.error(describeAiError(error, "Generating the body"));
      console.error("Failed to generate JSON body:", error);
    }
  };

  const lineCount = body ? body.split("\n").length : 0;

  return (
    <div className={cn("flex h-full min-h-72 flex-col", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <Select
          value={contentType}
          onValueChange={(value) => setContentType(value as ContentType)}
        >
          <SelectTrigger
            size="sm"
            aria-label="Body content type"
            className="h-7 w-36 bg-surface-raised text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-0.5">
          {contentType === "application/json" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowGenerateDialog(true)}
              disabled={isPending}
              className="h-7 text-[13px]"
            >
              {isPending ? <Spinner /> : <Sparkles />}
              {isPending ? "Generating" : "Generate"}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={contentType !== "application/json" || !body}
            className="h-7 text-[13px]"
          >
            <AlignLeft />
            Format
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!body}
            className="h-7 text-[13px]"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setBody("")}
            disabled={!body}
            className="h-7 text-[13px]"
          >
            <Eraser />
            Clear
          </Button>
        </div>
      </div>

      <div className="min-h-56 flex-1 overflow-hidden rounded-md border border-border">
        <MonacoEditor
          height="100%"
          value={body}
          language={contentType === "application/json" ? "json" : "plaintext"}
          theme={editorTheme}
          onChange={(value) => setBody(value ?? "")}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
            lineNumbers: "on",
            roundedSelection: false,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "line",
            tabSize: 2,
            scrollbar: { vertical: "auto", horizontal: "auto", useShadows: false },
          }}
        />
      </div>

      <p className="pt-2 font-mono text-[11px] text-muted-foreground">
        {lineCount} {lineCount === 1 ? "line" : "lines"} · {body.length}{" "}
        {body.length === 1 ? "character" : "characters"}
      </p>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-base">Generate a JSON body</DialogTitle>
            <DialogDescription>
              Describe the payload. The result replaces the current body.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 px-5 py-5">
            <Label htmlFor="prompt" className="text-sm font-medium">
              What should the body contain?
            </Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a user registration with email and password"
              onKeyDown={(e) => {
                if (e.key === "Enter" && prompt.trim() && !isPending) {
                  e.preventDefault();
                  onGenerateBody(prompt);
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="border-t border-border bg-surface px-5 py-3">
            <Button variant="ghost" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => onGenerateBody(prompt)}
              disabled={!prompt.trim() || isPending}
            >
              {isPending ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BodyEditor;
