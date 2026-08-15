"use client";

import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddNameModal from "./add-name-modal";
import { Button } from "@/components/ui/button";
import { getMethodColor } from "@/lib/status-colors";

const TabBar = () => {
  const { tabs, activeTabId, addTab, setActiveTab, closeTab } =
    useRequestPlaygroundStore();

  // state for opening rename modal when user click two times on a tab

  const [renameModalOpen, setrenameModalOpen] = useState(false);

  // state for handling tabId which is selected

  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const onDoubleClick = (tabId: string) => {
    setSelectedTabId(tabId);
    setrenameModalOpen(true);
  };

  // now we have to create modal for renaming the request of particular current active req tab

  return (
    <>
      <div className="flex items-center border-b bg-card overflow-x-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {tabs.map((tab) => {
            return (
              <motion.div
                key={tab.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onDoubleClick={() => onDoubleClick(tab.id)}
                // onclick pe particular request tab ko active kr denge

                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-200 ease-out ${
                  activeTabId === tab.id
                    ? "bg-muted text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span
                  className={`font-semibold transition-colors duration-200 ${getMethodColor(
                    tab.method,
                  )}`}
                >
                  {tab.method}
                </span>

                <p className="max-w-xs truncate font-semibold flex items-center gap-1">
                  {tab.title}
                  {tab.unsavedChanges && (
                    <span className="text-destructive transition-opacity duration-200 group-hover:opacity-0">
                      •
                    </span>
                  )}
                </p>

                {/* icon for calling closeTab for closing particular request tab */}

                <X
                  className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* button to add a request tab*/}
        <Button
          variant="ghost"
          size="icon"
          onClick={addTab}
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="New request tab"
        >
          <Plus className="w-4 h-4" />
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
