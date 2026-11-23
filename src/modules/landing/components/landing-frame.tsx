import Link from "next/link";
import { SectionLink } from "./section-link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { nav } from "../content";

/*
  Marketing frame: a sticky header with real section links and the two
  sign-in entry points (a quiet "Sign in" and a primary "Get started").
  The workbench and login pages never render this.
*/
export function LandingFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-(--spacing-topbar) w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-mono text-[15px] font-semibold tracking-tight select-none"
              aria-label="RouteX home"
            >
              route<span className="text-primary">X</span>
            </Link>
            <nav aria-label="Page sections" className="hidden items-center gap-6 md:flex">
              {nav.links.map((link) => (
                <SectionLink
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </SectionLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-in">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
