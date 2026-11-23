/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { toast } from "sonner";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useSuggestRequestName } from "@/modules/ai/hooks/ai-suggestion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { describeAiError } from "@/modules/ai/services/describe-error";
import { REST_METHOD } from "@prisma/client";
import { Label } from "@/components/ui/label";

/*
  Rename the open tab. The name is UI state until the request is saved
  (⌘S), which is why the tab shows its unsaved dot afterwards.
*/
const AddNameModal = ({
  isModalOpen,
  setIsModalOpen,
  tabId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  tabId: string;
}) => {
  const { updateTab, tabs, markUnsaved } = useRequestPlaygroundStore();
  const { mutateAsync, isPending } = useSuggestRequestName();
  const tab = tabs.find((t) => t.id === tabId);

  const [name, setName] = useState(tab?.title || "");
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; reasoning: string }>
  >([]);

  useEffect(() => {
    if (tab) setName(tab.title);
  }, [tabId]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateTab(tabId, { title: name.trim() });
    markUnsaved(tabId, true);
    setIsModalOpen(false);
    setSuggestions([]);
  };

  const suggestNames = async () => {
    if (!tab) return;
    try {
      const result = await mutateAsync({
        workspaceName: tab.workspaceId || "Default Workspace",
        method: (tab.method as REST_METHOD) || "GET",
        url: tab.url || "",
        description: `Request in collection ${tab.collectionId || ""}`,
      });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        toast.message("No suggestions for this request. Name it yourself.");
      }
    } catch (error) {
      toast.error(describeAiError(error, "Getting suggestions"));
    }
  };

  return (
    <Modal
      title="Rename request"
      description="The new name shows on this tab. Save the request to keep it."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText="Rename"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="rename-request" className="text-sm font-medium">
            Name
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="rename-request"
              className="flex-1"
              placeholder="e.g. Create order"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Button
              variant="outline"
              onClick={suggestNames}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <Sparkles />}
              {isPending ? "Thinking…" : "Suggest"}
            </Button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Suggestions
            </p>
            <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => setName(suggestion.name)}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <span className="text-sm text-foreground">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {suggestion.reasoning}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddNameModal;
