"use client";

import Modal from "@/components/ui/modal";
import React from "react";
import { toast } from "sonner";
import { useDeleteRequest } from "../hooks/request";

const DeleteRequestModal = ({
  isModalOpen,
  setIsModalOpen,
  requestId,
  collectionId,
  collectionName,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestId: string;
  collectionId: string;
  collectionName: string;
}) => {
  // when we are deleting something we need mutate function for mutation or lets say in this case deletion of request by its requestId , we also have to pass collectionId

  const { mutateAsync, isPending } = useDeleteRequest(requestId, collectionId);

  const handleDelete = async () => {
    try {
      await mutateAsync(); // mutateAsync for mutation asynchronously

      toast.success(`Request from ${collectionName} deleted successfully`);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete request");
      console.error("Failed to delete request:", err);
    }
  };

  return (
    <Modal
      title="Delete Request"
      description="Are you sure you want to delete this request? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
    >
      <p className="text-sm text-zinc-500">
        Once deleted ,request will be permanently removed.
      </p>
    </Modal>
  );
};

export default DeleteRequestModal;
