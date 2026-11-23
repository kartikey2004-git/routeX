/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  FilePlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import EditCollectionModal from "./edit-collection-modal";
import DeleteCollectionModal from "./delete-collection-modal";
import SaveRequestToCollectionModal from "./add-request-modal";
import { useGetAllRequestFromCollection } from "@/modules/request/hooks/request";
import EditRequestModal from "@/modules/request/components/edit-request-modal";
import DeleteRequestModal from "@/modules/request/components/delete-request-modal";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";
import { Button } from "@/components/ui/button";
import { getMethodColor } from "@/lib/status-colors";
import { ErrorState, LoadingRows } from "@/components/shared/states";
import { cn } from "@/lib/utils";

interface Props {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    workspaceId: string;
  };
}

/*
  One collection in the tree. Actions are available three ways: the hover
  buttons, the "more" menu, and right-click. The open request is marked in the
  list, so the tree always answers "which request am I looking at?".
*/
const CollectionFolder = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isEditReqOpen, setIsEditReqOpen] = useState(false);
  const [isDelReqOpen, setIsDelReqOpen] = useState(false);

  const {
    data: requestData,
    isPending,
    isError,
    refetch,
  } = useGetAllRequestFromCollection(collection.id);

  const { openRequestTab, tabs, activeTabId } = useRequestPlaygroundStore();
  const activeRequestId = tabs.find((t) => t.id === activeTabId)?.requestId;

  const requests: any[] = requestData ?? [];

  const openRenameRequest = (request: any) => {
    setSelectedRequest(request);
    setIsEditReqOpen(true);
  };

  const openDeleteRequest = (request: any) => {
    setSelectedRequest(request);
    setIsDelReqOpen(true);
  };

  return (
    <section className="group/collection px-1.5 py-0.5">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex items-center rounded-sm hover:bg-muted focus-within:bg-muted">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-sm px-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                  isOpen && "rotate-90",
                )}
              />
              <span className="truncate text-[13px] font-medium text-foreground">
                {collection.name}
              </span>
              {requestData && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-4 rounded-sm px-1 font-mono text-[10px] font-normal"
                >
                  {requestData.length}
                </Badge>
              )}
            </button>

            <div className="flex shrink-0 items-center pr-0.5 md:opacity-0 md:transition-opacity md:group-hover/collection:opacity-100 md:focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-6"
                aria-label={`Add request to ${collection.name}`}
                onClick={() => setIsAddRequestOpen(true)}
              >
                <FilePlus />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-6"
                    aria-label={`More actions for ${collection.name}`}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuItem onClick={() => setIsAddRequestOpen(true)}>
                    <FilePlus />
                    Add request
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Pencil />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 />
                    Delete collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem onClick={() => setIsAddRequestOpen(true)}>
            <FilePlus />
            Add request
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil />
            Rename
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 />
            Delete collection
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isOpen && (
        <div className="mt-0.5 ml-[11px] border-l border-border pl-2">
          {isPending ? (
            <LoadingRows rows={2} />
          ) : isError ? (
            <ErrorState
              title="Couldn't load requests"
              description="This collection's requests didn't load."
              onRetry={() => refetch()}
            />
          ) : requests.length === 0 ? (
            <p className="py-1.5 pl-1.5 text-[13px] text-muted-foreground">
              No requests yet.{" "}
              <button
                type="button"
                onClick={() => setIsAddRequestOpen(true)}
                className="text-accent-text underline-offset-4 hover:underline"
              >
                Add one
              </button>
            </p>
          ) : (
            <ul className="space-y-px py-0.5">
              {requests.map((request: any) => {
                const isActive = activeRequestId === request.id;
                const label = request.name || request.url;
                return (
                  <li key={request.id} className="group/request relative">
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => openRequestTab(request)}
                            title={request.url}
                            aria-current={isActive ? "true" : undefined}
                            className={cn(
                              "flex h-7 w-full min-w-0 items-center gap-2 rounded-sm pr-7 pl-2 text-left text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {isActive && (
                              <span
                                aria-hidden="true"
                                className="absolute top-1 bottom-1 left-0 w-0.5 bg-primary"
                              />
                            )}
                            <span
                              className={cn(
                                "w-11 shrink-0 font-mono text-[11px] font-semibold",
                                getMethodColor(request.method),
                              )}
                            >
                              {request.method}
                            </span>
                            <span className="truncate">{label}</span>
                          </button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="absolute top-0.5 right-0.5 size-6 md:opacity-0 md:group-hover/request:opacity-100 md:focus-visible:opacity-100 data-[state=open]:opacity-100"
                                aria-label={`More actions for ${label}`}
                              >
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                              <DropdownMenuItem onClick={() => openRenameRequest(request)}>
                                <Pencil />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => openDeleteRequest(request)}
                              >
                                <Trash2 />
                                Delete request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-40">
                        <ContextMenuItem onClick={() => openRequestTab(request)}>
                          Open
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => openRenameRequest(request)}>
                          <Pencil />
                          Rename
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          variant="destructive"
                          onClick={() => openDeleteRequest(request)}
                        >
                          <Trash2 />
                          Delete request
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {selectedRequest && (
        <>
          <EditRequestModal
            isModalOpen={isEditReqOpen}
            setIsModalOpen={(open) => {
              setIsEditReqOpen(open);
              if (!open) setSelectedRequest(null);
            }}
            collectionId={collection.id}
            collectionName={collection.name}
            initialMethod={selectedRequest?.method || ""}
            initialName={selectedRequest?.name || ""}
            initialUrl={selectedRequest?.url || ""}
            requestId={selectedRequest?.id || ""}
          />
          <DeleteRequestModal
            isModalOpen={isDelReqOpen}
            setIsModalOpen={(open) => {
              setIsDelReqOpen(open);
              if (!open) setSelectedRequest(null);
            }}
            collectionId={collection.id}
            collectionName={collection.name}
            requestId={selectedRequest?.id || ""}
          />
        </>
      )}

      <EditCollectionModal
        isModalOpen={isEditOpen}
        setIsModalOpen={setIsEditOpen}
        collectionId={collection.id}
        initialName={collection.name}
      />

      <DeleteCollectionModal
        isModalOpen={isDeleteOpen}
        setIsModalOpen={setIsDeleteOpen}
        collectionId={collection.id}
      />

      <SaveRequestToCollectionModal
        isModalOpen={isAddRequestOpen}
        setIsModalOpen={setIsAddRequestOpen}
        collectionId={collection.id}
      />
    </section>
  );
};

export default CollectionFolder;
