"use client";

import { FC } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TemplateCategory, TEMPLATE_CATEGORIES } from "@/lib/template-service";

export type ScopeFilter = "All" | "My templates" | "System templates" | "Favorites";

interface TemplateToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedScope: ScopeFilter;
  onScopeChange: (scope: ScopeFilter) => void;
  selectedCategory: TemplateCategory | null;
  onCategoryChange: (category: TemplateCategory | null) => void;
  totalCount: number;
}

const SCOPE_FILTERS: ScopeFilter[] = ["All", "My templates", "System templates", "Favorites"];

export const TemplateToolbar: FC<TemplateToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedScope,
  onScopeChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
}) => {
  const hasActiveFilters = searchQuery !== "" || selectedScope !== "All" || selectedCategory !== null;

  const handleClearFilters = () => {
    onSearchChange("");
    onScopeChange("All");
    onCategoryChange(null);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Search and Scope Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates by name, tag, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9.5 pr-8 h-9 text-[12.5px] font-normal bg-card border-border rounded-xl placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#f5a623]/40"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border shrink-0 overflow-x-auto">
          {SCOPE_FILTERS.map((scope) => (
            <button
              key={scope}
              onClick={() => onScopeChange(scope)}
              className={`px-3 py-1 text-[12px] rounded-lg transition-all whitespace-nowrap ${
                selectedScope === scope
                  ? "bg-[#f5a623]/15 text-[#b8740c] dark:text-[#f5a623] border border-[#f5a623]/30 font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal"
              }`}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-[12px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11.5px] font-normal text-muted-foreground mr-1">Category:</span>
          {TEMPLATE_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(isSelected ? null : category)}
                className={`px-2.5 py-1 rounded-lg text-[11.5px] transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-[#f5a623]/15 text-[#b8740c] dark:text-[#f5a623] border-[#f5a623]/40 font-medium"
                    : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-normal"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-[11.5px] font-normal text-muted-foreground hover:text-foreground underline underline-offset-2 shrink-0 ml-2"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
