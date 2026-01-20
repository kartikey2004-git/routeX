"use client"; // client component

import React from "react";
import { useWorkspaceStore } from "@/modules/layout/store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import TabbedSidebar from "@/modules/collection/components/sidebar";
import { Loader2 } from "lucide-react";
import RequestPlayground from "@/modules/request/components/request-playground";

const Page = () => {
  // abstract global state for selected workspace
  const { selectedWorkspace } = useWorkspaceStore();

  // now we have to fetch data of the currently selected workspace , so we have to pass its workspaceId to the useGetWorkspace as a prop.

  const { data: currentWorkspace, isPending } = useGetWorkspace(
    selectedWorkspace?.id ?? "",
  );

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50/80 backdrop-blur-sm">
        <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
      </div>
    );
  }

  // console.log(currentWorkspace);

  // means it provides a section where we can resize our panel easily

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Collection Folder / Sidebar */}
      <ResizablePanel
        defaultSize={25}
        minSize={20}
        maxSize={35}
        className="flex"
      >
        <div className="flex-1">
          <TabbedSidebar currentWorkspace={currentWorkspace!} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Request Playground */}
      <ResizablePanel defaultSize={75} minSize={50}>
        <RequestPlayground />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
