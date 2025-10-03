import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  
  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  return (
    <>
      {/*Header */}

      {/* @ts-ignore */}
      <Header user={user} />
      <main className="max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden">
        <div className="flex h-full w-full">
          <div className="w-12 border-zinc-800 bg-zinc-900">
            {/* Tabbed left panel */}
          </div>

          <div className="flex-1 bg-zinc-900">{children}</div>
        </div>
      </main>
    </>
  );
};

export default RootLayout;

// We try to make all layout files to be a server component
