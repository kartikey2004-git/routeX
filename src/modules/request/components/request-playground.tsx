"use client";
import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useSaveRequest } from "../hooks/request";
import { FilePlus, FolderOpen } from "lucide-react";
import TabBar from "./tab-bar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./request-editor";
import { REST_METHOD } from "@prisma/client";
import SaveRequestToCollectionModal from "@/modules/collection/components/add-request-modal";
import { Button } from "@/components/ui/button";

const SHORTCUTS = [
  { keys: ["⌘", "G"], label: "New request" },
  { keys: ["⌘", "S"], label: "Save to collection" },
  { keys: ["⌘", "↵"], label: "Send request" },
  { keys: ["⌘", "K"], label: "Search and commands" },
];

const RequestPlayground = () => {
  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const { mutateAsync } = useSaveRequest(activeTab?.requestId ?? "");

  const [showSaveModal, setShowSaveModal] = useState(false);

  const getCurrentRequestData = () => {
    if (!activeTab) {
      return {
        name: "Untitled request",
        method: REST_METHOD.GET as REST_METHOD,
        url: "https://echo.hoppscotch.io",
      };
    }

    return {
      name: activeTab.title,
      method: activeTab.method as REST_METHOD,
      url: activeTab.url,
    };
  };

  // ⌘/Ctrl+S: update a saved request in place; unsaved ones go to the save dialog.
  useHotkeys(
    "ctrl+s , meta+s",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!activeTab) {
        toast.error("Open a request first");
        return;
      }

      if (activeTab.collectionId) {
        try {
          await mutateAsync({
            url: activeTab.url || "https://echo.hoppscotch.io",
            method: activeTab.method as REST_METHOD,
            name: activeTab.title || "Untitled request",
            body: activeTab.body,
            headers: activeTab.headers,
            parameters: activeTab.parameters,
          });
          toast.success("Saved");
        } catch (error) {
          console.error("Failed to update request:", error);
          toast.error("Couldn't save. Try again.");
        }
      } else {
        setShowSaveModal(true);
      }
    },
    { preventDefault: true, enableOnFormTags: true },
    [activeTab],
  );

  // ⌘/Ctrl+G: new request tab.
  useHotkeys(
    "ctrl+g , meta+g",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addTab();
    },
    { preventDefault: true, enableOnFormTags: true },
    [],
  );

  if (!activeTab) {
    return (
      <div className="flex h-full items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-foreground">
              No request open
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Open a saved request from a collection, or start a new one. Your
              open tabs are kept while you work.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => addTab()}>
              <FilePlus />
              New request
            </Button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FolderOpen className="size-3.5" />
              or pick one from the sidebar
            </span>
          </div>

          <dl className="divide-y divide-border border-y border-border text-sm">
            {SHORTCUTS.map((shortcut) => (
              <div
                key={shortcut.label}
                className="flex items-center justify-between py-2"
              >
                <dt className="text-muted-foreground">{shortcut.label}</dt>
                <dd className="flex gap-1">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="min-w-5 rounded-sm border border-border px-1 text-center font-mono text-[11px] text-foreground"
                    >
                      {key}
                    </kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <TabBar />
      <div className="flex min-h-0 flex-1 flex-col">
        <RequestEditor />
      </div>
      <SaveRequestToCollectionModal
        isModalOpen={showSaveModal}
        setIsModalOpen={setShowSaveModal}
        requestData={getCurrentRequestData()}
        initialName={getCurrentRequestData().name}
      />
    </div>
  );
};

export default RequestPlayground;
