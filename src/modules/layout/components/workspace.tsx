"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { useWorkspaceStore } from "../store";
import CreateWorkspace from "./create-workspace";

/*
  Workspace switcher. Auto-selects the first workspace on load so the app is
  never in a "pick something first" state; creating one is one click away.
*/
const Workspace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoading) {
    return (
      <Skeleton className="h-7 w-36 rounded-md" aria-label="Loading workspaces" />
    );
  }

  if (isError) {
    return (
      <div className="flex h-7 items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="size-3.5 text-destructive" />
        <span>Couldn&apos;t load workspaces</span>
        <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No workspace yet</span>
    );
  }

  return (
    <>
      <Select
        value={selectedWorkspace?.id}
        onValueChange={(id) => {
          const ws = workspaces.find((w) => w.id === id);
          if (ws) setSelectedWorkspace(ws);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Switch workspace"
          className="h-7 max-w-24 border-transparent bg-transparent px-1.5 text-sm font-medium hover:bg-muted sm:max-w-44 sm:px-2"
        >
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>

        <SelectContent>
          {workspaces.map((ws) => (
            <SelectItem key={ws.id} value={ws.id}>
              {ws.name}
            </SelectItem>
          ))}

          <SelectSeparator />
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <span className="text-xs text-muted-foreground">Workspaces</span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Create workspace"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <Plus />
            </Button>
          </div>
        </SelectContent>
      </Select>

      <CreateWorkspace
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default Workspace;
