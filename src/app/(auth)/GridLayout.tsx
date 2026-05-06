"use client";

import React from "react";

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = React.Children.toArray(children);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#ffffff] text-[#1e0d01]">
      {/* Grid Background Layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mx-auto max-w-[1280px] h-full relative">
          {/* Vertical Lines - Responsive */}
          <div className="absolute inset-0 flex">
            <div className="border-l border-dashed border-[rgba(30,13,1,0.1)] w-0 h-full" />
            <div className="border-l border-dashed border-[rgba(30,13,1,0.1)] w-0 h-full hidden sm:block ml-[200px]" />
            <div className="border-l border-dashed border-[rgba(30,13,1,0.1)] w-0 h-full hidden md:block ml-[400px]" />
            <div className="border-l border-dashed border-[rgba(30,13,1,0.1)] w-0 h-full hidden lg:block ml-[600px]" />
            <div className="border-l border-dashed border-[rgba(30,13,1,0.1)] w-0 h-full hidden xl:block ml-[800px]" />
          </div>

          {/* Horizontal Lines - Responsive */}
          <div className="absolute inset-0">
            <div className="h-0 w-full bg-gradient-to-r from-transparent via-[rgba(30,13,1,0.1)] to-transparent mt-[100px]" />
            <div className="h-0 w-full bg-gradient-to-r from-transparent via-[rgba(30,13,1,0.1)] to-transparent mt-[400px] hidden sm:block" />
            <div className="h-0 w-full bg-gradient-to-r from-transparent via-[rgba(30,13,1,0.1)] to-transparent mt-[700px] hidden md:block" />
          </div>

          {/* Intersection Dots - Responsive */}
          <div className="absolute inset-0">
            {/* First row - always visible */}
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full"
              style={{ left: "0px", top: "100px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden sm:block"
              style={{ left: "200px", top: "100px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden md:block"
              style={{ left: "400px", top: "100px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden lg:block"
              style={{ left: "600px", top: "100px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden xl:block"
              style={{ left: "800px", top: "100px" }}
            />

            {/* Second row - hidden on small screens */}
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden sm:block"
              style={{ left: "0px", top: "400px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden md:block"
              style={{ left: "200px", top: "400px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden lg:block"
              style={{ left: "400px", top: "400px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden xl:block"
              style={{ left: "600px", top: "400px" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(30,13,1,0.2)] rounded-full hidden xl:block"
              style={{ left: "800px", top: "400px" }}
            />

            {/* Glow Dot at Key Intersection - responsive positioning */}
            <div
              className="absolute w-1.5 h-1.5 bg-[rgba(249,117,24,0.2)] blur-[2px] rounded-full hidden md:block"
              style={{ left: "400px", top: "400px" }}
            />
          </div>

          {/* Ambient Glow - Responsive */}
          <div className="absolute top-[200px] left-[200px] w-[600px] h-[600px] bg-[rgba(249,117,24,0.05)] blur-[120px] rounded-full hidden md:block" />
          {/* Mobile glow */}
          <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-[rgba(249,117,24,0.03)] blur-[80px] rounded-full md:hidden" />
        </div>
      </div>

      <div className="relative grid w-full grid-cols-[minmax(0.5rem,1fr)_minmax(0,80rem)_minmax(0.5rem,1fr)] sm:grid-cols-[minmax(1rem,1fr)_minmax(0,80rem)_minmax(1rem,1fr)]">
        <div />

        <div className="w-full">
          {sections.map((child, index) => {
            const childWithIndex = React.isValidElement(child)
              ? React.cloneElement(
                  child as React.ReactElement<{ index?: number }>,
                  {
                    index: index + 1,
                  },
                )
              : child;

            return <div key={index}>{childWithIndex}</div>;
          })}
        </div>

        {/* RIGHT RAIL */}
        <div />
      </div>
    </div>
  );
}
