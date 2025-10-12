"use client";

import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddNameModal from "./add-name-modal";

const TabBar = () => {
  const { tabs, activeTabId, addTab, setActiveTab, closeTab } =
    useRequestPlaygroundStore();

  // state for opening rename modal when user click two times on a tab

  const [renameModalOpen, setrenameModalOpen] = useState(false);

  // state for handling tabId which is selected

  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  // here utility/hashmap for mapping color according to different HTTP requests

  const requestColorMap: Record<string, string> = {
    GET: "text-green-500",
    POST: "text-indigo-500",
    PUT: "text-yellow-500",
    DELETE: "text-red-500",
    PATCH: "text-orange-500",
  };

  const onDoubleClick = (tabId: string) => {
    setSelectedTabId(tabId);
    setrenameModalOpen(true);
  };

  // now we have to create modal for renaming the request of particular current active req tab

  return (
    <>
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900 overflow-x-auto no-scrollbar">
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
                    ? "bg-zinc-800 text-white border-b-1 border-indigo-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <span
                  className={`font-semibold transition-colors duration-200 ${
                    requestColorMap[tab.method] || "text-gray-500"
                  }`}
                >
                  {tab.method}
                </span>

                <p className="max-w-xs truncate font-semibold flex items-center gap-1">
                  {tab.title}
                  {tab.unsavedChanges && (
                    <span className="text-red-500 transition-opacity duration-200 group-hover:opacity-0">
                      •
                    </span>
                  )}
                </p>

                {/* icon for calling closeTab for closing particular request tab */}

                <X
                  className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
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
        <button
          onClick={addTab}
          className="px-3 py-2 text-zinc-400 hover:text-white"
        >
          {" "}
          +{" "}
        </button>
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
