import { Archive, Upload } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const EmptyCollections = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <>
        <div className="mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-muted/40">
            <Archive className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h3 className="mb-2 text-sm text-foreground">Collections are empty</h3>
        <p className="mb-8 text-center text-xs text-muted-foreground">
          Import or create a collection
        </p>
        <div className="w-full max-w-xs">
          <Button className="w-full">
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </div>
      </>
    </div>
  );
};

export default EmptyCollections;
