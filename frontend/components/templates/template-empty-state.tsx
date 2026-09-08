"use client";

import { FC } from "react";
import { Layers, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateEmptyStateProps {
  type: "empty" | "search";
  onCreateNew?: () => void;
  onClearFilters?: () => void;
}

export const TemplateEmptyState: FC<TemplateEmptyStateProps> = ({
  type,
  onCreateNew,
  onClearFilters,
}) => {
  if (type === "search") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 my-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3.5">
          <Search className="h-5 w-5" />
        </div>
        <h3 className="text-[15px] font-medium text-foreground tracking-tight">
          No templates found
        </h3>
        <p className="mt-1 text-[12.5px] font-normal text-muted-foreground max-w-sm">
          Try a different search keyword or clear your active filters to see available templates.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-4 text-[12px] font-normal rounded-xl border-border hover:border-[#f5a623]/40"
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5a623]/10 text-[#f5a623] mb-3.5">
        <Layers className="h-5 w-5" />
      </div>
      <h3 className="text-[16px] font-medium text-foreground tracking-tight">
        No templates yet
      </h3>
      <p className="mt-1 text-[12.5px] font-normal text-muted-foreground max-w-md">
        Create your first reusable AI conversation template to speed up testing and evaluation workflows.
      </p>
      {onCreateNew && (
        <Button
          size="sm"
          onClick={onCreateNew}
          className="mt-5 gap-1.5 rounded-xl bg-[#f5a623] hover:bg-[#e09612] text-[#0f1117] text-[12.5px] font-medium px-4 py-2 transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create template</span>
        </Button>
      )}
    </div>
  );
};
