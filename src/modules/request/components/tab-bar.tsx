"use client";

import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { Plus, X } from "lucide-react";
import AddNameModal from "./add-name-modal";
import { Button } from "@/components/ui/button";
import { getMethodColor } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

/*
  Request tabs. Each tab shows its method and name; an orange dot marks
  unsaved work and is never hidden, so nothing is lost by accident. Double
  click renames.
*/
const TabBar = () => {
  const { tabs, activeTabId, addTab, setActiveTab, closeTab } =
    useRequestPlaygroundStore();

  const [renameModalOpen, setrenameModalOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const onDoubleClick = (tabId: string) => {
    setSelectedTabId(tabId);
    setrenameModalOpen(true);
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Open requests"
        className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-border bg-surface"
      >
        {tabs.map((tab) => {
          const active = activeTabId === tab.id;
          return (
            <div
              key={tab.id}
              role="tab"
              tabIndex={0}
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => onDoubleClick(tab.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }
              }}
              className={cn(
                "group relative flex max-w-56 min-w-0 cursor-pointer items-center gap-2 border-r border-border pr-1.5 pl-3 text-[13px] outline-none select-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                active
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-primary"
                />
              )}

              <span
                className={cn(
                  "font-mono text-[11px] font-semibold",
                  getMethodColor(tab.method),
                )}
              >
                {tab.method}
              </span>

              <span className="truncate">{tab.title}</span>

              {tab.unsavedChanges && (
                <span
                  className="size-1.5 shrink-0 rounded-full bg-primary"
                  aria-label="Unsaved changes"
                />
              )}

              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "size-5 shrink-0 text-muted-foreground hover:text-foreground",
                  active
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                )}
                aria-label={`Close ${tab.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X />
              </Button>
            </div>
          );
        })}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={addTab}
          className="m-1 shrink-0 self-center"
          aria-label="New request tab"
          title="New request (⌘G)"
        >
          <Plus />
        </Button>
      </div>

      {selectedTabId && (
        <AddNameModal
          isModalOpen={renameModalOpen}
          setIsModalOpen={setrenameModalOpen}
          tabId={selectedTabId}
        />
      )}
    </>
  );
};

export default TabBar;
