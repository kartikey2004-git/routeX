import { Loader2 } from "lucide-react";
import React from "react";

const Loadingpage = () => {
  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default Loadingpage;
