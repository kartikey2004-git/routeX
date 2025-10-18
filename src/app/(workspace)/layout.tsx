import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import TabbedLeftPanel from "@/modules/workspace/components/tabbed-left-panel";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const workspace = await initializeWorkspace();
  console.log(JSON.stringify(workspace));

  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  return (
    <>
      {/*Header */}

      {user && <Header user={user} />}
      <main className="max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden">
        <div className="flex h-full w-full">
          <div className="w-12 border-zinc-800 bg-zinc-900">
            {/* Tabbed left panel */}
            <TabbedLeftPanel />
          </div>

          <div className="flex-1 bg-zinc-900">{children}</div>
        </div>
      </main>
    </>
  );
};

export default RootLayout;

// We try to make all layout files to be a server component

// jaise hi apna root layout load hoga ya phir render hoga , waise hi hum user ke liye ek workspace intialize krdenge
