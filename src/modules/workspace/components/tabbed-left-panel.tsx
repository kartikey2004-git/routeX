"use client";

import { Hint } from "@/components/ui/hint";
import { Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const TabbedLeftPanel = () => {
  const pathname = usePathname();
  const activeTab = pathname.split("/")[1] || "rest"; // default to "rest" on home

  const sidebarItems = [
    { icon: LinkIcon, label: "rest", link: "/" },
    { icon: Globe, label: "realtime", link: "/realtime" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-12 bg-card border border-border rounded-lg shadow-sm flex flex-col items-center py-4 space-y-4">
        {sidebarItems.map((item, index) => (
          <Hint label={item.label} key={index} side="right">
            <Link
              href={item.link}
              key={index}
              className={`w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer transition-colors ${
                activeTab === item.label
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
            </Link>
          </Hint>
        ))}
      </div>
    </div>
  );
};

export default TabbedLeftPanel;
