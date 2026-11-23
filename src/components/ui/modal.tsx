"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  showFooter?: boolean;
  submitVariant?: "default" | "destructive";
  size?: string;
  className?: string;
}

/*
  One dialog pattern for the whole app: title and a single sentence of
  context, a body, and a footer where the primary action sits on the right.
  Enter submits from any single-line field, so keyboard users never have to
  reach for the mouse.
*/
const Modal: React.FC<ModalProps> = ({
  children,
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  showFooter = true,
  submitVariant = "default",
  size,
  className,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isSingleLineField =
      target instanceof HTMLInputElement && target.type !== "checkbox";
    if (event.key === "Enter" && isSingleLineField && onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn("gap-0 p-0 sm:max-w-md", size, className)}
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-5 py-5">{children}</div>

        {showFooter && (
          <DialogFooter className="border-t border-border bg-surface px-5 py-3 sm:justify-end">
            <Button variant="ghost" onClick={onClose}>
              {cancelText}
            </Button>
            {onSubmit && (
              <Button variant={submitVariant} onClick={onSubmit}>
                {submitText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
