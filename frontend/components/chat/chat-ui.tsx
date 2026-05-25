"use client";

import { FC } from "react";
import { useChat } from "@/context/chat-context";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { AI_PROVIDERS } from "@/lib/ai-providers";
import { Button } from "@/components/ui/button";
import { IconChevronCompactRight } from "@tabler/icons-react";

interface ChatUIProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onSendMessage: (content: string) => void;
  onFileUpload: (file: File) => void;
  onNewChat: () => void;
  attachedFiles: any[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ChatUI: FC<ChatUIProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onSendMessage,
  onFileUpload,
  onNewChat,
  attachedFiles,
  setAttachedFiles
}) => {
  const {
    chats,
    currentChatId,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    isSending,
    setUserInput
  } = useChat();

  const currentChat = chats.find(c => c.id === currentChatId);

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col">
      <Button
        className="absolute left-[4px] top-[50%] z-50 size-[32px] cursor-pointer rounded-full border border-border bg-background shadow-md transition-transform duration-200 hover:scale-110"
        style={{
          transform: `translateY(-50%) rotate(${sidebarOpen ? "180deg" : "0deg"})`,
        }}
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        <IconChevronCompactRight size={24} />
      </Button>

      <header className="flex items-center justify-between border-b border-border px-6 py-4 h-[60px]">
        <div>
          <h1 className="text-base font-semibold truncate max-w-[200px] md:max-w-md">
            {currentChat?.title || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            {AI_PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            {AI_PROVIDERS.find((p) => p.id === selectedProvider)?.models.map(
              (model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ),
            )}
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
        <MessageList
          messages={currentChat?.messages || []}
          isSending={isSending}
          onNewChat={onNewChat}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        attachedFiles={attachedFiles}
        setAttachedFiles={setAttachedFiles}
      />
    </main>
  );
};
