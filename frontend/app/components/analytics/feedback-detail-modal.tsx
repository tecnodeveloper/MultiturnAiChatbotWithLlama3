"use client";

import { FC } from "react";
import { X, User, Bot, Star, Clock, Tag, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface FeedbackModalItem {
  id?: string;
  time: string;
  topic: string;
  preview: string;
  user_query?: string;
  model_response?: string;
  feedback: "up" | "down" | "none";
  status: string;
  rating: number;
  correctness?: string;
  length_type?: string;
}

interface FeedbackDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FeedbackModalItem | null;
}

export const FeedbackDetailModal: FC<FeedbackDetailModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Correct":
      case "Helpful":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/25">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </span>
        );
      case "Partial":
      case "Partially Helpful":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-[#f5a623]/5 text-[#d48812] dark:text-[#f5a623]/80 border border-[#f5a623]/15">
            <HelpCircle className="w-3.5 h-3.5" /> Partial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50">
            <XCircle className="w-3.5 h-3.5" /> Incorrect
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {item.topic}
            </span>
            <span className="text-[12px] text-muted-foreground flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {item.time}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Rating & Evaluation Badges Summary */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/20 border border-border/80">
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-normal text-muted-foreground">User rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= item.rating
                        ? "fill-[#f5a623] text-[#f5a623]"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
                <span className="ml-1 text-[12.5px] font-medium text-foreground">
                  {item.rating}/4
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-normal text-muted-foreground">Correctness</span>
              <div>{renderStatusBadge(item.status)}</div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-normal text-muted-foreground">Length category</span>
              <span className="text-[11.5px] font-normal px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground w-fit">
                {item.length_type || "To the point"}
              </span>
            </div>
          </div>

          {/* User Query Block */}
          {item.user_query && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>User prompt / question</span>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border text-[13px] font-normal text-foreground leading-relaxed">
                {item.user_query}
              </div>
            </div>
          )}

          {/* Full AI Model Response Block */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <Bot className="w-3.5 h-3.5 text-[#f5a623]" />
              <span>AI model response</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border text-[13px] font-normal text-foreground leading-relaxed prose dark:prose-invert max-w-none">
              <ReactMarkdown>
                {item.model_response || item.preview || "No detailed model response recorded for this item."}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border flex justify-end bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[12.5px] font-medium text-[#0f1117] bg-[#f5a623] hover:bg-[#e09612] rounded-xl transition-colors shadow-sm"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
};
