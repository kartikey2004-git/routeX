"use client";
import RealtimeConnectionBar from "@/modules/realtime/components/realtime-connection-bar";
import RealtimeMessageEditor from "@/modules/realtime/components/realtime-message-editor";
import React from "react";

const RealtimePage = () => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-6 py-6 space-y-2">
        <h1 className="text-2xl font-semibold">WebSocket</h1>
        <p className="text-sm text-muted-foreground">
          Connect to a websocket server and start testing!
        </p>
        <RealtimeConnectionBar />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6">
        <RealtimeMessageEditor />
      </div>
    </div>
  );
};

export default RealtimePage;
