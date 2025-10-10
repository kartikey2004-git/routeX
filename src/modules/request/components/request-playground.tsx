"use client";
import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useSaveRequest } from "../hooks/request";
import { Zap } from "lucide-react";
import TabBar from "./tab-bar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./request-editor";

const RequestPlayground = () => {

  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const { mutateAsync, isPending } = useSaveRequest(activeTab?.requestId ?? "");

  // jab bhi hum kisi tab pe do baar click krenge toh ek modal open hojaye wo humein rename krne ka option dega

  const [showSaveModal, setShowSaveModal] = useState(false);

  useHotkeys(
    "ctrl+g , meta+g",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addTab(); // add new request tab
      toast.success("New Request created");
    },
    { preventDefault: true, enableOnFormTags: true },
    []
  );

  if (!activeTab) {
    // return a welcome page

    return (
      <div className="flex space-y-4 flex-col h-full items-center justify-center">
        <div className="flex flex-col justify-center items-center h-40 w-40 border rounded-full bg-zinc-900">
          <Zap size={80} className="text-indigo-400 font-extralight" />
        </div>

        {/*key-combination shortcut display*/}

        <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center gap-8">
            <kbd className="px-2 py-1 bg-zinc-800 text-indigo-300 text-sm rounded border">
              Ctrl+G
              {/* on pressing ctrl+g : it adds new request tab to tabs array , and use active tab bana dega */}
            </kbd>
            <span className="text-zinc-400 font-semibold">New Request</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <kbd className="px-2 py-1 bg-zinc-800 text-indigo-300 text-sm rounded border">
              Ctrl+S
            </kbd>
            <span className="text-zinc-400 font-semibold">Save Request</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TabBar />
      <div className="flex-1 overflow-auto">
       <RequestEditor />
      </div>
    </div>
  );
};

export default RequestPlayground;

// In browser , by default bahut saare key combinations already acquired hote hai toh hum unhe directly use nhi kr skte


// after functionality : renaming on doubleClick humara tab ka kaam khatam hojayega , then we move to saving a request



