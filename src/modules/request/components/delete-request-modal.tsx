"use client";

import React from "react";
import { toast } from "sonner";
import { useDeleteRequest } from "../hooks/request";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

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
  const { mutateAsync, isPending } = useDeleteRequest(requestId, collectionId);

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success(`Deleted from ${collectionName}`);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Couldn't delete the request. Try again.");
      console.error("Failed to delete request:", err);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      title="Delete this request?"
      description="It's removed from the collection. This can't be undone."
      confirmLabel="Delete request"
      pending={isPending}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteRequestModal;
