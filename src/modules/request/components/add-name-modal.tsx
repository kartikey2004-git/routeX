/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";


const AddNameModal = ({
  isModalOpen,
  setIsModalOpen,
  tabId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  tabId: string;
}) => {
  // rename modal when user click two times on a particular request tab , just reflect/update in UI , no database calls , database mein request toh ctrl + s pe hi update hogi

  const { updateTab, tabs, markUnsaved } = useRequestPlaygroundStore();

  const tab = tabs.find((tab) => tab.id === tabId);

  // state to change or rename the tab title and show by default intial name

  const [name, setName] = useState(tab?.title || "");

  // on changing tabId or component mount for first time set name to tab title

  useEffect(() => {
    if (tab) setName(tab.title);
  }, [tabId]);

  const handleSubmit = async () => {
    // validate the name input
    if (!name.trim()) return;

    // update the tab title and markUnsaved to be true that means no unsaved changes

    try {
      updateTab(tabId, { title: name });
      markUnsaved(tabId, true);
      toast.success("Request name updated");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update request name");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Rename Request"
      description="Give your request a name"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText="Save"
      submitVariant="default"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-center gap-2">
          {/* input for renaming tab title */}

          <Input
            className="w-full p-2 border rounded bg-zinc-900 text-white"
            placeholder="Request Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddNameModal;
