import * as React from "react";

import { cn } from "@/lib/utils";

/* Flat field with a hairline border; focus is shown with the orange ring. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-surface-raised px-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors outline-none selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring",
        "aria-invalid:border-destructive aria-invalid:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
