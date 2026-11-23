"use client";
import RealtimeConnectionBar from "@/modules/realtime/components/realtime-connection-bar";
import RealtimeMessageEditor from "@/modules/realtime/components/realtime-message-editor";
import React from "react";

const RealtimePage = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-5 overflow-y-auto bg-background p-5">
      <div className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground">WebSocket</h1>
          <p className="text-sm text-muted-foreground">
            Connect to a server, send messages, and watch the traffic as it
            arrives.
          </p>
        </div>
        <RealtimeConnectionBar />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <RealtimeMessageEditor />
      </div>
    </div>
  );
};

export default RealtimePage;
