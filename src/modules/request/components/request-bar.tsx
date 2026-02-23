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

  const requestColorMap: Record<string, string> = {
    GET: "text-green-500",
    POST: "text-indigo-500",
    PUT: "text-yellow-500",
    DELETE: "text-red-500",
    PATCH: "text-orange-500",
  };

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
            className={`w-28 font-semibold text-sm focus:ring-0 border-none shadow-none ${
              requestColorMap[tab.method] || "text-muted-foreground"
            }`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border">
            <SelectGroup>
              <SelectItem value="GET" className="text-green-500 font-semibold">
                GET
              </SelectItem>
              <SelectItem value="POST" className="text-blue-500 font-semibold">
                POST
              </SelectItem>
              <SelectItem value="PUT" className="text-yellow-500 font-semibold">
                PUT
              </SelectItem>
              <SelectItem value="DELETE" className="text-red-500 font-semibold">
                DELETE
              </SelectItem>
              <SelectItem
                value="PATCH"
                className="text-orange-500 font-semibold"
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
          className="flex-1 bg-background text-foreground placeholder:text-muted-foreground border border-input rounded-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
        />

        {/* button which send HTTP requests on endpoint url */}
      </div>
      <Button
        type="submit"
        onClick={onSendRequest}
        disabled={!tab.url || isPending}
        className="ml-3 flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
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
