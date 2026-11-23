import { auth } from "@/lib/auth";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Linkedin, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not signed in (or the session expired): sign in, then come back to this page.
  if (!session) {
    const requested = (await headers()).get("x-pathname") ?? "/app";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(requested)}`);
  }

  const user = await currentUser();
  if (!user) return;
  await initializeWorkspace(user);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <Header user={user} />

      <main className="flex min-h-0 flex-1 overflow-hidden">{children}</main>

      {/* Status bar: quiet, always visible, holds the secondary links. */}
      <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-surface px-3 text-[11px] text-muted-foreground">
        <span>© {new Date().getFullYear()} RouteX</span>

        <TooltipProvider>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>LinkedIn</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="mailto:kartikeybhatnagar247@gmail.com"
                  className="hover:text-foreground"
                  aria-label="Email"
                >
                  <Mail className="size-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Email</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </footer>
    </div>
  );
};

export default RootLayout;
