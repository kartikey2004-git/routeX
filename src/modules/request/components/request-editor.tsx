import React from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import RequestBar from "./request-bar";
import RequestEditorArea from "./request-editor-area";

const RequestEditor = () => {
  const { tabs, activeTabId, updateTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  if (!activeTabId) return null;

  // we'll get active tab with the help of active tab id

  return (
    <div className="flex flex-col items-center justify-start py-4 px-2">
      <RequestBar tab={activeTab} updateTab={updateTab} />

      <div className="flex flex-1 flex-col w-full justify-start mt-4 items-center">
        {/* we have to pass updateTab to track saved and unsaved tab */}
        <RequestEditorArea tab={activeTab} updateTab={updateTab} />
      </div>
    </div>
  );
};

export default RequestEditor;
