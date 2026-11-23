import Link from "next/link";
import { SectionLink } from "./section-link";
import { Linkedin, Mail, type LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMAIL = "kartikeybhatnagar247@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337";

type FooterLink = { label: string; href: string };
type SocialLink = FooterLink & { icon: LucideIcon };

// "#section" links land on this page; they need no navigation.
const productLinks: FooterLink[] = [
  { label: "Product tour", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const workspaceLinks: FooterLink[] = [
  { label: "Sign in", href: "/sign-in" },
  { label: "REST workbench", href: "/app" },
  { label: "WebSocket", href: "/realtime" },
];

const resourceLinks: FooterLink[] = [
  { label: "Support", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", href: LINKEDIN_URL },
];

const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: LINKEDIN_URL, icon: Linkedin },
  { label: "Email", href: `mailto:${EMAIL}`, icon: Mail },
];

const headingClass = "text-sm font-medium text-foreground";
const linkClass = "block transition-colors hover:text-foreground";

function FooterLinkItem({ label, href }: FooterLink) {
  const isExternal = /^https?:\/\//.test(href);
  const isMailTo = href.startsWith("mailto:");
  const isAnchor = href.startsWith("#");

  if (isExternal || isMailTo) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={linkClass}
      >
        {label}
      </a>
    );
  }

  if (isAnchor) {
    return (
      <SectionLink href={href} className={linkClass}>
        {label}
      </SectionLink>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

/*
  Marketing footer, structured like the markstack footer: a brand blurb and
  four link groups, a row of icon links with tooltips, then a copyright bar.
*/
export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-8 lg:items-start">
          <div className="space-y-3">
            <h4 className={headingClass}>About RouteX</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              RouteX is a workbench for building, sending and organizing REST
              and WebSocket requests, with timing you can read at a glance.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={headingClass}>Product</h4>
            <nav aria-label="Product" className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((link) => (
                <FooterLinkItem key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className={headingClass}>Workspace</h4>
            <nav aria-label="Workspace" className="space-y-2 text-sm text-muted-foreground">
              {workspaceLinks.map((link) => (
                <FooterLinkItem key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className={headingClass}>Resources</h4>
            <nav aria-label="Resources" className="space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <FooterLinkItem key={link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className={headingClass}>Connect</h4>
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isExternal = social.href.startsWith("http");

                return (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        aria-label={social.label}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top">{social.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} RouteX. All rights reserved.</p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Built by Kartikey
          </a>
        </div>
      </div>
    </footer>
  );
}
