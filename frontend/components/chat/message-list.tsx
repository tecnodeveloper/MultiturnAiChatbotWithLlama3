"use client";

import { FC, useRef, useEffect } from "react";
import { Message } from "@/context/chat-context";
import { useAuth } from "@/context/auth-context";
import { EmptyChatState } from "./empty-chat-state";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageListProps {
  messages: Message[];
  isSending: boolean;
  onNewChat: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const MessageList: FC<MessageListProps> = ({
  messages,
  isSending,
  onNewChat,
  onSuggestionClick
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  if (messages.length === 0) {
    return (
      <EmptyChatState 
        username={user?.name || user?.email?.split('@')[0] || "there"} 
        onSuggestionClick={onSuggestionClick}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {messages.map((item, index) => (
        <div
          key={`${item.role}-${index}`}
          className={`flex gap-3 ${
            item.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {item.role === "assistant" && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
              AI
            </div>
          )}
          <div
            className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${
              item.role === "user"
                ? "rounded-br-md bg-primary text-primary-foreground shadow-sm"
                : "rounded-bl-md bg-background border border-border shadow-sm"
            }`}
          >
            <ReactMarkdown className="prose dark:prose-invert max-w-none break-words leading-6">
              {item.content}
            </ReactMarkdown>
          </div>
          {item.role === "assistant" && (
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => {
              navigator.clipboard.writeText(item.content);
            }}>
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {isSending && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            AI
          </div>
          <div className="rounded-2xl rounded-bl-md bg-background border border-border px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
