"use client";

import React, { useMemo, useState } from "react";
import { FolderPlus, Search } from "lucide-react";
import { useGetCollections } from "../hooks/collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCollection from "./create-collection";
import CollectionFolder from "./collection-folder";
import { Hint } from "@/components/shared/hint";
import { EmptyState, ErrorState, LoadingRows } from "@/components/shared/states";

interface Props {
  currentWorkspace: {
    id: string;
    name: string;
  };
}

/*
  Collections sidebar. One job: find a request fast. Filter is first because
  it is the most-used control once a workspace has more than a few collections.
*/
const CollectionsSidebar = ({ currentWorkspace }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const {
    data: collections,
    isPending,
    isError,
    refetch,
  } = useGetCollections(currentWorkspace?.id);

  const visibleCollections = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return collections ?? [];
    return (collections ?? []).filter((c) =>
      c.name.toLowerCase().includes(term),
    );
  }, [collections, filter]);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-surface">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Collections
          </p>
        </div>
        <Hint label="New collection">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New collection"
            onClick={() => setIsModalOpen(true)}
          >
            <FolderPlus />
          </Button>
        </Hint>
      </div>

      {collections && collections.length > 0 && (
        <div className="shrink-0 border-b border-border p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter collections"
              aria-label="Filter collections"
              className="h-7 border-transparent bg-background pl-8 text-[13px]"
            />
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {isPending ? (
          <LoadingRows rows={5} />
        ) : isError ? (
          <ErrorState
            title="Couldn't load collections"
            description="Check your connection, then try again."
            onRetry={() => refetch()}
          />
        ) : !collections || collections.length === 0 ? (
          <EmptyState
            title="No collections yet"
            description="Collections group related requests, such as one per service or feature."
            action={{
              label: "New collection",
              icon: FolderPlus,
              onClick: () => setIsModalOpen(true),
            }}
          />
        ) : visibleCollections.length === 0 ? (
          <p className="px-3 py-6 text-sm text-muted-foreground">
            No collection matches “{filter}”.
          </p>
        ) : (
          visibleCollections.map((collection) => (
            <CollectionFolder key={collection.id} collection={collection} />
          ))
        )}
      </div>

      <CreateCollection
        workspaceId={currentWorkspace?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default CollectionsSidebar;
