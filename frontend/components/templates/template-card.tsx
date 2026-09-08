"use client";

import { FC } from "react";
import { Template } from "@/lib/template-service";
import { Star, MoreHorizontal, Play, Eye, Copy, Edit2, Trash2, Layout, Bot, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateCardProps {
  template: Template;
  onUse: (template: Template) => void;
  onView: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onToggleFavorite: (id: string) => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({
  template,
  onUse,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-[#f5a623]/30 shadow-sm relative group">
      {/* Top Row: Icon + Title + Actions */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5a623]/10 text-[#f5a623] shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-[14.5px] font-medium text-foreground tracking-tight truncate">
                {template.name}
              </h3>
              {template.isSystemTemplate && (
                <span className="text-[10.5px] font-medium text-[#b8740c] dark:text-[#f5a623] bg-[#f5a623]/10 px-1.5 py-0.5 rounded">
                  System
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(template.id)}
              aria-label={template.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Star
                className={`h-4 w-4 transition-colors ${
                  template.isFavorite
                    ? "fill-[#f5a623] text-[#f5a623]"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="More options"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-card border-border text-foreground">
                <DropdownMenuItem
                  onClick={() => onView(template)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUse(template)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Play className="h-3.5 w-3.5 text-[#f5a623]" />
                  <span>Use template</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate(template)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Duplicate</span>
                </DropdownMenuItem>

                {!template.isSystemTemplate && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onEdit(template)}
                      className="text-xs cursor-pointer flex items-center gap-2"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(template)}
                      className="text-xs cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-[12.5px] font-normal text-muted-foreground line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metadata & Actions */}
      <div className="mt-5 pt-4 border-t border-border/70 flex flex-col gap-3">
        {/* Metadata Line */}
        <div className="flex items-center gap-1.5 text-[11.5px] font-normal text-muted-foreground truncate">
          <span>{template.category}</span>
          <span>·</span>
          <span className="truncate max-w-[120px]">{template.provider}</span>
          <span>·</span>
          <span>{template.evaluationCriteria?.length || 0} criteria</span>
          <span>·</span>
          <span>Used {template.usageCount || 0} times</span>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(template)}
            className="text-[12px] font-normal text-muted-foreground hover:text-foreground h-8 px-2.5"
          >
            View details
          </Button>

          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="h-8 px-3.5 gap-1.5 rounded-xl bg-[#f5a623] hover:bg-[#e09612] text-[#0f1117] text-[12px] font-medium transition-colors shadow-sm active:scale-95"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Use template</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
