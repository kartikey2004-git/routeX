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
import { useRunRequest } from "../hooks/request";
import { toast } from "sonner";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestBar = ({ tab, updateTab }: Props) => {
  // here utility/hashmap for mapping color according to different HTTP requests

  const { mutateAsync, isPending } = useRunRequest(tab?.requestId ?? "");

  const requestColorMap: Record<string, string> = {
    GET: "text-green-500",
    POST: "text-indigo-500",
    PUT: "text-yellow-500",
    DELETE: "text-red-500",
    PATCH: "text-orange-500",
  };

  const onSendRequest = async () => {
    try {
      const res = await mutateAsync();
      toast.success("Request sent successfully");
    } catch (error) {
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 w-full shadow-sm">
      {/* Left section — Method selector + URL input */}

      <div className="flex items-center gap-3 flex-1">
        {/* we can update the tab request method in real time from this select component*/}

        <Select
          value={tab.method}
          onValueChange={(value) => updateTab(tab.id, { method: value })}
        >
          <SelectTrigger
            className={`w-28 font-semibold text-sm focus:ring-0 border-none shadow-none ${
              requestColorMap[tab.method] || "text-gray-400"
            }`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border border-zinc-800">
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
          className="flex-1 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 border border-zinc-700 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />

        {/* button which send HTTP requests on endpoint url */}
      </div>
      <Button
        type="submit"
        onClick={onSendRequest}
        disabled={!tab.url}
        className="ml-3 flex items-center gap-2 bg-zinc-800/90 hover:bg-zinc-700/90 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-sm transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Send
      </Button>
    </div>
  );
};

export default RequestBar;

// now we want to achieve one thing when we click on particular request inside the particular collection collapsible , it opens the particular request tab
