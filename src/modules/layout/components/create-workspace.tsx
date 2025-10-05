"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { useCreateWorkspace } from "@/modules/workspace/hooks/workspace";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const CreateWorkspace = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  
  // State to store the workspace name while creating a new workspace
  const [name, setName] = useState("");

  // when we are creating something we need mutate function for mutation or lets say in this case creation of workspace

  const { isPending, mutateAsync } = useCreateWorkspace();

  const handleSubmit = async () => {
    // validation for name input field
    if (!name.trim()) return;

    try {
      await mutateAsync(name);
      toast.success("Workspace created successfully");
      setName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  return (
    <Modal
      title="Add New Workspace"
      description="Create a new workspace to organize your projects"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Creating..." : "Create Workspace"}
      submitVariant="default"
    >
      <div className="space-y-4">
        <Input
          className="w-full p-2 border rounded-sm"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default CreateWorkspace;
