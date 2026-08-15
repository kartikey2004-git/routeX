"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DashboardMockup {
  id: string;
  src: string;
  alt: string;
}

interface DashboardFeatureCard {
  title: string;
  description: string;
  mockupIndex: number;
}

interface DashboardCenterCard {
  title: string;
  description: string;
}

interface DashboardShowcaseProps {
  id?: string;
  mockups: DashboardMockup[];
  badge?: string;
  heading?: string;
  description?: string;
  centerCard?: DashboardCenterCard;
  cards?: DashboardFeatureCard[];
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}



export function DashboardShowcase({
  id,
  mockups,
  badge,
  heading,
  description,
  centerCard,
  cards,
  primaryCTA,
  secondaryCTA,
  className,
}: DashboardShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden py-12 sm:py-16 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-[30px]">
        <div className="flex flex-col items-center gap-10 lg:gap-16">
          {/* Top Content */}
          <div className="w-full max-w-2xl space-y-6 text-center">
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex justify-center"
              >
                <span className="px-4 py-1 rounded-full bg-[rgba(249,117,24,0.1)] text-[#f97518] text-sm font-medium">
                  {badge}
                </span>
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-[#1e0d01]"
            >
              {heading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-[18px] leading-relaxed text-[rgba(30,13,1,0.6)]"
            >
              {description}
            </motion.p>

            {centerCard && (
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mx-auto max-w-sm rounded-[16px] border border-[rgba(30,13,1,0.1)] bg-white/20 p-4 sm:p-5 text-center"
                >
                  <h3 className="text-base sm:text-lg font-medium mb-1.5 text-[#1e0d01]">
                    {centerCard.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[rgba(30,13,1,0.6)]">
                    {centerCard.description}
                  </p>
                </motion.div>

                {cards && cards.length > 0 && (
                  <>
                    {/* Stem connecting card to branch */}
                    <div className="h-4 sm:h-6 w-0.5 bg-[rgba(30,13,1,0.25)]" />

                    <div className="relative w-full max-w-xs sm:max-w-sm h-8 sm:h-10">
                      {/* Left branch */}
                      <div className="absolute left-1/4 right-1/2 top-0 h-full rounded-tl-2xl border-l-2 border-t-2 border-[rgba(30,13,1,0.25)]" />
                      {/* Right branch */}
                      <div className="absolute left-1/2 right-1/4 top-0 h-full rounded-tr-2xl border-r-2 border-t-2 border-[rgba(30,13,1,0.25)]" />
                      {/* Left arrowhead */}
                      <div className="absolute left-1/4 bottom-[-6px] h-0 w-0 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[7px] border-t-[rgba(30,13,1,0.35)]" />
                      {/* Right arrowhead */}
                      <div className="absolute left-3/4 bottom-[-6px] h-0 w-0 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[7px] border-t-[rgba(30,13,1,0.35)]" />
                    </div>
                  </>
                )}
              </div>
            )}

            {cards && cards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
              >
                {cards.map((card, index) => {
              
                  const mockup = mockups[card.mockupIndex];
                  const isFirst = index === 0;

                  return (
                    <HoverCard
                      key={card.title}
                      openDelay={100}
                      closeDelay={100}
                    >
                      <HoverCardTrigger asChild>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(card.mockupIndex)}
                          onFocus={() => setActiveIndex(card.mockupIndex)}
                          className={cn(
                            "rounded-[16px] border p-4 sm:p-5 text-left transition-all duration-300 border border-[rgba(30,13,1,0.1)]"
                          )}
                        >
                          <div
                            className={cn(
                              "h-0.5 w-8 mb-3 rounded-full transition-all duration-300",
                            )}
                          />
                          <h3 className="text-base sm:text-lg font-medium mb-1.5 text-[#1e0d01]">
                            {card.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[rgba(30,13,1,0.6)]">
                            {card.description}
                          </p>
                        </button>
                      </HoverCardTrigger>
                      {mockup && (
                        <HoverCardContent
                          className="w-[720px] max-w-[92vw] p-2 border-0 shadow-none bg-white text-black"
                          side="bottom"
                          align={isFirst ? "start" : "end"}
                          alignOffset={isFirst ? -390 : -390}
                          sideOffset={-50}
                          avoidCollisions={false}
                        >
                          <div className="relative h-[480px] w-full overflow-hidden rounded-lg bg-white">
                            <Image
                              src={mockup.src}
                              alt={mockup.alt}
                              fill
                              sizes="720px"
                              className="object-contain"
                            />
                          </div>
                        </HoverCardContent>
                      )}
                    </HoverCard>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {primaryCTA && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={primaryCTA.onClick}
                  className="px-6 py-3 bg-[#f97518] text-white font-semibold rounded-full transition-all duration-200"
                >
                  {primaryCTA.text}
                </motion.button>
              )}

              {secondaryCTA && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={secondaryCTA.onClick}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md text-[#1e0d01] font-semibold rounded-full border border-[rgba(30,13,1,0.1)] hover:border-[#f97518] transition-all duration-200"
                >
                  {secondaryCTA.text}
                </motion.button>
              )}
            </motion.div>
          </div>


        </div>
      </div>
    </section>
  );
}

// Example usage component
export function DashboardShowcaseExample() {
  const mockups: DashboardMockup[] = [
    {
      id: "mockup-1",
      src: "/mockup-1.png",
      alt: "REST API Testing View",
    },
    {
      id: "mockup-2",
      src: "/mockup-2.png",
      alt: "Realtime Testing View",
    },
  ];

  const centerCard = {
    title: "Collaborative Workspaces",
    description:
      "Create shared workspaces for your team. Organize API collections, invite members via secure links, and manage permissions with role-based access.",
  };

  const cards = [
    {
      title: "Smart API Testing",
      description:
        "Execute REST APIs with AI-powered suggestions for request names and JSON bodies. Test GET, POST, PUT, DELETE, PATCH with intelligent assistance.",
      mockupIndex: 0,
    },
    {
      title: "Real-time API Testing",
      description:
        "Test WebSocket connections and real-time APIs. Monitor live data streams, debug socket communications, and validate real-time endpoints.",
      mockupIndex: 1,
    },
  ];

  return (
    <DashboardShowcase
      id="how-it-works"
      mockups={mockups}
      centerCard={centerCard}
      cards={cards}
      badge="How it works"
      heading="Designed for Developers"
      description="RouteX empowers developers and teams to build, test, and manage APIs with powerful collaboration features and intelligent automation."
    />
  );
}
