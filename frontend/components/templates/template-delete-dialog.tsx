"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TemplateDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  templateName?: string;
  isDeleting?: boolean;
}

export const TemplateDeleteDialog: FC<TemplateDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-medium text-foreground tracking-tight">
            Delete template
          </DialogTitle>
          <DialogDescription className="text-[12.5px] font-normal text-muted-foreground pt-1.5 leading-relaxed">
            Delete {templateName ? <strong className="font-medium text-foreground">"{templateName}"</strong> : "this template"}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="text-[12.5px] font-normal text-muted-foreground hover:text-foreground rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
            className="text-[12.5px] font-medium rounded-xl"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
