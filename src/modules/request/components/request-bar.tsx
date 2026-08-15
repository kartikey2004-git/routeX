import React from "react";
import { RequestTab } from "../store/useRequestStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRunRequest, useRunDirectRequest } from "../hooks/request";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getMethodColor } from "@/lib/status-colors";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestBar = ({ tab, updateTab }: Props) => {
  // here utility/hashmap for mapping color according to different HTTP requests

  // Use appropriate hook based on whether request is saved
  const { mutateAsync: runSavedRequest, isPending: isSavedPending } =
    useRunRequest(tab?.requestId ?? "");
  const { mutateAsync: runDirectRequest, isPending: isDirectPending } =
    useRunDirectRequest();

  const isPending = isSavedPending || isDirectPending;

  const onSendRequest = async () => {
    try {
      if (tab.requestId) {
        // Request is saved, use regular run
        const res = await runSavedRequest();
        toast.success("Request sent successfully");
      } else {
        // Request is not saved, use direct run
        const res = await runDirectRequest();
        toast.success("Request sent successfully");
      }
    } catch (error) {
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="flex items-center justify-between bg-card border px-3 py-2 w-full shadow-sm">
      {/* Left section — Method selector + URL input */}

      <div className="flex items-center gap-3 flex-1">
        {/* we can update the tab request method in real time from this select component*/}

        <Select
          value={tab.method}
          onValueChange={(value) => updateTab(tab.id, { method: value })}
        >
          <SelectTrigger
            className={`w-28 font-semibold text-sm focus:ring-0 border-none shadow-none ${getMethodColor(
              tab.method,
            )}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border">
            <SelectGroup>
              <SelectItem
                value="GET"
                className={`font-semibold ${getMethodColor("GET")}`}
              >
                GET
              </SelectItem>
              <SelectItem
                value="POST"
                className={`font-semibold ${getMethodColor("POST")}`}
              >
                POST
              </SelectItem>
              <SelectItem
                value="PUT"
                className={`font-semibold ${getMethodColor("PUT")}`}
              >
                PUT
              </SelectItem>
              <SelectItem
                value="DELETE"
                className={`font-semibold ${getMethodColor("DELETE")}`}
              >
                DELETE
              </SelectItem>
              <SelectItem
                value="PATCH"
                className={`font-semibold ${getMethodColor("PATCH")}`}
              >
                PATCH
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          value={tab?.url || ""}
          onChange={(e) => updateTab(tab.id, { url: e.target.value })}
          placeholder="Enter URL"
          className="flex-1"
        />

        {/* button which send HTTP requests on endpoint url */}
      </div>
      <Button
        type="submit"
        onClick={onSendRequest}
        disabled={!tab.url || isPending}
        className="ml-3"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Sending...
          </>
        ) : (
          <>Send</>
        )}
      </Button>
    </div>
  );
};

export default RequestBar;

// now we want to achieve one thing when we click on particular request inside the particular collection collapsible , it opens the particular request tab
