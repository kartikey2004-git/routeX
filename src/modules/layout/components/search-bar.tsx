"use client";
import { Clock, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { useWorkspaceStore } from "../store";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

const SearchBar = () => {
  // Custom hook that fetches all user workspaces
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();

  // Custom hook that fetches all user workspaces
  const { setSelectedWorkspace } = useWorkspaceStore();

  // console.log(workspaces);

  // open state variable for opening the command prompt/list

  const [open, setOpen] = useState(false);

  // Search input value
  const [search, setSearch] = useState("");

  const [recentSearches, setRecentSearches] = useState<Workspace[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Filter logic — runs whenever search input changes : Jab search input ya workspace data change ho, to list filter karo

  const filtered = workspaces.filter((w: Workspace) =>
    // lowercase me filter kar rahe hain (case-insensitive search)

    w.name.toLowerCase().includes(search.toLowerCase())
  );

  // Open workspace on click
  const handleOpenWorkspace = (workspace: Workspace) => {
    // global state me selected workspace set karo and aapka store jab update hoga, uske basis pe workspace open ho jayega
    setSelectedWorkspace(workspace);
    setOpen(false); // modal close karo
    setSearch("");

    // Save to recent searches (limit to 5, no duplicates)

    const updated = [
      workspace,
      ...recentSearches.filter((r) => r.id !== workspace.id),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // implement keyboard shortcut

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    // addEventlistener: method of the EventTarget interface sets up a function that will be called whenever the specified event is delivered to the target.

    document.addEventListener("keydown", down);

    // cleanup on unmount
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Compact search bar UI on navbar  */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex flex-1 cursor-text items-center justify-between self-stretch rounded bg-zinc-900 px-4 py-2 text-gray-500 transition hover:bg-zinc-800 hover:text-gray-200 focus-visible:bg-zinc-700 focus-visible:text-gray-200 overflow-hidden"
      >
        <span className="inline-flex flex-1 items-center">
          <Search size={16} className="mr-2" />
          <span className="text-xs text-left">Search routeX</span>
        </span>

        {/* Keyboard shortcut hint */}
        <span className="flex space-x-1">
          <kbd className="px-1 py-0.5 text-xs bg-zinc-700 rounded">Ctrl</kbd>
          <kbd className="px-1 py-0.5 text-xs bg-zinc-700 rounded">K</kbd>
        </span>
      </button>

      {/* Command Dialog (opens when Ctrl+K or clicked) */}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-zinc-900 border border-zinc-800">
          {/* Input field for searching workspaces */}
          <CommandInput
            placeholder="Search workspaces..."
            value={search}
            onValueChange={setSearch}
            className="bg-transparent border-none text-gray-300 placeholder:text-gray-500"
          />

          {/* Workspace list container */}
          <CommandList>
            {isLoading && (
              <div className="p-2 text-sm">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
            )}

            {isError && (
              <div className="p-2 text-sm text-red-500">
                Error loading workspaces
              </div>
            )}

            {recentSearches.length === 0 && search.trim() === "" && (
              <div className="text-gray-500 py-6 text-center">
                Search routeX
              </div>
            )}

            {search.trim() === "" ? (
              recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((ws) => (
                    <CommandItem
                      key={ws.id}
                      onSelect={() => handleOpenWorkspace(ws)}
                    >
                      <Clock size={14} className="mt-0.5 text-gray-500" />
                      <div className="flex flex-col">
                        <span>{ws.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {ws.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            ) : (
              <div>
                {!isLoading && search.trim() !== "" && (
                  <>
                    <CommandEmpty>No workspace found.</CommandEmpty>

                    <CommandGroup heading="Your Workspaces">
                      {filtered.map((w) => (
                        <CommandItem
                          key={w.id}
                          value={w.name}
                          onSelect={() => handleOpenWorkspace(w)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {w.name}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {w.description || "No description"}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </div>
            )}
          </CommandList>

          {/* Keyboard navigation hints at the bottom */}

          <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 text-gray-400 rounded text-xs">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 text-gray-400 rounded text-xs">
                  ↓
                </kbd>
                <span>to navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 text-gray-400 rounded text-xs">
                  ↵
                </kbd>
                <span>to select</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 text-gray-400 rounded text-xs">
                ESC
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
