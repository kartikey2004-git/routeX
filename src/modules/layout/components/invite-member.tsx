/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Link as LinkIcon, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/shared/hint";
import { ErrorState, LoadingRows } from "@/components/shared/states";
import { useWorkspaceStore } from "../store";
import { toast } from "sonner";
import {
  useGenerateWorkspaceInvite,
  useGetWorkspaceMembers,
} from "@/modules/invites/hooks/invite";

/*
  Invite popover: who is already here first (so people know the scope),
  then a link to share. The link is copied with visible confirmation.
*/
const InviteMember = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { selectedWorkspace } = useWorkspaceStore();

  const { mutateAsync, isPending } = useGenerateWorkspaceInvite(
    selectedWorkspace?.id || "",
  );

  const {
    data: workspaceMembers,
    isLoading,
    isError: isMembersError,
    refetch: refetchMembers,
  } = useGetWorkspaceMembers(selectedWorkspace?.id || "");

  const generateInviteLink = async () => {
    if (!selectedWorkspace?.id) {
      toast.error("Select a workspace first");
      return;
    }
    try {
      const response = await mutateAsync();
      setInviteLink(response);
    } catch {
      toast.error("Couldn't create an invite link. Try again.");
    }
  };

  const copyToClipboard = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const members: any[] = workspaceMembers ?? [];

  return (
    <DropdownMenu>
      <Hint label="Invite members">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Invite members">
            <UserPlus />
          </Button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent className="w-80 p-0" align="end">
        <DropdownMenuLabel className="px-4 pt-4 pb-3 text-sm font-semibold">
          Share {selectedWorkspace?.name ?? "workspace"}
        </DropdownMenuLabel>

        <div className="px-4 pb-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Members
          </p>
          {isLoading ? (
            <LoadingRows rows={2} />
          ) : isMembersError ? (
            <ErrorState
              className="px-0 py-2"
              title="Couldn't load members"
              description="You can still create an invite link below."
              onRetry={() => refetchMembers()}
            />
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Only you so far. Invite someone below.
            </p>
          ) : (
            <ul className="max-h-40 space-y-2 overflow-y-auto">
              {members.map((member: any) => (
                <li key={member.id} className="flex items-center gap-2.5">
                  <Avatar className="size-6">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback className="text-[11px]">
                      {member.user.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">
                    {member.user.name || "Unnamed member"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="space-y-2 px-4 py-4">
          <p className="text-xs font-medium text-muted-foreground">
            Invite link
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={inviteLink}
              placeholder="Generate a link to share"
              readOnly
              className="font-mono text-xs"
              aria-label="Invite link"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!inviteLink}
              aria-label={copied ? "Copied" : "Copy invite link"}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={generateInviteLink}
            disabled={isPending}
          >
            <LinkIcon />
            {isPending ? "Generating…" : inviteLink ? "Generate a new link" : "Generate link"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InviteMember;
