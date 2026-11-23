import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/modules/authentication/actions";
import { acceptWorkspaceInvite } from "@/modules/invites/actions";
import { Button } from "@/components/ui/button";

type Outcome =
  | { kind: "joined" }
  | { kind: "expired" }
  | { kind: "invalid" }
  | { kind: "failed" };

const MESSAGES: Record<Exclude<Outcome["kind"], "joined">, {
  title: string;
  body: string;
}> = {
  expired: {
    title: "This invite has expired",
    body: "Ask the workspace owner for a new invite link.",
  },
  invalid: {
    title: "This invite link isn't valid",
    body: "It may have been used already or copied incorrectly. Check the link, or ask for a new one.",
  },
  failed: {
    title: "Couldn't join the workspace",
    body: "Something went wrong on our side. Try the link again in a moment.",
  },
};

const Invite = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`);
  }

  let outcome: Outcome;
  try {
    const invite = await acceptWorkspaceInvite(token);
    outcome = invite.success ? { kind: "joined" } : { kind: "failed" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Invite expired") outcome = { kind: "expired" };
    else if (message === "Invalid invite") outcome = { kind: "invalid" };
    else outcome = { kind: "failed" };
  }

  // Redirects throw, so they stay outside the try block.
  if (outcome.kind === "joined") redirect("/app");

  const copy = MESSAGES[outcome.kind];

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm space-y-5">
        <span className="font-mono text-[15px] font-semibold tracking-tight">
          route<span className="text-primary">X</span>
        </span>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-foreground">{copy.title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/app">Go to my workspace</Link>
        </Button>
      </div>
    </main>
  );
};

export default Invite;
