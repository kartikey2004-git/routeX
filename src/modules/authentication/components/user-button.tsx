"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserButtonProps {
  user: UserData | null;
  size?: "sm" | "md";
}

const getUserInitials = (name: string | null, email: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
};

/*
  Account menu. Identity first (who am I signed in as), then sign out. Only
  actions that exist are listed.
*/
export default function UserButton({ user, size = "md" }: UserButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/"),
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const avatarSize = size === "sm" ? "size-6" : "size-8";
  const initials = getUserInitials(user.name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className={`${avatarSize} rounded-sm`}>
            <AvatarImage src={user.image || ""} alt="" />
            <AvatarFallback className="rounded-sm bg-muted text-[11px] font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 font-normal">
          <Avatar className="size-8 rounded-sm">
            <AvatarImage src={user.image || ""} alt="" />
            <AvatarFallback className="rounded-sm bg-muted text-xs font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name || "Signed in"}
            </p>
            {user.email && (
              <p className="truncate font-mono text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
        >
          <LogOut />
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
