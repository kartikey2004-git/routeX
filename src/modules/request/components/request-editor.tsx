"use client";
import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import RequestBar from "./request-bar";
import RequestEditorArea from "./request-editor-area";
import ResponseViewer from "./response-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Columns2, Rows2, Send } from "lucide-react";
import { EmptyState } from "@/components/shared/states";

type SplitDirection = "horizontal" | "vertical";

/*
  Request on one side, response on the other. Side by side by default so the
  status and body sit next to the request; the split can be flipped to stacked
  for narrow screens or long URLs and headers.

  The tree is the same before and after the first response, so the request
  side never remounts (and never drops an in-flight autosave).
*/
const RequestEditor = () => {
  const { tabs, activeTabId, updateTab, responseViewerData } =
    useRequestPlaygroundStore();
  const [split, setSplit] = useState<SplitDirection>("horizontal");

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  if (!activeTabId) return null;

  const isHorizontal = split === "horizontal";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-8 shrink-0 items-center justify-end gap-1 border-b border-border px-2">
        <span className="mr-auto pl-2 text-xs text-muted-foreground">
          Layout
        </span>
        <Button
          variant={isHorizontal ? "ghost" : "secondary"}
          size="icon-sm"
          aria-label="Stack response below request"
          aria-pressed={!isHorizontal}
          onClick={() => setSplit("vertical")}
        >
          <Rows2 />
        </Button>
        <Button
          variant={isHorizontal ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label="Place response beside request"
          aria-pressed={isHorizontal}
          onClick={() => setSplit("horizontal")}
        >
          <Columns2 />
        </Button>
      </div>

      <ResizablePanelGroup
        key={split}
        direction={split}
        className="min-h-0 flex-1"
      >
        <ResizablePanel
          defaultSize={50}
          minSize={24}
          className="min-h-0 min-w-0"
        >
          <div className="flex h-full min-h-0 flex-col">
            <RequestBar key={activeTab.id} tab={activeTab} updateTab={updateTab} />
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-6">
              <RequestEditorArea key={activeTab.id} tab={activeTab} updateTab={updateTab} />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          defaultSize={50}
          minSize={20}
          className="min-h-0 min-w-0 bg-surface/40"
        >
          {responseViewerData ? (
            <ResponseViewer responseData={responseViewerData} />
          ) : (
            <EmptyState
              icon={Send}
              title="No response yet"
              description="Send the request to see its status, timing and body here. ⌘↵ sends from the URL bar."
              className="px-5 py-6"
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RequestEditor;
