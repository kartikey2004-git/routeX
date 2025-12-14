"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fff7ef] text-gray-900">
      <div className="bg-gradient-to-r from-orange-500 to-black text-white text-sm py-2 text-center">
        AI needs context. APIs deliver it.
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="grid grid-cols-[minmax(0,640px)_1fr] items-center h-16">
          <div className="flex items-center gap-3 px-6 lg:pl-24">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm py-2">
              <Zap />
            </div>

            <Link href="/" className="text-xl font-semibold text-black">
              RouteX
            </Link>
          </div>

          <div className="flex justify-end items-center gap-3 px-6 lg:pr-12">
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
              className="px-4 py-2 text-sm border rounded-md bg-gray-100"
            >
              Sign In
            </Button>

            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
              className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
            >
              Sign Up for Free
            </Button>
          </div>
        </div>
      </header>

      <main className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,640px)_1fr] min-h-[calc(100vh-120px)]">
        <div className="px-6 lg:pl-24 lg:pr-12 py-12 max-w-xl">
          <h1 className="text-5xl font-semibold leading-tight mb-6 text-gray-900">
            RouteX Always Sync with Server
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-700 max-w-xl mb-10">
            RouteX lets developers test and debug APIs and uses AI features for
            automated tests, smart request validation, and code suggestions.
          </p>

      
          <div className="mb-8">
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 w-full"
            >
              Sign Up for Free
            </Button>
          </div>

          <div className="flex items-center my-6 text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs font-medium tracking-wide">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-3 ">
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
              variant="outline"
              className="w-full py-5 text-sm flex items-center justify-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
            >
              <FaGoogle className="h-4 w-4" />
              Continue with email
            </Button>

            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/",
                })
              }
              variant="outline"
              className="w-full py-5 text-sm flex items-center justify-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
            >
              <FaGithub className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>

          <p className="mt-8 text-xs text-gray-500 leading-relaxed">
            By signing in, you agree to our{" "}
            <span className="text-[#ff6c37] cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#ff6c37] cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>

        <div className="relative lg:ml-8 lg:mt-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                GET
              </span>

              <input
                className="flex-1 px-3 py-2 text-sm border rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                value="{{base_url}}/accounts/:accountNumber"
                readOnly
              />

              <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Send
              </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-[220px_1fr] min-h-[420px]">
              {/* Sidebar */}
              <aside className="border-r bg-gray-50 p-4 text-sm">
                <p className="font-semibold mb-3">Collections</p>
                <ul className="space-y-2 text-gray-700">
                  <li>Accounts</li>
                  <li>Customers</li>
                  <li>Payments</li>
                  <li className="text-green-600 font-medium">GET Overview</li>
                </ul>
              </aside>

              {/* Editor */}
              <section className="flex flex-col">
                {/* Tabs */}
                <div className="flex gap-6 px-4 py-2 border-b text-sm">
                  <button className="font-medium border-b-2 border-orange-500">
                    Params
                  </button>
                  <button className="text-gray-500">Headers</button>
                  <button className="text-gray-500">Body</button>
                </div>

                {/* Request Editor */}
                <div className="p-4 flex-1">
                  <div className="h-full border rounded-md bg-gray-50 text-sm font-mono text-gray-600 p-4">
                    key: accountNumber <br />
                    value: 123456789
                  </div>
                </div>

                {/* Response */}
                <div className="border-t font-mono text-sm p-4 h-40 overflow-auto">
                  {`{
  "accountNumber": "123456789",
  "balance": 24500,
  "currency": "INR",
  "status": "ACTIVE"
}`}
                </div>
              </section>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-orange-300 to-yellow-200 blur-3xl opacity-40" />
        </div>
      </main>
    </div>
  );
}
