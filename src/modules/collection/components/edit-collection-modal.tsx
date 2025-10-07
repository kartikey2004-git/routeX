import Modal from "@/components/ui/modal";
import React, { useState } from "react";
import { toast } from "sonner";
import { useEditCollection } from "../hooks/collection";

const EditCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
  initialName,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
  initialName: string;
}) => {

  // State to updating the collection name where default state is intial name of collection

  const [name, setName] = useState(initialName);

  // when we are updating something we need mutate function for mutation or lets say in this case updation of collection 

  const { mutateAsync, isPending } = useEditCollection(collectionId, name);

  const handleSubmit = async () => {

    // validation for name input field
    if (!name.trim()) return;

    try {

      await mutateAsync(); // mutateAsync for mutation asynchronously

      toast.success("Collection updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to update collection");
      console.error("Failed to update collection:", err);
    }
  };

  return (
    <Modal
      title="Edit Collection"
      description="Rename your collection"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save Changes"}
      submitVariant="default"
    >
      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Collection name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default EditCollectionModal;
