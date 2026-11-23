"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function GithubSignInButton({
  callbackUrl = "/app",
  label = "Continue with GitHub",
  size = "lg",
  className,
}: {
  callbackUrl?: string;
  label?: string;
  size?: "default" | "lg";
  className?: string;
}) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function signInWithGithub() {
    try {
      setIsSigningIn(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
    } catch (error) {
      console.error("GitHub sign in failed:", error);
      setIsSigningIn(false);
    }
  }

  return (
    <Button
      size={size}
      onClick={signInWithGithub}
      disabled={isSigningIn}
      className={className}
    >
      {isSigningIn ? <Spinner /> : <FaGithub />}
      {isSigningIn ? "Redirecting to GitHub…" : label}
    </Button>
  );
}
