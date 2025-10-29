import { auth } from "@/lib/auth";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import TabbedLeftPanel from "@/modules/workspace/components/tabbed-left-panel";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

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
          <footer className="w-full border-t border-white/10 bg-zinc-900/90 text-gray-300">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left Section */}
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} routeX. All rights reserved.
              </div>
              {/* Center Section */}
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="hover:text-white transition-colors duration-200"
                >
                  Terms
                </a>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/kartikey2004-git/routeX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:kartikeybhatnagar247@gmail.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </footer>
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
