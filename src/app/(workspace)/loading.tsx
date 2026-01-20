import { Loader2 } from "lucide-react";
import React from "react";

const Loadingpage = () => {
  return (
    <Loader2
      size={16}
      className="text-slate-600 bg-slate-50/80 backdrop-blur-sm animate-spin"
    />
  );
};

export default Loadingpage;
