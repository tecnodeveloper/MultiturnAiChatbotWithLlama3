"use client";

import { FC, useState } from "react";
import { useChat } from "@/context/chat-context";
import { SidebarSwitcher } from "./sidebar-switcher";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brand } from "@/components/ui/brand";

interface SidebarProps {
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSelectChat: (chatId: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  onNewChat,
  onDeleteChat,
  onSelectChat
}) => {
  const {
    chats,
    currentChatId,
    searchTerm,
    setSearchTerm,
    contentType,
    setContentType,
    prompts,
    presets,
    folders
  } = useChat();
  const { user } = useAuth();

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrompts = prompts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPresets = presets.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (contentType) {
      case "chats":
        return (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentChatId === chat.id ? "bg-muted" : "hover:bg-muted/70"
                }`}
              >
                <span className="truncate">{chat.title}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2
                    className="h-3.5 w-3.5 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        );
      case "prompts":
        return (
          <div className="space-y-1">
            {filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70"
              >
                <span className="truncate">{prompt.name}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5 hover:text-destructive" />
                </span>
              </button>
            ))}
            {filteredPrompts.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No prompts found. Click "New Prompt" to create one.
              </div>
            )}
          </div>
        );
      case "presets":
        return (
          <div className="space-y-1">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70"
              >
                <span className="truncate">{preset.name}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5 hover:text-destructive" />
                </span>
              </button>
            ))}
            {filteredPresets.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No presets found. Click "New Preset" to create one.
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground italic">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} coming soon...
          </div>
        );
    }
  };

  return (
    <div className="flex h-full border-r border-border bg-background">
      <SidebarSwitcher
        contentType={contentType}
        onContentTypeChange={setContentType}
      />

      <div className="flex w-[260px] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border p-4 h-[60px]">
          <Brand size="sm" />
        </div>

        <div className="p-4 space-y-4">
          <Button className="w-full justify-start gap-2" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
            {contentType === "chats" ? "New chat" : 
             contentType === "prompts" ? "New prompt" : 
             contentType === "presets" ? "New preset" : "New item"}
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${contentType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
          {renderContent()}
        </div>

        <div className="border-t border-border p-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden text-xs">
              <span className="truncate font-semibold">{user?.name || "User"}</span>
              <span className="truncate text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
