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
  Moon,
  Sun,
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

// Add smooth scrolling
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
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

  const features = [
    {
      title: "Smart API Testing",
      description:
        "Execute REST APIs with AI-powered suggestions for request names and JSON bodies. Test GET, POST, PUT, DELETE, PATCH with intelligent assistance.",
    },
    {
      title: "Collaborative Workspaces",
      description:
        "Create shared workspaces for your team. Organize API collections, invite members via secure links, and manage permissions with role-based access.",
    },
    {
      title: "Real-time API Testing",
      description:
        "Test WebSocket connections and real-time APIs. Monitor live data streams, debug socket communications, and validate real-time endpoints.",
    },
  ];

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

  const [active, setActive] = useState(0);
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
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <button
          ref={themeSwitchRef as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={toggleSwitchTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
          aria-label="Toggle theme"
        >
          {!isMounted ? (
            <Sun className="h-4 w-4" />
          ) : isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
      <GridLayout>
        <section
          id="hero"
          className="relative flex min-h-[78dvh] items-center justify-center px-4 text-center sm:px-6"
        >
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 mt-8 text-sm tracking-wide text-muted-foreground">
              Built for modern API developers and collaborative teams
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build, test and collaborate on{" "}
              <span className="text-foreground">APIs</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The complete API development platform with REST & WebSocket
              testing, AI-powered assistance, and real-time team collaboration.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={signInWithGithub}
                disabled={isSigningIn}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-6 py-4 text-sm transition-colors sm:px-8 sm:text-base",
                  isSigningIn
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {isSigningIn ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
                    <span className="text-muted-foreground">
                      Redirecting...
                    </span>
                  </>
                ) : (
                  <>
                    <FaGithub className="h-4 w-4" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>

              <button className="rounded-md border border-border bg-primary px-6 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90 sm:px-8 sm:text-base">
                Built by{" "}
                <a
                  href="https://kartikcodes.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("https://kartikcodes.vercel.app/", "_blank");
                  }}
                >
                  kartikey
                </a>
              </button>
            </div>
          </div>
        </section>

        <div
          id="how-it-works"
          className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 md:py-20"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            How it works
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Designed for Developers
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            RouteX empowers developers and teams to build, test, and manage APIs
            with powerful collaboration features and intelligent automation.
          </p>
        </div>

        <section className="border-t border-border">
          <div className="grid min-h-152 grid-cols-1 md:grid-cols-2">
            <div className="border-r border-border">
              {features.map((feature, index) => {
                const isActive = active === index;

                return (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    className={cn(
                      "w-full border-b border-border p-8 text-left transition-colors sm:p-10",
                      "hover:bg-muted/40",
                    )}
                  >
                    {/* Top indicator */}
                    <div
                      className={cn(
                        "h-0.5 w-full mb-6 transition-all duration-300",
                        isActive ? "bg-foreground" : "bg-transparent",
                      )}
                    />

                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>

                    <p className="max-w-md leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* RIGHT PANEL */}
            <div className="relative bg-muted/20">
              <div className="relative h-full flex items-center justify-center">
                <div className="flex h-64 w-[92%] max-w-3xl items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm">
                  Preview for: {features[active].title}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline SectionIntro - Features */}
        <div
          id="platform-features"
          className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Platform Features
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Built for Modern Development
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Complete API development platform with AI assistance, real-time
            collaboration, and powerful testing capabilities for modern
            development teams.
          </p>
        </div>

        <section className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT FEATURE */}
            <div className="p-12 border-r border-border">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  AI Request Generation
                </h3>
                <p className="max-w-lg leading-relaxed text-muted-foreground">
                  Automatically generate meaningful request names and structured
                  JSON bodies using Google AI based on your API requirements.
                </p>
              </div>
            </div>

            {/* RIGHT FEATURE */}
            <div className="p-12">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Intelligent JSON Builder
                </h3>
                <p className="max-w-lg leading-relaxed text-muted-foreground">
                  Describe your API endpoint and generate structured JSON
                  instantly. Edit, refine, and save requests to your organized
                  collections.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-20 md:py-24">
          <div className="grid grid-cols-1 gap-8 px-6 sm:px-8 md:grid-cols-3 md:gap-12 md:px-12">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="space-y-5">
                  <div className="text-muted-foreground">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  <h4 className="text-xl font-semibold">{item.title}</h4>

                  <p className="max-w-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inline SectionIntro - Use Cases */}
        <div
          id="use-cases"
          className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Use Cases
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Across Development Workflows
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            From backend development to integration testing, RouteX fits
            seamlessly into every stage of the API development lifecycle.
          </p>
        </div>

        <section className="border-t border-border py-20 md:py-24">
          <div className="grid grid-cols-1 gap-6 px-6 sm:px-8 md:grid-cols-3 md:gap-8 md:px-12">
            {cases.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                rounded-lg
                bg-card
                border border-border
                p-8
                transition-colors duration-200
                hover:border-foreground/20
                hover:bg-muted/30
              "
                >
                  <div className="mb-6 text-foreground">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>

                  <h4 className="text-xl font-semibold mb-4">{item.title}</h4>

                  <p className="leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inline SectionIntro - Benefits */}
        <div
          id="productivity-benefits"
          className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Productivity Benefits
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Making Developers 10x Productive
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Streamline your API development workflow with intelligent features
            designed to eliminate friction and boost team productivity.
          </p>
        </div>

        <section className="border-t border-border py-20 md:py-24">
          <div className="grid grid-cols-1 gap-8 px-6 sm:px-8 md:grid-cols-3 md:gap-10 md:px-12">
            {/* LEFT COLUMN */}
            <div className="space-y-10">
              {left.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                  rounded-lg
                  bg-card
                  border border-border
                  p-8
                  transition-colors
                  hover:border-foreground/20
                  hover:bg-muted/30
                "
                  >
                    <div className="mb-5 text-foreground">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg font-semibold mb-3">{item.title}</h4>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CENTER VISUAL */}
            <div className="relative flex items-center justify-center rounded-lg border border-border bg-card p-8 shadow-sm"></div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {right.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                  rounded-lg
                  bg-card
                  border border-border
                  p-8
                  transition-colors
                  hover:border-foreground/20
                  hover:bg-muted/30
                "
                  >
                    <div className="mb-5 text-foreground">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg font-semibold mb-3">{item.title}</h4>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonial Section */}
        <section className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
            {/* LEFT AVATAR */}
            <div className="flex items-center justify-center border-r border-border bg-muted/20 p-10 md:p-12">
              <div className="relative">
                <Image
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  height={60}
                  width={60}
                  className="h-24 w-24 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to initials avatar if image fails
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${testimonials[currentTestimonial].name}`;
                  }}
                />
              </div>
            </div>

            {/* CENTER QUOTE */}
            <div className="flex flex-col justify-center border-r border-border p-10 md:p-12">
              <div className="mb-8 text-base leading-relaxed text-foreground sm:text-lg">
                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[currentTestimonial].role} at{" "}
                  {testimonials[currentTestimonial].company}
                </p>
              </div>

              {/* Testimonial dots */}
              <div className="flex gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "w-6 bg-foreground"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT METRIC */}
            <div className="flex flex-col items-end justify-center bg-muted/20 p-10 md:p-12">
              <div className="text-right">
                <div className="mb-2 text-5xl font-bold text-foreground md:text-6xl">
                  {testimonials[currentTestimonial].metric}
                </div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                  {currentTestimonial === 0
                    ? "API Efficiency"
                    : currentTestimonial === 1
                      ? "Time Saved"
                      : currentTestimonial === 2
                        ? "Team Adoption"
                        : "Manual Work Reduced"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </GridLayout>

      {/* Premium Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-14">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* BRAND COLUMN */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-semibold text-foreground">
                  RouteX
                </span>
              </div>

              <p className="max-w-xs leading-relaxed text-muted-foreground">
                The complete API development platform for modern teams. Build,
                test, and collaborate with confidence.
              </p>

              <button
                onClick={() => scrollToSection("hero")}
                className="group flex items-center space-x-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>Start building</span>
                <Send
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* PRODUCT COLUMN */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Product
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to API Testing features"
                  >
                    <span>API Testing</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to Collaboration features"
                  >
                    <span>Collaboration</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to AI Assistant features"
                  >
                    <span>AI Assistant</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to WebSocket Testing features"
                  >
                    <span>WebSocket Testing</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* COMPANY COLUMN */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Company
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to About section"
                  >
                    <span>About</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("use-cases")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to Use Cases section"
                  >
                    <span>Use Cases</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("productivity-benefits")}
                    className="group flex items-center space-x-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label="Scroll to Pricing section"
                  >
                    <span>Pricing</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* CONNECT COLUMN */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Connect with me
              </h4>

              <div className="flex space-x-3">
                <Hint label="Follow me on X">
                  <a
                    href="https://x.com/Bh20291Kartikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    aria-label="Follow me on X"
                  >
                    <FaXTwitter size={18} />
                  </a>
                </Hint>
                <Hint label="Connect on LinkedIn">
                  <a
                    href="https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    aria-label="Connect with me on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </Hint>
                <Hint label="Follow on Instagram">
                  <a
                    href="https://www.instagram.com/_k4rtik.exe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    aria-label="Follow me on Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                </Hint>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Join thousands of developers building better APIs together.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-8 border-t border-border" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 RouteX. All rights reserved.
            </p>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <button className="transition-colors hover:text-foreground">
                Privacy
              </button>
              <button className="transition-colors hover:text-foreground">
                Terms
              </button>
              <button className="transition-colors hover:text-foreground">
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
