"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Zap, ShieldCheck, Rocket, Code2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function signInWithGithub() {
    try {
      setIsSigningIn(true);

      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("GitHub sign in failed:", error);
      setIsSigningIn(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fff7ef] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="h-16 flex items-center px-6 lg:px-24">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
              <Zap size={16} />
            </div>
            <Link href="/" className="text-xl font-semibold text-black">
              RouteX
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            RouteX Always Sync with Server
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            RouteX lets developers test and debug APIs using AI-powered request
            validation, automated testing and smart developer workflows.
          </p>

          <Button
            onClick={signInWithGithub}
            disabled={isSigningIn}
            variant="outline"
            className="px-8 py-5 text-sm flex items-center justify-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 mx-auto disabled:opacity-70"
          >
            {isSigningIn ? (
              <>
                <span className="h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <FaGithub className="h-4 w-4" />
                Continue with GitHub
              </>
            )}
          </Button>

          <p className="mt-6 text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <span className="text-[#ff6c37] cursor-pointer hover:underline">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-[#ff6c37] cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </section>

      {/* DEMO DASHBOARD PREVIEW */}
      <section className="pb-24 px-6">
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Top Bar */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3 border-b bg-gray-50">
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                GET
              </span>

              <input
                className="flex-1 w-full px-3 py-2 text-sm border rounded-md font-mono"
                value="{{base_url}}/accounts/:accountNumber"
                readOnly
              />

              <button className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Send
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] min-h-[460px]">
              {/* Sidebar */}
              <aside className="hidden lg:block border-r bg-gray-50 p-4 text-sm">
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
                <div className="flex gap-6 px-4 py-2 border-b text-sm">
                  <button className="font-medium border-b-2 border-orange-500">
                    Params
                  </button>
                  <button className="text-gray-500">Headers</button>
                  <button className="text-gray-500">Body</button>
                </div>

                <div className="p-4 flex-1">
                  <div className="h-full border rounded-md bg-gray-50 text-sm font-mono text-gray-600 p-4">
                    key: accountNumber <br />
                    value: 123456789
                  </div>
                </div>

                <div className="border-t font-mono text-sm p-4 h-36 overflow-auto">
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
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-semibold mb-3">
            Built for Modern API Development
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            RouteX is an AI-assisted platform for designing, testing and
            inspecting APIs with real-time collaboration and a clean
            developer-first experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Code2 />}
            title="REST Request Inspector"
            desc="Send and inspect REST APIs with full control over params, headers, and JSON request bodies."
          />

          <FeatureCard
            icon={<Rocket />}
            title="WebSocket Testing"
            desc="Built-in WebSocket client to send messages, track real-time events, and debug live connections."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Real-Time Collaboration"
            desc="Work together in shared workspaces with teammates and sync API changes instantly."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-[#fff7ef]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible>
            <AccordionItem value="1">
              <AccordionTrigger>Is RouteX free?</AccordionTrigger>
              <AccordionContent>
                Yes. RouteX provides a free tier with essential API testing
                features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="2">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                All requests are encrypted and OAuth authentication is used.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3">
              <AccordionTrigger>Team support?</AccordionTrigger>
              <AccordionContent>
                Team collaboration features are coming soon.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <Zap size={14} />
            </div>
            <span className="font-semibold">RouteX</span>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RouteX. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-gray-600">
            <span className="cursor-pointer hover:text-black">Privacy</span>
            <span className="cursor-pointer hover:text-black">Terms</span>
            <span className="cursor-pointer hover:text-black">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition">
      <CardContent className="p-6 space-y-3">
        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </CardContent>
    </Card>
  );
}
