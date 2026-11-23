/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { Check, FolderOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { useAddRequestToCollection } from "@/modules/request/hooks/request";
import { REST_METHOD } from "@prisma/client";
import { useWorkspaceStore } from "@/modules/layout/store";
import { useGetCollections } from "../hooks/collection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMethodColor } from "@/lib/status-colors";
import { ErrorState, LoadingRows } from "@/components/shared/states";
import { cn } from "@/lib/utils";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestData?: {
    name: string;
    method: REST_METHOD;
    url: string;
  };
  initialName?: string;
  collectionId?: string;
}

/*
  "Save as": name the request, pick where it goes, confirm. The method and URL
  are shown read-only so people can see exactly what will be saved.
*/
const SaveRequestToCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  requestData = {
    name: "Untitled",
    url: "https://echo.hoppscotch.io",
    method: REST_METHOD.GET,
  },
  initialName = "Untitled",
  collectionId,
}: Props) => {
  const [requestName, setRequestName] = useState(initialName);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collectionId || "",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { selectedWorkspace } = useWorkspaceStore();

  const {
    data: collections,
    isLoading,
    isError,
  } = useGetCollections(selectedWorkspace?.id ?? "");

  const { mutateAsync, isPending } =
    useAddRequestToCollection(selectedCollectionId);

  useEffect(() => {
    if (isModalOpen) {
      setRequestName(requestData.name || initialName);
      setSelectedCollectionId(collectionId || "");
      setSearchTerm("");
    }
  }, [isModalOpen, requestData.name, initialName]);

  // Preselect the first collection when the dialog isn't scoped to one.
  useEffect(() => {
    if (!isModalOpen) return;
    if (collectionId) return;
    if (!selectedCollectionId && collections && collections.length > 0) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [isModalOpen, collections, collectionId, selectedCollectionId]);

  const filteredCollections =
    collections?.filter((collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const selectedCollection = collections?.find(
    (c) => c.id === selectedCollectionId,
  );

  const handleSubmit = async () => {
    if (!requestName.trim()) {
      toast.error("Give the request a name");
      return;
    }
    if (!selectedCollectionId) {
      toast.error("Choose a collection to save into");
      return;
    }
    try {
      await mutateAsync({
        url: requestData.url.trim(),
        method: requestData.method,
        name: requestName.trim(),
      });
      toast.success(`Saved to ${selectedCollection?.name}`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Couldn't save the request. Try again.");
      console.error("Failed to save request to collection:", error);
    }
  };

  return (
    <Modal
      title="Save request"
      description="Name it and choose the collection it belongs to."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving…" : "Save request"}
      size="sm:max-w-lg"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="save-request-name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="save-request-name"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            autoFocus
            placeholder="e.g. Create order"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Collection</Label>
            <span className="text-xs text-muted-foreground">
              {selectedWorkspace?.name ?? "Workspace"}
            </span>
          </div>

          {collections && collections.length > 4 && (
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter collections"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Filter collections"
              />
            </div>
          )}

          <div
            role="radiogroup"
            aria-label="Collection"
            className="max-h-48 overflow-y-auto rounded-md border border-border"
          >
            {isLoading ? (
              <LoadingRows rows={3} />
            ) : isError ? (
              <ErrorState
                title="Couldn't load collections"
                description="Close this and try again in a moment."
              />
            ) : filteredCollections.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                {searchTerm
                  ? `No collection matches “${searchTerm}”.`
                  : "No collections yet. Create one from the sidebar first."}
              </p>
            ) : (
              filteredCollections.map((collection) => {
                const checked = selectedCollectionId === collection.id;
                return (
                  <button
                    key={collection.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => setSelectedCollectionId(collection.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 border-b border-border px-3 py-2 text-left text-sm transition-colors last:border-b-0",
                      checked
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <FolderOpen className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{collection.name}</span>
                    {checked && <Check className="size-4 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">
          <span
            className={cn(
              "shrink-0 font-semibold",
              getMethodColor(requestData.method),
            )}
          >
            {requestData.method}
          </span>
          <span className="truncate text-foreground">{requestData.url}</span>
        </div>
      </div>
    </Modal>
  );
};

export default SaveRequestToCollectionModal;
