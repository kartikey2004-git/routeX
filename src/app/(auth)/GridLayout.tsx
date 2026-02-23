"use client";

import React from "react";

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = React.Children.toArray(children);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-background text-foreground">
      <div className="relative grid w-full grid-cols-[minmax(1rem,1fr)_minmax(0,80rem)_minmax(1rem,1fr)]">
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
