import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import GridLayout from "./GridLayout";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to home if user is already logged in
  if (session) {
    return redirect("/");
  }

  // Render the layout with children
  return <GridLayout>{children}</GridLayout>;
}
