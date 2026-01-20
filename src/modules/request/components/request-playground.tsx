"use client";
import React, { useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useSaveRequest } from "../hooks/request";
import { Zap } from "lucide-react";
import TabBar from "./tab-bar";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import RequestEditor from "./request-editor";
import { REST_METHOD } from "@prisma/client";
import SaveRequestToCollectionModal from "@/modules/collection/components/add-request-modal";

const RequestPlayground = () => {
  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const { mutateAsync } = useSaveRequest(activeTab?.requestId ?? "");

  // jab bhi hum kisi tab pe do baar click krenge toh ek modal open hojaye wo humein rename krne ka option dega

  const [showSaveModal, setShowSaveModal] = useState(false);

  // it grabs the current request tab data from active tab

  const getCurrentRequestData = () => {
    // if there is no active tab currrently in request playground area

    if (!activeTab) {
      return {
        name: "Untitled Request",
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

  useHotkeys(
    "ctrl+s , meta+s",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!activeTab) {
        toast.error("No active request to save");
        return;
      }

      // means if collectionId is present in any particular active request tab , then it means woh request kisi collection mein save hai

      if (activeTab.collectionId) {
        try {
          await mutateAsync({
            url: activeTab.url || "https://echo.hoppscotch.io",
            method: activeTab.method as REST_METHOD,
            name: activeTab.title || "Untitled Request",
            body: activeTab.body,
            headers: activeTab.headers,
            parameters: activeTab.parameters,
          });

          toast.success("Request updated");
        } catch (error) {
          console.error("Failed to update request:", error);
          toast.error("Failed to update request");
        }
      } else {
        // means if collectionId is not present in any particular active request tab , then it means woh request kisi collection mein save nahi hai

        // means koi aisa request jisse hum naya add kr rhe hai kisi collection mein , toh modal popup ho ki kis collection mein add krna hai us request ko

        // but now jab humne kisi request ko kisi particular collection mein add kra toh current active tab update nhi hua us request ka

        setShowSaveModal(true);
      }
    },
    { preventDefault: true, enableOnFormTags: true },
    [activeTab],
  );

  useHotkeys(
    "ctrl+g , meta+g",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addTab(); // add new request tab
      toast.success("New Request created");
    },
    { preventDefault: true, enableOnFormTags: true },
    [],
  );

  if (!activeTab) {
    // return a welcome page

    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center text-center max-w-sm">
          {/* Icon Circle */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 ring-1 ring-slate-200">
            <Zap size={36} className="text-slate-700" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="mt-6 text-lg font-semibold text-slate-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Use keyboard shortcuts to work faster
          </p>

          {/* Shortcuts */}
          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-2.5">
              <span className="text-sm text-slate-700">New Request</span>

              <kbd className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                Ctrl + G
              </kbd>
            </div>

            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-2.5">
              <span className="text-sm text-slate-700">Save Request</span>

              <kbd className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                Ctrl + S
              </kbd>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <TabBar />
      <div className="flex-1 overflow-auto scrollbar-light">
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

// In browser , by default bahut saare key combinations already acquired hote hai toh hum unhe directly use nhi kr skte

// after functionality : renaming on doubleClick humara tab ka kaam khatam hojayega , then we move to saving a request
