import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LandingPage } from "@/modules/landing/components/landing-page";

// Signed-in users skip the marketing page and go straight to the workbench.
export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/app");

  return <LandingPage />;
}
