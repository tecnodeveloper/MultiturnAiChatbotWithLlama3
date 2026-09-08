"use client";

import { FC } from "react";
import { Template } from "@/lib/template-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Copy, Edit2, Trash2, Star, CheckCircle2, Clock, Bot, Tag, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onUse: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onToggleFavorite: (id: string) => void;
}

export const TemplateDetailModal: FC<TemplateDetailModalProps> = ({
  isOpen,
  onClose,
  template,
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
}) => {
  if (!template) return null;

  const handleCopySystemPrompt = () => {
    navigator.clipboard.writeText(template.systemPrompt);
    toast.success("System instructions copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5a623]/10 text-[#f5a623] shrink-0">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[17px] font-medium text-foreground tracking-tight">
                  {template.name}
                </DialogTitle>
                {template.isSystemTemplate && (
                  <span className="text-[11px] font-medium text-[#b8740c] dark:text-[#f5a623] bg-[#f5a623]/10 px-2 py-0.5 rounded-full">
                    System
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11.5px] font-normal text-muted-foreground">
                <span>{template.category}</span>
                <span>·</span>
                <span>Used {template.usageCount || 0} times</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleFavorite(template.id)}
            aria-label={template.isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors mr-6"
          >
            <Star
              className={`h-4.5 w-4.5 transition-colors ${
                template.isFavorite
                  ? "fill-[#f5a623] text-[#f5a623]"
                  : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Description */}
          <div>
            <span className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </span>
            <p className="mt-1 text-[13px] font-normal text-foreground leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* Model & Provider */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/20 border border-border">
            <div>
              <span className="text-[11px] font-normal text-muted-foreground">Provider</span>
              <p className="text-[12.5px] font-medium text-foreground mt-0.5">{template.provider}</p>
            </div>
            <div>
              <span className="text-[11px] font-normal text-muted-foreground">Model</span>
              <p className="text-[12.5px] font-medium text-foreground mt-0.5 truncate">{template.model}</p>
            </div>
          </div>

          {/* System Instructions */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider">
                System instructions
              </span>
              <button
                onClick={handleCopySystemPrompt}
                className="text-[11.5px] font-normal text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
            <div className="mt-1.5 p-3.5 rounded-xl bg-muted/30 border border-border text-[12.5px] font-normal text-foreground leading-relaxed whitespace-pre-wrap font-mono">
              {template.systemPrompt}
            </div>
          </div>

          {/* Starter Prompt */}
          {template.starterPrompt && (
            <div>
              <span className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider">
                Starter prompt
              </span>
              <div className="mt-1.5 p-3 rounded-xl bg-muted/20 border border-border text-[12.5px] font-normal text-foreground italic">
                "{template.starterPrompt}"
              </div>
            </div>
          )}

          {/* Evaluation Criteria */}
          <div>
            <span className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider">
              Evaluation criteria
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {template.evaluationCriteria?.map((criterion) => (
                <span
                  key={criterion}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-normal bg-[#f5a623]/10 text-[#b8740c] dark:text-[#f5a623] border border-[#f5a623]/25"
                >
                  <CheckCircle2 className="h-3 w-3 text-[#f5a623]" />
                  {criterion}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div>
              <span className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider">
                Tags
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onDuplicate(template);
              }}
              className="h-8 gap-1.5 text-[12px] font-normal rounded-xl border-border hover:border-[#f5a623]/30"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Duplicate</span>
            </Button>

            {!template.isSystemTemplate && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onEdit(template);
                  }}
                  className="h-8 gap-1.5 text-[12px] font-normal rounded-xl border-border hover:border-[#f5a623]/30"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onDelete(template);
                  }}
                  className="h-8 text-destructive hover:bg-destructive/10 text-[12px] font-normal rounded-xl"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => {
              onClose();
              onUse(template);
            }}
            className="h-8 px-4 gap-1.5 rounded-xl bg-[#f5a623] hover:bg-[#e09612] text-[#0f1117] text-[12.5px] font-medium transition-colors shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Use template</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
