import { auth } from "@/lib/auth";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import TabbedLeftPanel from "@/modules/workspace/components/tabbed-left-panel";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // we grab the session from auth.api.getSession and we have to pass headers

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if we don't have session means user's is not loggedIn or authenticated , then we have redirect to sign-in page

  if (!session) {
    redirect("/sign-in");
  }

  const workspace = await initializeWorkspace();

  console.log(JSON.stringify(workspace));

  // utility for extracting current user data which search on basis of session user id in the database and extract user details

  const user = await currentUser();

  return (
    <>
      {/*Header */}

      {user && (
        <>
          <Header user={user} /> {/* main section of our app */}
          <main className="max-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-1 overflow-hidden">
            <div className="flex h-full w-full">
              <div className="flex-1 bg-zinc-900">{children}</div>

              <div className="border-l border-zinc-700"></div>

              <div className="w-12 border-zinc-800 bg-zinc-900">
                {/* Tabbed left panel */}
                <TabbedLeftPanel />
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default RootLayout;

// We try to make all layout files to be a server component

// jaise hi apna root layout load hoga ya phir render hoga , waise hi hum user ke liye ek workspace intialize krdenge

/*

Fix(update): if user is not loggedIn then us ko redirect kro loggedIn page pe

  - ye children render ho rha tha  even if user is not loggedIn though

  - we have to setup authentication , if user is not loggedIn or we don't have not any session , then redirect to login "/sign-in" page , 

*/
