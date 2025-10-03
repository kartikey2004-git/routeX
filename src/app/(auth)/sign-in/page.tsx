"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1117]">
      <div className="relative flex w-full lg:w-3/5 items-center justify-center px-6 py-16 lg:py-20 lg:px-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <Link href={"/"}>
            <h1 className="mb-4 text-3xl font-light leading-tight tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-white">RouteX</span> <br />
              <span className="font-normal text-gray-400">
                Always Sync with Server
              </span>
            </h1>
          </Link>

          <p className="mb-6 inline-block rounded-md border border-gray-700 bg-black/50 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
            Discover RouteX
          </p>

          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-300 max-w-xl mx-auto lg:mx-0">
            RouteX lets developers test and debug APIs and uses AI features for
            automated tests, smart request validation, and code suggestions.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center border-2 border-gray-800/10 px-6 py-12 lg:px-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm">
              Login with Providers
            </span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full flex items-center justify-center gap-3 transition-all shadow-md border-gray-700 bg-gray-950/10 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm hover:bg-gray-700/20"
              onClick={() =>
                signIn.social({
                  provider: "github",
                  callbackURL: "/",
                })
              }
            >
              <FaGithub /> Sign in with GitHub
            </Button>

            <Button
              className="w-full flex items-center justify-center gap-3 transition-all shadow-md border-gray-700 bg-gray-950/10 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm hover:bg-gray-700/20"
              onClick={() =>
                signIn.social({ provider: "google", callbackURL: "/" })
              }
            >
              <FaGoogle /> Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
