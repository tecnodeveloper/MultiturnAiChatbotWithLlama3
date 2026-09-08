"use client";

import { FC } from "react";
import { useChat } from "@/context/chat-context";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, ChevronDown, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AI_PROVIDERS } from "@/lib/ai-providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

interface ChatUIProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onSendMessage: (content: string) => void;
  onFileUpload: (file: File) => void;
  onNewChat: () => void;
  attachedFiles: any[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  isInputLocked?: boolean;
  onFeedbackSubmitted?: () => void;
}

export const ChatUI: FC<ChatUIProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onSendMessage,
  onFileUpload,
  onNewChat,
  attachedFiles,
  setAttachedFiles,
  isInputLocked = false,
  onFeedbackSubmitted
}) => {
  const {
    chats,
    currentChatId,
    isSending,
    setUserInput,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
  } = useChat();

  const currentChat = chats.find(c => c.id === currentChatId);
  const currentProviderObj = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const currentModelObj = currentProviderObj?.models.find(m => m.id === selectedModel);
  const currentModelDisplayName = currentModelObj?.name || selectedModel;

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-[#f8fafc] dark:bg-[#070a12] font-sans h-full overflow-hidden text-[#0f172a] dark:text-foreground">
      {/* Sidebar Toggle Floating Button (when sidebar collapsed) */}
      {!sidebarOpen && (
        <Button
          className="absolute left-[8px] top-[14px] z-50 size-[32px] cursor-pointer rounded-full border border-[#cbd5e1] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#f1f5f9] dark:hover:bg-slate-800"
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <ChevronRight size={24} className="text-[#0f172a] dark:text-slate-300" />
        </Button>
      )}

      {/* Header: Model Selector on Left, Title Centered, Theme Toggle on Right */}
      <header className="flex max-h-[60px] min-h-[60px] w-full items-center justify-between border-b border-[#e2e8f0] dark:border-slate-800/60 px-6 relative bg-white dark:bg-[#070a12] shrink-0">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedProvider}:</span>
                <span className="max-w-[140px] truncate">{currentModelDisplayName}</span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 max-h-[420px] overflow-y-auto">
              {AI_PROVIDERS.map((provider) => (
                <div key={provider.id}>
                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
                    {provider.name}
                  </DropdownMenuLabel>
                  {provider.models.map((model) => {
                    const isSelected = selectedProvider === provider.id && selectedModel === model.id;
                    return (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => {
                          setSelectedProvider(provider.id);
                          setSelectedModel(model.id);
                        }}
                        className={`flex items-center justify-between px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${isSelected
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                      >
                        <span className="truncate">{model.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-1.5" />}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-[#0f172a] dark:text-slate-100 text-center pointer-events-none hidden sm:block">
          {currentChat?.title || "New Chat"}
        </h1>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#070a12] custom-scrollbar min-h-0">
        <div className="mx-auto max-w-5xl w-full py-6 px-4">
          <MessageList
            messages={currentChat?.messages || []}
            isSending={isSending}
            onNewChat={onNewChat}
            onSuggestionClick={handleSuggestionClick}
            chatId={currentChatId || undefined}
            onFeedbackSubmitted={onFeedbackSubmitted}
          />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        attachedFiles={attachedFiles}
        setAttachedFiles={setAttachedFiles}
        isLocked={isInputLocked}
      />
    </main>
  );
};

