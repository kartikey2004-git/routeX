/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { ChevronRight, Folder, Loader2, Search } from "lucide-react";

import { toast } from "sonner";
import { useAddRequestToCollection } from "@/modules/request/hooks/request";
import { REST_METHOD } from "@prisma/client";
import { useWorkspaceStore } from "@/modules/layout/store";
import { useGetCollections } from "../hooks/collection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMethodColor } from "@/lib/status-colors";

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
  // state for handling request name

  const [requestName, setRequestName] = useState(initialName);

  // state for handling the selected collection Id by default collection Id hum props se le lenge

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collectionId || "",
  );

  // state for input search text which used for rendering filtering collections

  const [searchTerm, setSearchTerm] = useState("");

  // extract data for current selected workspace

  const { selectedWorkspace } = useWorkspaceStore();

  // get collection for particular selected workspace

  const {
    data: collections,
    isLoading,
    isError,
  } = useGetCollections(selectedWorkspace?.id ?? "");

  // hook for adding request in selected collection here

  const { mutateAsync, isPending } =
    useAddRequestToCollection(selectedCollectionId);

  // setting default data to Modal which is used for adding request

  useEffect(() => {
    if (isModalOpen) {
      setRequestName(requestData.name || initialName);
      setSelectedCollectionId(collectionId || "");
      setSearchTerm("");
    }
  }, [isModalOpen, requestData.name, initialName]);

  // by default ek collection ko selected krke modal mein dikha denge - By default selected collection

  useEffect(() => {
    if (!isModalOpen) return;
    if (collectionId) return;
    if (!selectedCollectionId && collections && collections.length > 0) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [isModalOpen, collections, collectionId, selectedCollectionId]);

  // Logic to filter collection of particular workspace on basis of search input

  const filteredCollections =
    collections?.filter((collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // check kar rahe hain agar collections me se koi collection  selectedCollectionId ke saath match karta hai, toh usko selectedCollection krdenge ( show selected collection name here )

  const selectedCollection = collections?.find(
    (c) => c.id === selectedCollectionId,
  );

  const handleSubmit = async () => {
    // validation for request name
    if (!requestName.trim()) {
      toast.error("Please enter a request name");
      return;
    }

    // validation for not selecting a collection to add a particular req

    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }

    try {
      // collection ke andar specific request ka data add krdega

      await mutateAsync({
        url: requestData.url.trim(),
        method: requestData.method,
        name: requestName.trim(),
      });

      toast.success(
        `Request saved to "${selectedCollection?.name}" collection`,
      );
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save request to collection");
      console.error("Failed to save request to collection:", error);
    }
  };

  return (
    <Modal
      title="Save as"
      description=""
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save"}
      submitVariant="default"
    >
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium mb-2 text-foreground">
            Request name
          </Label>

          {/* adding request name input */}

          <div className="relative">
            <Input
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              autoFocus
              className="pr-20"
              placeholder="Enter request name..."
            />

            {/* Yeh batata hai ki hum kaunsa HTTP request method (GET, POST, PUT, DELETE, etc.) use kar rahe hain. */}

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-sm ${getMethodColor(
                  requestData.method,
                )}`}
              >
                {requestData.method}
              </span>
            </div>
          </div>
        </div>

        {/* select collection in workspace for particular request */}
        <div>
          <Label className="block text-sm font-medium mb-2 text-foreground">
            Select collection
          </Label>

          {/* selected workspace name */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <span>{selectedWorkspace?.name || "workspace"}</span>
            <span>›</span>
            <span>Collections</span>
          </div>

          {/* input for searching particular collection in workspace to adding req */}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Jab user ko kisi collection ke andar request add karna ho, toh input search ke text ke hisaab se collections ko filter karke dikhana hai. */}

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {/* Loading State jab tak collections of particular workspace load nhi huye hai */}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading collections...
                </span>
              </div>
            ) : // Error state agar collections of particular workspace nahi aa rhe

            isError ? (
              <div className="text-center py-4 text-destructive text-sm">
                Failed to load collections
              </div>
            ) : // state When there is no collections in workspace

            filteredCollections.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                {searchTerm
                  ? "No collections found"
                  : "No collections available"}
              </div>
            ) : (
              /*

							       Yaha hum filtered collections ko map karke render kar rahe hain.

						        Jab user kisi collection par click karega, toh selectedCollection woh collection set hojayega by its id
												
							      */

              filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => setSelectedCollectionId(collection.id)}
                  className={`flex items-center justify-between p-3  cursor-pointer rounded-md transition-all duration-200 ${
                    selectedCollectionId === collection.id
                      ? "bg-accent/40 border border-accent/60  tracking-wide shadow-sm "
                      : "border border-transparent hover:border-border hover:bg-muted/50 hover:shadow-md hover:shadow-border/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {selectedCollectionId === collection.id ? (
                      <div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <Folder className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm font-light`}>
                      {collection.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Collection Preview : means yaha pr preview dikhega ki request kis collection mein save hogi */}

        {selectedCollection && (
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Saving to:</span>
              <Folder className="w-4 h-4" />
              <span className="font-light">{selectedCollection.name}</span>
            </div>
          </div>
        )}

        {/* URL Preview (Optional) */}
        <div className="p-2 bg-card rounded border border-border">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">URL:</span>
            <span className="text-foreground truncate">{requestData.url}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveRequestToCollectionModal;
