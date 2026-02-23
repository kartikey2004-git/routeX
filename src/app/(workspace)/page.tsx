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
      <div className="flex h-full min-h-0 items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // console.log(currentWorkspace);

  // means it provides a section where we can resize our panel easily

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
      {/* Collection Folder / Sidebar */}
      <ResizablePanel
        defaultSize={25}
        minSize={20}
        maxSize={35}
        className="flex min-h-0"
      >
        <div className="min-h-0 flex-1">
          <TabbedSidebar currentWorkspace={currentWorkspace!} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Request Playground */}
      <ResizablePanel defaultSize={75} minSize={50} className="min-h-0">
        <RequestPlayground />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
