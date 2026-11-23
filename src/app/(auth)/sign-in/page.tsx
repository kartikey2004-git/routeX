import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GithubSignInButton } from "@/modules/authentication/components/github-sign-in-button";
import { Specimen } from "@/modules/landing/components/specimen";
import { hero } from "@/modules/landing/content";
import { safeCallbackUrl } from "@/lib/safe-callback";
import { auth } from "@/lib/auth";

type SearchParams = Promise<{
  callbackUrl?: string | string[];
  error?: string | string[];
}>;

const aboutPoints = [
  "REST requests with status and timing at a glance",
  "WebSocket endpoints with a live message log",
  "Collections and invite links for your team",
  "AI assist for request names and JSON bodies",
];

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { callbackUrl, error } = await searchParams;
  const destination = safeCallbackUrl(callbackUrl);
  const failed = Boolean(Array.isArray(error) ? error[0] : error);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(destination);

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div aria-hidden="true" className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 opacity-50" />

        <Link
          href="/"
          className="relative inline-flex w-fit font-mono text-[15px] font-semibold tracking-tight select-none"
          aria-label="RouteX home"
        >
          route<span className="text-primary">X</span>
        </Link>

        <div className="relative max-w-xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-foreground xl:text-[44px]">
              {hero.headline}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">{hero.lede}</p>
          </div>

          <ul className="space-y-3 border-t border-border pt-6 text-sm text-foreground mb-4">
            {aboutPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <Specimen />
        </div>
      </aside>

      <main className="flex flex-col px-6 py-10 sm:px-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Back to RouteX
          </Link>
          <Link
            href="/"
            className="font-mono text-[15px] font-semibold tracking-tight select-none lg:hidden"
            aria-label="RouteX home"
          >
            route<span className="text-primary">X</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="w-full max-w-sm space-y-8 lg:mx-auto">
            <div className="space-y-4 border-b border-border pb-8 lg:hidden">
              <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-foreground">
                {hero.headline}
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {aboutPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Sign in to RouteX
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use your GitHub account. Your workspace and collections load
                after you sign in.
              </p>
            </div>

            {failed && (
              <Alert variant="destructive" role="alert">
                <AlertCircle />
                <AlertTitle>Sign-in didn&apos;t finish</AlertTitle>
                <AlertDescription>
                  GitHub didn&apos;t complete the sign-in. Try again. If it keeps
                  failing, check that you approved access to RouteX on GitHub.
                </AlertDescription>
              </Alert>
            )}

            <GithubSignInButton
              callbackUrl={destination}
              label="Sign in with GitHub"
              className="h-11 w-full text-sm"
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              New here? Signing in creates your first workspace automatically.
              RouteX never asks for a password.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
