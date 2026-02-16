"use client";

import GridLayout from "../GridLayout";
import {
  Database,
  Wallet,
  Rocket,
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
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/ui/hint";
import { authClient } from "@/lib/auth-client";

// Add smooth scrolling
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}

export default function Page() {
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
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GridLayout>
        <section
          id="hero"
          className="relative min-h-[90vh] flex items-center justify-center text-center px-4 sm:px-6"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-500/10 blur-[140px] rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-red-400 mb-6 mt-10 tracking-wide">
              Built for modern API developers and collaborative teams
            </p>

            <h1 className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight">
              Build, test and collaborate on{" "}
              <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                APIs
              </span>
            </h1>

            <p className="mt-8 text-lg text-white/70 max-w-2xl mx-auto">
              The complete API development platform with REST & WebSocket
              testing, AI-powered assistance, and real-time team collaboration.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={signInWithGithub}
                disabled={isSigningIn}
                className={cn(
                  "flex items-center gap-2 px-8 py-6 text-base border rounded-md transition-colors",
                  isSigningIn
                    ? "border-gray-300 bg-gray-100 text-gray-800"
                    : "border-white/20 bg-black text-white hover:border-white/30",
                )}
              >
                {isSigningIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    <span className="text-gray-800">Redirecting...</span>
                  </>
                ) : (
                  <>
                    <FaGithub className="h-4 w-4" />
                    <span className="text-white">Continue with GitHub</span>
                  </>
                )}
              </button>

              <button className="px-8 py-6 text-base bg-white rounded-md text-black border text-md border-white/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 hover:border-white/30">
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
          className="text-center mx-auto px-4 sm:px-6 py-16 md:py-24 max-w-3xl"
        >
          <p className="text-sm text-red-400 mb-6 tracking-[0.2em] uppercase">
            How it works
          </p>
          <h2 className="font-semibold tracking-tight leading-tight text-4xl md:text-6xl">
            Designed for Developers
          </h2>
          <p className="mt-8 text-white/70 leading-relaxed text-lg">
            RouteX empowers developers and teams to build, test, and manage APIs
            with powerful collaboration features and intelligent automation.
          </p>
        </div>

        <section className="border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
            <div className="border-r border-white/10">
              {features.map((feature, index) => {
                const isActive = active === index;

                return (
                  <button
                    key={index}
                    onClick={() => setActive(index)}
                    className={cn(
                      "w-full text-left p-10 border-b border-white/10 transition-all duration-200",
                      "hover:bg-white/[0.02] hover:-translate-y-1",
                    )}
                  >
                    {/* Top red indicator */}
                    <div
                      className={cn(
                        "h-[2px] w-full mb-6 transition-all duration-300",
                        isActive ? "bg-red-500" : "bg-transparent",
                      )}
                    />

                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-white/60 leading-relaxed max-w-md">
                      {feature.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* RIGHT PANEL */}
            <div className="relative bg-black">
              {/* Subtle dotted background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />

              <div className="relative h-full flex items-center justify-center">
                <div className="w-[420px] h-[260px] rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center text-white/60 transition-all duration-300">
                  Preview for: {features[active].title}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline SectionIntro - Features */}
        <div
          id="platform-features"
          className="text-center mx-auto px-4 sm:px-6 py-24 md:py-32 max-w-4xl"
        >
          <p className="text-sm text-red-400 mb-6 tracking-[0.2em] uppercase">
            Platform Features
          </p>
          <h2 className="font-semibold tracking-tight leading-tight text-5xl md:text-7xl">
            Built for Modern Development
          </h2>
          <p className="mt-8 text-white/70 leading-relaxed text-xl max-w-3xl mx-auto">
            Complete API development platform with AI assistance, real-time
            collaboration, and powerful testing capabilities for modern
            development teams.
          </p>
        </div>

        <section className="border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT FEATURE */}
            <div className="p-12 border-r border-white/10">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  AI Request Generation
                </h3>
                <p className="text-white/60 max-w-lg leading-relaxed">
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
                <p className="text-white/60 max-w-lg leading-relaxed">
                  Describe your API endpoint and generate structured JSON
                  instantly. Edit, refine, and save requests to your organized
                  collections.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 px-6 sm:px-8 md:px-12">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="space-y-5">
                  <div className="text-white/70">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  <h4 className="text-xl font-semibold">{item.title}</h4>

                  <p className="text-white/60 leading-relaxed max-w-sm">
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
          className="text-center mx-auto px-4 sm:px-6 py-24 md:py-32 max-w-4xl"
        >
          <p className="text-sm text-red-400 mb-6 tracking-[0.2em] uppercase">
            Use Cases
          </p>
          <h2 className="font-semibold tracking-tight leading-tight text-5xl md:text-7xl">
            Across Development Workflows
          </h2>
          <p className="mt-8 text-white/70 leading-relaxed text-xl max-w-3xl mx-auto">
            From backend development to integration testing, RouteX fits
            seamlessly into every stage of the API development lifecycle.
          </p>
        </div>

        <section className="border-t border-white/10 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-6 sm:px-8 md:px-12">
            {cases.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                rounded-2xl
                bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                border border-white/10
                p-8
                transition-all duration-200
                hover:border-white/20
                hover:-translate-y-1
                hover:shadow-lg
              "
                >
                  <div className="mb-6 text-red-400">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>

                  <h4 className="text-xl font-semibold mb-4">{item.title}</h4>

                  <p className="text-white/60 leading-relaxed">
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
          className="text-center mx-auto px-4 sm:px-6 py-24 md:py-32 max-w-4xl"
        >
          <p className="text-sm text-red-400 mb-6 tracking-[0.2em] uppercase">
            Productivity Benefits
          </p>
          <h2 className="font-semibold tracking-tight leading-tight text-5xl md:text-7xl">
            Making Developers 10x Productive
          </h2>
          <p className="mt-8 text-white/70 leading-relaxed text-xl max-w-3xl mx-auto">
            Streamline your API development workflow with intelligent features
            designed to eliminate friction and boost team productivity.
          </p>
        </div>

        <section className="border-t border-white/10 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6 sm:px-8 md:px-12">
            {/* LEFT COLUMN */}
            <div className="space-y-10">
              {left.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                  rounded-2xl
                  bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                  border border-white/10
                  p-8
                  transition
                  hover:translate-y-[-4px]
                  hover:border-white/20
                "
                  >
                    <div className="text-red-400 mb-5">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg font-semibold mb-3">{item.title}</h4>

                    <p className="text-white/60 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CENTER VISUAL */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex items-center justify-center">
              {/* dotted grid */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:18px_18px]" />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {right.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                  rounded-2xl
                  bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                  border border-white/10
                  p-8
                  transition
                  hover:translate-y-[-4px]
                  hover:border-white/20
                "
                  >
                    <div className="text-red-400 mb-5">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg font-semibold mb-3">{item.title}</h4>

                    <p className="text-white/60 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonial Section */}
        <section className="border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10">
            {/* LEFT AVATAR */}
            <div className="border-r border-white/10 p-12 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.01]">
              <div className="relative">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover transition-all duration-500 ease-in-out"
                  onError={(e) => {
                    // Fallback to initials avatar if image fails
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${testimonials[currentTestimonial].name}`;
                  }}
                />
              </div>
            </div>

            {/* CENTER QUOTE */}
            <div className="p-12 border-r border-white/10 flex flex-col justify-center transition-all duration-500 ease-in-out">
              <div className="text-white/90 leading-relaxed text-lg mb-8 transition-opacity duration-500">
                "{testimonials[currentTestimonial].content}"
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-white/60 text-sm">
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-red-500 w-6"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT METRIC */}
            <div className="p-12 flex flex-col justify-center items-end bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="text-right">
                <div className="text-6xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent transition-all duration-500">
                  {testimonials[currentTestimonial].metric}
                </div>
                <p className="text-white/60 text-sm uppercase tracking-wider">
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
      <footer className="border-t border-white/10 bg-gradient-to-b from-black to-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* BRAND COLUMN */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-semibold text-white">RouteX</span>
              </div>

              <p className="text-white/60 leading-relaxed max-w-xs">
                The complete API development platform for modern teams. Build,
                test, and collaborate with confidence.
              </p>

              <button
                onClick={() => scrollToSection("hero")}
                className="group px-6 py-3 bg-white text-black rounded-md text-sm font-medium hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-white/20 flex items-center space-x-2"
              >
                <span>Start building</span>
                <Send
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>

            {/* PRODUCT COLUMN */}
            <div className="space-y-6">
              <h4 className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Product
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("platform-features")}
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
              <h4 className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Company
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
                    className="group text-white/60 hover:text-white transition-all duration-200 flex items-center space-x-2 hover:translate-x-1"
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
              <h4 className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Connect with me
              </h4>

              <div className="flex space-x-3">
                <Hint label="Follow me on X">
                  <a
                    href="https://x.com/Bh20291Kartikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:scale-[1.05]"
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
                    className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:scale-[1.05]"
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
                    className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/60 transition-all duration-200 hover:scale-[1.05]"
                    aria-label="Follow me on Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                </Hint>
              </div>

              <p className="text-white/40 text-sm leading-relaxed">
                Join thousands of developers building better APIs together.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/40 text-sm">
              © 2024 RouteX. All rights reserved.
            </p>

            <div className="flex items-center space-x-6 text-white/40 text-sm">
              <button className="hover:text-white/60 transition-colors">
                Privacy
              </button>
              <button className="hover:text-white/60 transition-colors">
                Terms
              </button>
              <button className="hover:text-white/60 transition-colors">
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
