import React from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import RequestBar from "./request-bar";
import RequestEditorArea from "./request-editor-area";
import ResponseViewer from "./response-viewer";

const RequestEditor = () => {
  const { tabs, activeTabId, updateTab, responseViewerData } =
    useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  if (!activeTabId) return null;

  // we'll get active tab with the help of active tab id

  return (
    <div className="flex flex-col h-full bg-background">
      <RequestBar tab={activeTab} updateTab={updateTab} />

      <div className="flex-1 flex-col w-full px-4 py-6">
        {/* we have to pass updateTab to track saved and unsaved tab */}
        <RequestEditorArea tab={activeTab} updateTab={updateTab} />
      </div>

      {responseViewerData && (
        <ResponseViewer responseData={responseViewerData} />
      )}
    </div>
  );
};

export default RequestEditor;
