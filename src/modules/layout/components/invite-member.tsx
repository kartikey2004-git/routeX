/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Link as LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/ui/hint";
import { useWorkspaceStore } from "../store";
import { toast } from "sonner";
import {
  useGenerateWorkspaceInvite,
  useGetWorkspaceMembers,
} from "@/modules/invites/hooks/invite";

const InviteMember = () => {
  const [inviteLink, setInviteLink] = useState("");
  const { selectedWorkspace } = useWorkspaceStore();

  const { mutateAsync, isPending } = useGenerateWorkspaceInvite(
    selectedWorkspace?.id || ""
  );

  const { data: workspaceMembers, isLoading } = useGetWorkspaceMembers(
    selectedWorkspace?.id || ""
  );

  console.log("Selected Workspace members: ", workspaceMembers);

  const generateInviteLink = async () => {
    if (!selectedWorkspace?.id) {
      toast.error("Please select a workspace first");
      return;
    }
    try {
      const response = await mutateAsync();
      setInviteLink(response);
      toast.success("Invite link generated!");
    } catch (error) {
      toast.error("Failed to generate invite link");
    }
  };

  const copyToClipboard = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
    }
  };

  return (
    <DropdownMenu>
      <Hint label="Invite Member">
        <DropdownMenuTrigger asChild>
          <Button className="border border-gray-400/10 bg-gray-400/10 hover:bg-gray-400/20 text-gray-400 hover:text-gray-300">
            <UserPlus className="size-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent className="w-80 rounded-xl" align="end">
        <div className="p-4">
          <DropdownMenuLabel className="font-light">
            Invite to {selectedWorkspace?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Members Avatars */}
          <div className="flex -space-x-2 overflow-hidden mb-3">
            {isLoading ? (
              <p className="text-xs text-muted-foreground">
                Loading members...
              </p>
            ) : (
              workspaceMembers?.map((member: any) => (
                <Hint
                  key={member.id}
                  label={member.user.name || "Unknown User"}
                >
                  <Avatar className="border-2  size-8 mt-2">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Hint>
              ))
            )}
          </div>

          {/* Invite Link Input */}
          <div className="flex gap-2 items-center">
            <Input
              value={inviteLink}
              placeholder="Generate an invite link..."
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!inviteLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Generate Button */}
          <Button
            className="mt-3 w-full bg-zinc-800 hover:bg-zinc-900 text-white font-light"
            onClick={generateInviteLink}
            disabled={isPending}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            {isPending ? "Generating..." : "Generate Link"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InviteMember;
