"use client";

import GridLayout from "../GridLayout";
import {
  Database,
  Repeat,
  ShieldCheck,
  Users,
  Bot,
  Code2,
  FileJson,
  GitBranch,
  Activity,
  Lock,
  Terminal,
  Server,
  Cloud,
  Cpu,
  Send,
  ChevronRight,
  Linkedin,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/ui/hint";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import Image from "next/image";
import { DashboardShowcaseExample } from "@/components/ui/dashboard-showcase";

// Custom animation classes
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-float-slow {
      animation: float-slow 6s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export default function Page() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDarkTheme = resolvedTheme === "dark";

  const {
    ref: themeSwitchRef,
    toggleSwitchTheme,
    isDarkMode,
  } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    duration: 650,
    blurAmount: 4,
    globalClassName: "dark",
    isDarkMode: isDarkTheme,
    onDarkModeChange: (isDark) => setTheme(isDark ? "dark" : "light"),
  });

  const items = [
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Security",
      description:
        "OAuth authentication with GitHub and Google. Role-based access control and secure workspace management.",
    },
    {
      icon: Users,
      title: "Live Collaboration",
      description:
        "Real-time workspace updates with WebSocket sync. Team members see changes instantly across all API collections.",
    },
    {
      icon: Bot,
      title: "AI-Powered Assistance",
      description:
        "Generate intelligent API request names and JSON bodies using Google AI. Speed up your API development workflow.",
    },
  ];

  const cases = [
    {
      icon: Code2,
      title: "API Development",
      description:
        "Build and test REST APIs during development. Store request history and iterate faster with AI assistance.",
    },
    {
      icon: FileJson,
      title: "API Documentation",
      description:
        "Create organized API collections with proper naming conventions. Generate structured documentation automatically.",
    },
    {
      icon: GitBranch,
      title: "Microservices Testing",
      description:
        "Test communication between services. Validate endpoints and ensure smooth data flow across microservices.",
    },
    {
      icon: Activity,
      title: "Real-time Applications",
      description:
        "Debug WebSocket connections for chat apps, live notifications, and streaming services with real-time monitoring.",
    },
    {
      icon: Database,
      title: "CRUD Operations",
      description:
        "Test database APIs and validate data operations. Ensure proper Create, Read, Update, Delete functionality.",
    },
    {
      icon: Lock,
      title: "Financial APIs",
      description:
        "Securely test payment endpoints and financial services with structured workflows and proper authentication.",
    },
  ];

  const left = [
    {
      icon: Terminal,
      title: "Lightning Fast Testing",
      description:
        "Execute API requests instantly with intelligent caching. No setup required - start testing immediately.",
    },
    {
      icon: Repeat,
      title: "Rapid Iteration",
      description:
        "Modify requests, headers, and JSON bodies in seconds. AI-powered suggestions accelerate development cycles.",
    },
    {
      icon: Server,
      title: "Multi-Workspace Management",
      description:
        "Organize multiple projects with separate workspaces. Scale from personal projects to enterprise teams.",
    },
  ];

  const right = [
    {
      icon: Cloud,
      title: "Smart Collections",
      description:
        "Organize APIs in structured collections with AI-generated names. Auto-categorize requests for better workflow.",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description:
        "OAuth authentication with role-based access control. Secure workspace invites and member management.",
    },
    {
      icon: Cpu,
      title: "AI Workflow Automation",
      description:
        "Generate request names, JSON bodies, and test cases using Google AI. Automate repetitive API tasks.",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust for sticky header if any
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Testimonial data
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Senior Backend Engineer",
      company: "Paytm fintech",
      content:
        "This replaced Postman for our team workflows. The AI request generation saves a ton of time when building payment APIs.",
      avatar: "https://i.pravatar.cc/150?img=12",
      metric: "3x",
    },
    {
      name: "Priya Mehta",
      role: "DevOps Lead",
      company: "Zoho SaaS",
      content:
        "WebSocket testing alone made this worth it. We can finally debug real-time APIs properly. The workspace features are clean.",
      avatar: "https://i.pravatar.cc/150?img=32",
      metric: "40%",
    },
    {
      name: "Ananya Gupta",
      role: "Full Stack Developer",
      company: "Swiggy startup",
      content:
        "The AI suggestions are surprisingly accurate for complex API chains. Saved me hours of manual request building last week.",
      avatar: "https://i.pravatar.cc/150?img=28",
      metric: "60%",
    },
  ];

  const [isSigningIn, setIsSigningIn] = useState(false);
  const testimonialCount = testimonials.length;

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

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialCount]);

  return (
    <>
      <GridLayout>
        <section
          id="hero"
          className="relative flex min-h-screen items-center justify-center px-3 sm:px-4 md:px-6 lg:px-[30px] pt-12 sm:pt-16 md:pt-20 lg:pt-[100px] pb-8 sm:pb-12 md:pb-16 lg:pb-[80px] overflow-hidden"
        >
          <div className="mx-auto max-w-[1160px] w-full">
            {/* Version Tag with Live Indicator */}
            <div className="mb-3 sm:mb-4 md:mb-6 flex justify-center">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-full bg-[rgba(249,117,24,0.1)] px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1">
                <div className="relative w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-[#f97518]">
                  <div className="absolute inset-0 rounded-full bg-[#f97518] animate-pulse-slow" />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-[#f97518]">
                  Live
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm text-[rgba(30,13,1,0.6)]">
                  v2.0
                </span>
              </div>
            </div>

            {/* Hero Headline */}
            <h1 className="mb-3 sm:mb-4 md:mb-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] leading-tight sm:leading-tight md:leading-tight lg:leading-[60px] xl:leading-[64px] tracking-[-0.5px] sm:tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-2.5px] xl:tracking-[-3.5px] font-medium max-w-[95%] sm:max-w-[90%] md:max-w-[630px] mx-auto px-2 sm:px-2 md:px-2">
              Build, test and collaborate on{" "}
              <span className="text-[#f97518]">APIs</span>
            </h1>

            {/* Hero Subtext */}
            <p className="mx-auto mb-4 sm:mb-6 md:mb-8 max-w-[95%] sm:max-w-[90%] md:max-w-[630px] text-center text-xs sm:text-sm md:text-base lg:text-[18px] leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-[28px] text-[rgba(30,13,1,0.6)] px-3 sm:px-3 md:px-2">
              The complete API development platform with REST & WebSocket
              testing, AI-powered assistance, and real-time team collaboration.
            </p>

            {/* Primary CTA Pill Button */}
            <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
              <button
                onClick={signInWithGithub}
                disabled={isSigningIn}
                className="group relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#f97518] px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-[16px] font-semibold text-white opacity-90 transition-all  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[240px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:w-auto"
              >
                {isSigningIn ? (
                  <>
                    <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="text-xs sm:text-sm md:text-sm">
                      Redirecting...
                    </span>
                  </>
                ) : (
                  <>
                    <FaGithub className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    <span className="text-xs sm:text-sm md:text-sm">
                      Continue with GitHub
                    </span>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 overflow-hidden">
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <DashboardShowcaseExample />

        <div
          id="platform-features"
          className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px] py-12 sm:py-16 lg:py-24 mt-48 text-center"
        >
          <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.18em] text-[rgba(30,13,1,0.4)]">
            Platform Features
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
            Built for Modern Development
          </h2>
          <p className="mx-auto mt-4 sm:mt-5 max-w-3xl text-base sm:text-[18px] leading-relaxed sm:leading-[28px] text-[rgba(30,13,1,0.6)] px-2">
            Complete API development platform with AI assistance, real-time
            collaboration, and powerful testing capabilities for modern
            development teams.
          </p>
        </div>

        <section className="">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* LEFT FEATURE */}
              <div className="group p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px]">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-[#1e0d01]">
                    AI Request Generation
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base text-[rgba(30,13,1,0.6)]">
                    Automatically generate meaningful request names and
                    structured JSON bodies using Google AI based on your API
                    requirements.
                  </p>
                </div>
              </div>

              {/* RIGHT FEATURE */}
              <div className="group p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px]">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-[#1e0d01]">
                    Intelligent JSON Builder
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base text-[rgba(30,13,1,0.6)]">
                    Describe your API endpoint and generate structured JSON
                    instantly. Edit, refine, and save requests to your organized
                    collections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group space-y-4 sm:space-y-5 p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px] transition-all duration-300"
                  >
                    <div className="text-[#f97518]">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg sm:text-xl font-medium text-[#1e0d01]">
                      {item.title}
                    </h4>

                    <p className="leading-relaxed text-sm sm:text-base text-[rgba(30,13,1,0.6)]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div
          id="use-cases"
          className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px] py-12 sm:py-16 lg:py-24 text-center"
        >
          <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.18em] text-[rgba(30,13,1,0.4)]">
            Use Cases
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
            Across Development Workflows
          </h2>
          <p className="mx-auto mt-4 sm:mt-5 max-w-3xl text-base sm:text-[18px] leading-relaxed sm:leading-[28px] text-[rgba(30,13,1,0.6)] px-2">
            From backend development to integration testing, RouteX fits
            seamlessly into every stage of the API development lifecycle.
          </p>
        </div>

        <section className="py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cases.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px] transition-all duration-300"
                  >
                    <div className="mb-4 sm:mb-6 text-[#f97518]">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-[#1e0d01]">
                      {item.title}
                    </h4>

                    <p className="leading-relaxed text-sm sm:text-base text-[rgba(30,13,1,0.6)]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div
          id="productivity-benefits"
          className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px] py-12 sm:py-16 lg:py-24 text-center"
        >
          <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.18em] text-[rgba(30,13,1,0.4)]">
            Productivity Benefits
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
            Making Developers 10x Productive
          </h2>
          <p className="mx-auto mt-4 sm:mt-5 max-w-3xl text-base sm:text-[18px] leading-relaxed sm:leading-[28px] text-[rgba(30,13,1,0.6)] px-2">
            Streamline your API development workflow with intelligent features
            designed to eliminate friction and boost team productivity.
          </p>
        </div>

        <section className="py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* LEFT COLUMN */}
              <div className="space-y-6 lg:space-y-10">
                {left.map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={i}
                      className="group p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px] transition-all duration-300"
                    >
                      <div className="mb-3 sm:mb-5 text-[#f97518]">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>

                      <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-[#1e0d01]">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm leading-relaxed text-[rgba(30,13,1,0.6)]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CENTER VISUAL */}
              <div className="relative flex items-center justify-center order-first lg:order-none mb-8 lg:mb-0">
                <div className="w-full p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px]">
                  <div className="rounded-[8px] sm:rounded-[12px] border border-[rgba(30,13,1,0.1)] bg-[#fbfbfc] p-4 sm:p-6 lg:p-8 text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#f97518] mb-3 sm:mb-4">
                      10x
                    </div>
                    <div className="text-base sm:text-lg font-medium text-[#1e0d01]">
                      Productivity Boost
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6 lg:space-y-10">
                {right.map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={i}
                      className="group p-4 sm:p-6 lg:p-8 bg-white/20 backdrop-blur-md border border-[rgba(30,13,1,0.05)] rounded-[16px] sm:rounded-[24px] transition-all duration-300"
                    >
                      <div className="mb-3 sm:mb-5 text-[#f97518]">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>

                      <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-[#1e0d01]">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm leading-relaxed text-[rgba(30,13,1,0.6)]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      </GridLayout>

      <footer className="border-t border-[rgba(30,13,1,0.1)] bg-[#fbfbfc] py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
            {/* BRAND COLUMN */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-1 sm:col-span-2">
              <div className="flex items-center space-x-3">
                <span className="text-lg sm:text-xl font-medium text-[#1e0d01]">
                  RouteX
                </span>
              </div>

              <p className="max-w-xs leading-relaxed text-sm sm:text-base text-[rgba(30,13,1,0.6)]">
                The complete API development platform for modern teams. Build,
                test, and collaborate with confidence.
              </p>

              <button
                onClick={() => scrollToSection("hero")}
                className="group flex items-center justify-between sm:justify-center sm:space-x-2 rounded-full bg-[#f97518] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition-all w-full sm:w-auto"
              >
                <span>Start building</span>
                <Send
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* PRODUCT COLUMN */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#1e0d01]">
                Product
              </h4>

              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:text-[#f97518]"
                    aria-label="Scroll to API Testing features"
                  >
                    <span>API Testing</span>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:text-[#f97518]"
                    aria-label="Scroll to Collaboration features"
                  >
                    <span>Collaboration</span>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:text-[#f97518]"
                    aria-label="Scroll to AI Assistant features"
                  >
                    <span>AI Assistant</span>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* COMPANY COLUMN */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#1e0d01]">
                Company
              </h4>

              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:text-[#f97518]"
                    aria-label="Scroll to About section"
                  >
                    <span>About</span>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("use-cases")}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:text-[#f97518]"
                    aria-label="Scroll to Use Cases section"
                  >
                    <span>Use Cases</span>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* CONNECT COLUMN */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-1 sm:col-span-2">
              <h4 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#1e0d01]">
                Connect
              </h4>

              <div className="flex space-x-2 sm:space-x-3">
                <Hint label="Follow me on X">
                  <a
                    href="https://x.com/Bh20291Kartikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[rgba(30,13,1,0.2)] text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:border-[#f97518] hover:text-[#f97518]"
                    aria-label="Follow me on X"
                  >
                    <FaXTwitter size={14} />
                  </a>
                </Hint>
                <Hint label="Connect on LinkedIn">
                  <a
                    href="https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[rgba(30,13,1,0.2)] text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:border-[#f97518] hover:text-[#f97518]"
                    aria-label="Connect with me on LinkedIn"
                  >
                    <Linkedin size={14} />
                  </a>
                </Hint>
                <Hint label="Follow on Instagram">
                  <a
                    href="https://www.instagram.com/_k4rtik.exe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[rgba(30,13,1,0.2)] text-[rgba(30,13,1,0.6)] transition-colors duration-200 hover:border-[#f97518] hover:text-[#f97518]"
                    aria-label="Follow me on Instagram"
                  >
                    <Instagram size={14} />
                  </a>
                </Hint>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-[rgba(30,13,1,0.6)]">
                Join thousands of developers building better APIs together.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 sm:mb-8 border-t border-[rgba(30,13,1,0.1)]" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs sm:text-sm text-[rgba(30,13,1,0.6)]">
              © 2024 RouteX. All rights reserved.
            </p>

            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-[rgba(30,13,1,0.6)]">
              <button className="transition-colors hover:text-[#f97518]">
                Privacy
              </button>
              <button className="transition-colors hover:text-[#f97518]">
                Terms
              </button>
              <button className="transition-colors hover:text-[#f97518]">
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
