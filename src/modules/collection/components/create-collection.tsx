import Modal from "@/components/ui/modal";
import React, { useState } from "react";
import { useCreateCollection } from "../hooks/collection";
import { toast } from "sonner";

interface Props {
  workspaceId: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}


const CreateCollection = ({
  workspaceId,
  isModalOpen,
  setIsModalOpen,
}: Props) => {

  // State to store the workspace name while creating a new collection link to particular workspace

  const [name, setName] = useState("");

  // when we are creating something we need mutate function  for mutation or lets say in this case creation of collection link to particular workspace

  const { mutateAsync, isPending } = useCreateCollection(workspaceId);

  const handleSubmit = async () => {

    // validation for name input field
    if (!name.trim()) return;

    try {

      await mutateAsync(name); // mutateAsync for mutation asynchronously

      toast.success("Collection created successfully");
      setName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <Modal
      title="Add New Collection"
      description="Create a new Collection to organize your requests"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Creating..." : "Create Collection"}
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

export default CreateCollection;
