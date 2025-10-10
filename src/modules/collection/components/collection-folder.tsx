/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  EllipsisVertical,
  FilePlus,
  Folder,
  Loader2,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import EditCollectionModal from "./edit-collection-modal";
import DeleteCollectionModal from "./delete-collection-modal";
import SaveRequestToCollectionModal from "./add-request-modal";
import { useGetAllRequestFromCollection } from "@/modules/request/hooks/request";
import { REST_METHOD } from "@prisma/client";
import EditRequestModal from "@/modules/request/components/edit-request-modal";
import DeleteRequestModal from "@/modules/request/components/delete-request-modal";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";

interface Props {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    workspaceId: string;
  };
}

const CollectionFolder = ({ collection }: Props) => {
  // Folder collapse/expand state handle karne ke liye.
  const [isCollapsed, setIsCollapsed] = useState(false);

  // state for opening modal for adding a request

  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);

  // state for opening modal for deleting , editing a collection

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // state for opening edit and delete modal for particular request

  const [isEditReqOpen, setIsEditReqOpen] = useState(false);

  const [isDelReqOpen, setIsDelReqOpen] = useState(false);

  // we need to handle state for currently selected request to perform edit and delete

  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // hook for getting all requests from a particular collection by passing particular collection id

  const {
    data: requestData,
    isPending,
    isError,
  } = useGetAllRequestFromCollection(collection.id);

  const { openRequestTab } = useRequestPlaygroundStore()

  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-green-500",
    [REST_METHOD.POST]: "text-blue-500",
    [REST_METHOD.PUT]: "text-yellow-500",
    [REST_METHOD.DELETE]: "text-red-500",
    [REST_METHOD.PATCH]: "text-orange-500",
  };

  // we have requests if we have requestData and uski length zero se jyada hai

  const hasRequests = requestData && requestData.length > 0;

  return (
    <>
      <Collapsible
        open={isCollapsed}
        onOpenChange={setIsCollapsed}
        className="w-full"
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center p-2 flex-1 w-full hover:bg-zinc-900 rounded-md">
            {/* Collection Header */}

            <CollapsibleTrigger className="flex flex-row justify-start items-center space-x-2 flex-1">
              <div className="flex items-center space-x-1">
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
                <Folder className="w-5 h-5 text-zinc-400" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {collection.name}
                </span>
              </div>
            </CollapsibleTrigger>

            <div className="flex flex-row justify-center items-center space-x-2">
              <FilePlus
                className="w-4 h-4 text-zinc-400 hover:text-indigo-400 cursor-pointer"
                onClick={() => setIsAddRequestOpen(true)}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-zinc-800 rounded">
                    <EllipsisVertical className="w-4 h-4 text-zinc-400 hover:text-indigo-400" />
                  </button>
                </DropdownMenuTrigger>

                {/* 
                
                we can implement shortcut keys related to add , delete and edit a request because it helps in PWA(progressive web apps) experience
                
                abhi toh we implement hot keys bhi implement krenge

                */}

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setIsAddRequestOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <FilePlus className="text-green-400 mr-2 w-4 h-4" />
                        Add Request
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘R
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <Edit className="text-blue-400 mr-2 w-4 h-4" />
                        Edit
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘E
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <Trash className="text-red-400 mr-2 w-4 h-4" />
                        Delete
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘D
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CollapsibleContent className="w-full">
            {/* pending state jab tak requests of particular collection load nhi huyi hai - still fetching */}

            {isPending ? (
              <div className="pl-8 py-2">
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="text-indigo-400 animate-spin" />
                </div>
              </div>
            ) : isError ? (
              // Error state agar requests of particular collection nahi aa rhe

              <div className="pl-8 py-2">
                <span className="text-xs text-red-400">
                  Failed to load requests
                </span>
              </div>
            ) : hasRequests ? (
              <div className="ml-6 border-l border-zinc-800 pl-4 space-y-1">
                {requestData.map((request: any) => {
                  // console.log(requestData);

                  // onclick krne request tab open ho woh baad mein implement krenge

                  return (
                    <div
                      key={request.id}
                      onClick={() => openRequestTab(request)}
                      className="flex items-center justify-between py-2 px-3 hover:bg-zinc-900/50 rounded-md cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              requestColorMap[
                                request.method as keyof typeof requestColorMap
                              ] ?? ""
                            }`}
                          >
                            {request.method}
                          </span>

                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm text-zinc-200 truncate font-medium">
                            {request.name || request.url}
                          </span>

                          {request.url && request.name && (
                            <span className="text-xs text-zinc-500 truncate">
                              {request.url}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Here is assignment for implementing a whole functionality for updating , deleting a request  */}

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-zinc-800 rounded">
                              <EllipsisVertical className="w-3 h-3 text-zinc-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-32">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsEditReqOpen(true);
                              }}
                            >
                              <Edit className="text-blue-400 mr-2 w-3 h-3" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsDelReqOpen(true);
                              }}
                            >
                              <Trash className="text-red-400 mr-2 w-3 h-3" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

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
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pl-8 py-2">
                <span className="text-xs text-zinc-500 italic">
                  No requests yet
                </span>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* 
      
      Modals for editing and deleting a collection 
        
        - EditCollectionModal accepts isModalOpen ,setIsModalOpen for opening the modal and collectionId and intial collection name by default when collection modal opens

        - DeleteCollectionModal accepts isModalOpen ,setIsModalOpen for opening the modal and collectionId for deleting a particular collection
        
      */}

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
    </>
  );
};

export default CollectionFolder;

// now we want to render all saved requests inside a collection
