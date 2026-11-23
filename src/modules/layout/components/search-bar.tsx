"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { FilePlus, Globe, Search, Blocks, FolderOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { useGetCollections } from "@/modules/collection/hooks/collection";
import { getAllRequestFromCollection } from "@/modules/request/actions";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";
import { useWorkspaceStore } from "../store";
import { getMethodColor } from "@/lib/status-colors";
import { Skeleton } from "@/components/ui/skeleton";

/*
  Command palette (Ctrl/⌘K). One place to reach anything: actions, requests in
  the current workspace, and workspaces. Shortcut hints are shown next to the
  commands that have one, so the palette doubles as a cheat sheet.
*/
const CommandPalette = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: workspaces = [], isError } = useWorkspaces();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();
  const { data: collections = [] } = useGetCollections(
    selectedWorkspace?.id ?? "",
  );
  const requestQueries = useQueries({
    queries: collections.map((collection) => ({
      queryKey: ["requests", collection.id],
      queryFn: () => getAllRequestFromCollection(collection.id),
    })),
  });
  const { addTab, openRequestTab } = useRequestPlaygroundStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const run = (action: () => void) => {
    action();
    close();
  };

  const requests = requestQueries.flatMap((result, index) =>
    (result.data ?? []).map((request) => ({
      ...request,
      collectionName: collections[index]?.name ?? "",
    })),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search requests, commands and workspaces"
        className="flex h-7 w-8 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background text-left text-sm text-muted-foreground transition-colors hover:border-input hover:text-foreground sm:w-full sm:max-w-md sm:justify-start sm:px-2.5"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="hidden min-w-0 flex-1 truncate sm:block">
          Search requests, commands and workspaces
        </span>
        <kbd className="hidden shrink-0 rounded-sm border border-border px-1 font-mono text-[11px] sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        title="Command palette"
        description="Search requests, run a command or switch workspace"
        className="sm:max-w-lg"
      >
        <CommandInput
          placeholder="Type a command or search…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[360px]">
          <CommandEmpty>
            {isError
              ? "Couldn't load workspaces. Refresh and try again."
              : "Nothing matches. Try a request name or a URL."}
          </CommandEmpty>

          <CommandGroup heading="Commands">
            <CommandItem onSelect={() => run(() => addTab())}>
              <FilePlus />
              New request
              <kbd className="ml-auto font-mono text-[11px] text-muted-foreground">
                ⌘G
              </kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/app"))}>
              <Blocks />
              Go to REST
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/realtime"))}>
              <Globe />
              Go to WebSocket
            </CommandItem>
          </CommandGroup>

          {requestQueries.some((q) => q.isPending) && requests.length === 0 && (
            <div className="space-y-2 p-2" role="status" aria-label="Loading requests">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-5/6" />
              <Skeleton className="h-7 w-4/6" />
            </div>
          )}

          {requests.length > 0 && (
            <CommandGroup heading="Requests">
              {requests.map((request) => (
                <CommandItem
                  key={request.id}
                  value={`${request.name} ${request.url} ${request.collectionName}`}
                  onSelect={() =>
                    run(() => {
                      openRequestTab(request);
                      router.push("/app");
                    })
                  }
                >
                  <span
                    className={`w-12 shrink-0 font-mono text-xs font-semibold ${getMethodColor(
                      request.method,
                    )}`}
                  >
                    {request.method}
                  </span>
                  <span className="truncate">{request.name || request.url}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <FolderOpen className="size-3" />
                    {request.collectionName}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {workspaces.length > 0 && (
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={`workspace ${workspace.name}`}
                  onSelect={() =>
                    run(() => setSelectedWorkspace(workspace))
                  }
                >
                  <span className="truncate">{workspace.name}</span>
                  {selectedWorkspace?.id === workspace.id && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        <div className="flex items-center gap-4 border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span>
            <kbd className="font-mono">↑↓</kbd> move
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> select
          </span>
          <span>
            <kbd className="font-mono">esc</kbd> close
          </span>
        </div>
      </CommandDialog>
    </>
  );
};

export default CommandPalette;
