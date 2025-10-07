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

const Page = () => {
  // abstract global state for selected workspace
  const { selectedWorkspace } = useWorkspaceStore();

  // now we have to fetch data of the currently selected workspace , so we have to pass its workspaceId to the useGetWorkspace as a prop.

  const { data: currentWorkspace, isPending } = useGetWorkspace(
    selectedWorkspace?.id ?? ""
  );

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  // console.log(currentWorkspace);

  // means it provides a section where we can resize our panel easily

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={65} minSize={40}>
        <h1>Request Playground</h1>
      </ResizablePanel>
      <ResizableHandle className="w-[2px] bg-zinc-800 hover:bg-indigo-500 transition-colors duration-200 ease-in-out mr-1" />
      <ResizablePanel
        defaultSize={35}
        maxSize={40}
        minSize={25}
        className="flex"
      >
        <div className="flex-1">
          {/* here is component named TabbedSidebar which accepts currentWorkSpace as a prop */}

          <TabbedSidebar currentWorkspace={currentWorkspace!} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
