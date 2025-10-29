"use client";

import React from "react";
import UserButton from "@/modules/authentication/components/user-button";
import { UserProps } from "../types";
import SearchBar from "./search-bar";
import InviteMember from "./invite-member";
import Workspace from "./workspace";

interface Props {
  user: UserProps;
}

const Header = ({ user }: Props) => {
  return (
    <header className="grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-hidden p-2 border bg-zinc-900/70">
      <div className="col-span-2 flex items-center space-x-2 ml-2 hover:cursor-pointer hover:opacity-80 font-extralight">
        <h1 className="text-2xl font-normal select-none tracking-tight">
          route
          <span className="text-white">X</span>
        </h1>
      </div>

      <div className="col-span-1 flex items-center justify-between space-x-2">
        <div className="border-animation relative p-[1px] rounded flex-1 self-stretch overflow-hidden flex items-center justify-center">
          <SearchBar />
        </div>
      </div>

      {/* actual backend logics implementation */}
      <div className="col-span-2 flex items-center justify-end space-x-2 hover:cursor-pointer hover:opacity-80">
        {/* 3 components */}
        <InviteMember />
        <Workspace />
        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
