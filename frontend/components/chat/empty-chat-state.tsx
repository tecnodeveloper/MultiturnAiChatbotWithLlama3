"use client";

import { FC } from "react";
import { 
  FileText, 
  Pencil, 
  Laptop, 
  MessageSquare, 
  Briefcase, 
  PhoneCall 
} from "lucide-react";

interface EmptyChatStateProps {
  username: string;
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTIONS = [
  {
    label: "Summarize this document",
    icon: <FileText className="h-4 w-4 text-[#f5a623]" />,
    text: "Can you summarize this document for me?"
  },
  {
    label: "Help me write an email",
    icon: <Pencil className="h-4 w-4 text-[#f5a623]" />,
    text: "I need help writing a professional email regarding..."
  },
  {
    label: "Generate React component",
    icon: <Laptop className="h-4 w-4 text-[#f5a623]" />,
    text: "Create a modern React component for a..."
  },
  {
    label: "Explain this code",
    icon: <MessageSquare className="h-4 w-4 text-[#f5a623]" />,
    text: "Can you explain how this code works?"
  },
  {
    label: "Create business proposal",
    icon: <Briefcase className="h-4 w-4 text-[#f5a623]" />,
    text: "Help me draft a business proposal for..."
  },
  {
    label: "Fix bugs in my project",
    icon: <PhoneCall className="h-4 w-4 text-[#f5a623]" />,
    text: "I'm having an issue with my code, can you help me debug?"
  }
];

export const EmptyChatState: FC<EmptyChatStateProps> = ({
  username,
  onSuggestionClick
}) => {
  const displayUser = username || "salman";

  return (
    <div className="flex flex-col items-center justify-end w-full animate-in fade-in duration-500 font-sans pt-12 pb-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="mb-2 text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
          Hello, <span className="text-[#f5a623]">{displayUser}</span>
        </h1>
        
        <p className="text-[15px] text-muted-foreground font-normal">
          How can I help you today?
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 text-left transition-all duration-200 hover:scale-[1.01] hover:bg-muted/30 hover:border-[#f5a623]/30 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5a623]/10 text-[#f5a623] transition-colors">
              {suggestion.icon}
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium text-foreground text-[13.5px]">{suggestion.label}</span>
              <span className="text-xs text-muted-foreground mt-1 font-normal">
                Click to try this prompt
              </span>
            </div>
            
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-[#f5a623]/20 transition-all pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};
