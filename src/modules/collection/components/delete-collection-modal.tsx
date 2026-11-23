"use client";

import React from "react";
import { toast } from "sonner";
import { useDeleteCollection } from "../hooks/collection";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

const DeleteCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
}) => {
  const { mutateAsync, isPending } = useDeleteCollection(collectionId);

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success("Collection deleted");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Couldn't delete the collection. Try again.");
      console.error("Failed to delete collection:", err);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      title="Delete this collection?"
      description="Its requests are deleted too. This can't be undone."
      confirmLabel="Delete collection"
      pending={isPending}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteCollectionModal;
