"use client";

import React from "react";
import UserButton from "@/modules/authentication/components/user-button";
import { UserProps } from "../types";
import SearchBar from "./search-bar";
import InviteMember from "./invite-member";
import Workspace from "./workspace";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";

interface Props {
  user: UserProps;
}

const Header = ({ user }: Props) => {
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
    <header className="grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-hidden border-b bg-card px-3 py-2">
      <div className="col-span-2 flex items-center space-x-2 ml-2 hover:cursor-pointer hover:opacity-80 font-extralight">
        <h1 className="text-2xl font-normal select-none tracking-tight text-foreground">
          route
          <span className="text-primary">X</span>
        </h1>
      </div>

      <div className="col-span-1 flex items-center justify-between space-x-2">
        <div className="border-animation relative rounded p-px flex-1 self-stretch overflow-hidden flex items-center justify-center">
          <SearchBar />
        </div>
      </div>

      {/* actual backend logics implementation */}
      <div className="col-span-2 flex items-center justify-end space-x-2 hover:cursor-pointer hover:opacity-80">
        {/* 3 components */}
        <Button
          ref={themeSwitchRef as React.Ref<HTMLButtonElement>}
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md"
          onClick={toggleSwitchTheme}
          aria-label="Toggle theme"
        >
          {mounted && isDarkMode ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <InviteMember />
        <Workspace />
        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
