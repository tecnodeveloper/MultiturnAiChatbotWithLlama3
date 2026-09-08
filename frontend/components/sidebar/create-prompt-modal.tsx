"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, content: string) => void;
}

export const CreatePromptModal: FC<CreatePromptModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!name || !content) return;
    onSave(name, content);
    setName("");
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-base font-medium text-foreground">Create new prompt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-normal text-muted-foreground">Name</Label>
            <Input
              id="name"
              placeholder="Prompt name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs font-normal text-muted-foreground">Content</Label>
            <Textarea
              id="content"
              placeholder="Prompt content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="text-xs bg-background border-border text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-xs font-normal">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name || !content}
            className="text-xs font-medium bg-[#f5a623] hover:bg-[#e09612] text-[#0f1117] transition-colors"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
