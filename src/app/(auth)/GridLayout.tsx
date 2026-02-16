"use client";

import React from "react";

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = React.Children.toArray(children);

  return (
    <div className="relative bg-black text-white min-h-screen w-full overflow-hidden">
      <div className="relative grid grid-cols-[1fr_minmax(0,1200px)_1fr] w-full">
        <div className="border-r border-white/10" />

        <div className="border-r border-white/10">
          {sections.map((child, index) => {
            const childWithIndex = React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<any>, {
                  index: index + 1,
                })
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
