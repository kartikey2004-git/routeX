"use client"; // client component

import React, { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { useWorkspaceStore } from "@/modules/layout/store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/states";
import { WorkbenchSkeleton } from "@/components/shared/workbench-skeleton";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import CollectionsSidebar from "@/modules/collection/components/sidebar";
import RequestPlayground from "@/modules/request/components/request-playground";

// Splits the screen on desktop; on phones the collections move into a sheet.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

const Page = () => {
  const { selectedWorkspace } = useWorkspaceStore();
  const isDesktop = useIsDesktop();
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const {
    data: currentWorkspace,
    isPending,
    isError,
    refetch,
  } = useGetWorkspace(selectedWorkspace?.id ?? "");

  if (isPending) {
    return <WorkbenchSkeleton label="Loading workspace" />;
  }

  if (isError || !currentWorkspace) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center p-6">
        <ErrorState
          className="max-w-md"
          title="Couldn't load this workspace"
          description="The workspace didn't load. Check your connection, then try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
          <Sheet open={collectionsOpen} onOpenChange={setCollectionsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                <FolderOpen />
                Collections
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Collections</SheetTitle>
                <SheetDescription>Pick a saved request to open it.</SheetDescription>
              </SheetHeader>
              <CollectionsSidebar currentWorkspace={currentWorkspace!} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="min-h-0 flex-1">
          <RequestPlayground />
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-0 w-full"
    >
      <ResizablePanel
        defaultSize={22}
        minSize={16}
        maxSize={36}
        className="flex min-h-0"
      >
        <CollectionsSidebar currentWorkspace={currentWorkspace!} />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={78} minSize={50} className="min-h-0">
        <RequestPlayground />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
