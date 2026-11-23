"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "@/modules/authentication/components/user-button";
import { UserProps } from "../types";
import CommandPalette from "./search-bar";
import InviteMember from "./invite-member";
import Workspace from "./workspace";
import { Button } from "@/components/ui/button";
import { Braces, Cable, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import { cn } from "@/lib/utils";

interface Props {
  user: UserProps;
}

const MODES = [
  {
    href: "/app",
    label: "REST",
    icon: Braces,
    match: (path: string) => path.startsWith("/app"),
  },
  {
    href: "/realtime",
    label: "WebSocket",
    icon: Cable,
    match: (path: string) => path.startsWith("/realtime"),
  },
];

/*
  Top bar: identity and context on the left, the mode switch in the middle
  (where people look for "what am I testing?"), and global actions on the
  right. Global actions are grouped so the bar never reads as a toolbar soup.
*/
const Header = ({ user }: Props) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const {
    ref: themeSwitchRef,
    toggleSwitchTheme,
    isDarkMode,
  } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    duration: 650,
    blurAmount: 4,
    globalClassName: "dark",
    isDarkMode: isDark,
    onDarkModeChange: (darkMode) => setTheme(darkMode ? "dark" : "light"),
  });

  return (
    <header className="flex h-12 min-w-0 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:gap-3 sm:px-6">
      <Link
        href="/app"
        className="flex items-center font-mono text-[15px] font-semibold tracking-tight text-foreground select-none"
        aria-label="RouteX home"
      >
        route
        <span className="text-primary">X</span>
      </Link>

      <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

      <div className="min-w-0 shrink">
        <Workspace />
      </div>

      <nav
        aria-label="Mode"
        className="flex shrink-0 items-center gap-0.5 rounded-md bg-muted p-1 sm:ml-2"
      >
        {MODES.map((mode) => {
          const active = mode.match(pathname);
          const Icon = mode.icon;
          return (
            <Link
              key={mode.href}
              href={mode.href}
              aria-current={active ? "page" : undefined}
              aria-label={mode.label}
              title={mode.label}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[13px] font-medium transition-colors sm:px-3",
                active
                  ? "bg-surface-raised text-foreground shadow-[0_0_0_1px_var(--border)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">{mode.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex min-w-0 flex-1 justify-center px-1 sm:px-6">
        <CommandPalette />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <InviteMember />
        <Button
          ref={themeSwitchRef as React.Ref<HTMLButtonElement>}
          variant="ghost"
          size="icon-sm"
          onClick={toggleSwitchTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {mounted && isDarkMode ? <Sun /> : <Moon />}
        </Button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
