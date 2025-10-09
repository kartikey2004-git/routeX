import Modal from "@/components/ui/modal";
import React, { useState } from "react";
import { toast } from "sonner";
import { useEditRequest } from "../hooks/request";
import { REST_METHOD } from "@prisma/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const EditRequestModal = ({
  isModalOpen,
  setIsModalOpen,
  requestId,
  collectionId,
  collectionName,
  initialName,
  initialUrl,
  initialMethod,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestId: string;

  collectionId: string;
  collectionName: string;
  initialName: string;
  initialUrl: string;
  initialMethod: REST_METHOD;
}) => {
  // State to updating the request name where default state is intial name of request

  const [name, setName] = useState(initialName);

  // State to updating the request method where default state is intial method of request

  const [method, setMethod] = useState(initialMethod);

  // State to updating the request endpoint url where default state is intial url of request

  const [url, setUrl] = useState(initialUrl);

  // when we are updating something we need mutate function for mutation or lets say in this case updation of request , we also need to pass collectionId

  const { mutateAsync, isPending } = useEditRequest(
    requestId,
    collectionId,
    name,
    method,
    url
  );

  const handleSubmit = async () => {
    // validation for name input field
    if (!name.trim()) return;

    try {
      await mutateAsync(); // mutateAsync for mutation asynchronously

      toast.success(
        `Request "${name}" in collection "${collectionName}" updated successfully`
      );
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to update request");
      console.error("Failed to update request:", err);
    }
  };

  return (
    <Modal
      title="Edit Request"
      description="Rename your Request"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save Changes"}
      submitVariant="default"
    >
      <div className="space-y-5">
        {/* Request Name */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Request Name</Label>
          <Input
            placeholder="Enter request name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Request URL */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Request URL</Label>
          <Input
            placeholder="Enter request URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* Request Method */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Request Method</Label>
          <Select
            value={method}
            onValueChange={(value: REST_METHOD) => setMethod(value)}
          >
            <SelectTrigger className="w-full focus-visible:ring-indigo-500">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">{REST_METHOD.GET}</SelectItem>
              <SelectItem value="POST">{REST_METHOD.POST}</SelectItem>
              <SelectItem value="PUT">{REST_METHOD.PUT}</SelectItem>
              <SelectItem value="PATCH">{REST_METHOD.PATCH}</SelectItem>
              <SelectItem value="DELETE">{REST_METHOD.DELETE}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default EditRequestModal;
