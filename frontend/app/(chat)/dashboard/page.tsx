"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ChevronDown,
  Copy,
  LogOut,
  Menu,
  Plus,
  Send,
  Settings,
  Trash2,
  Paperclip,
  X,
  FileText,
  Search,
} from "lucide-react";
import {
  createChat,
  createMessage,
  deleteChat,
  getChats,
  getMessagesByChatId,
  updateChat,
  uploadFile,
  getFilesByChatId,
} from "@/db";
import { consumeReadableStream } from "@/lib/consume-stream";
import { FeedbackModal } from "@/components/feedback-modal";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

import { Brand } from "@/components/ui/brand";
import { AI_PROVIDERS } from "@/lib/ai-providers";
import { IconChevronCompactRight } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileModal } from "@/components/profile-modal";
import { getProfile } from "@/db";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState("Groq");
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load user profile
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const data = await getProfile(user.id);
    setProfile(data);
  };

  // Keyboard shortcut Ctrl+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        if (isSending && abortControllerRef.current) {
          console.log("Cancelling AI response via keyboard shortcut");
          abortControllerRef.current.abort();
          toast.info("AI response cancelled");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSending]);

  // Update model when provider changes
  useEffect(() => {
    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (provider && !provider.models.some(m => m.id === selectedModel)) {
      setSelectedModel(provider.models[0].id);
    }
  }, [selectedProvider]);


  // Computed values
  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === currentChatId) ?? null,
    [chats, currentChatId],
  );

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [chats, searchTerm]);

  // Actions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      let chatId = currentChatId;
      if (!chatId) {
        const newChat = await createChat({
          title: file.name.slice(0, 42),
          user_id: user.id,
        });
        chatId = newChat.id;
        setCurrentChatId(chatId);
        setChats([{
          id: newChat.id,
          title: newChat.title,
          messages: [],
          createdAt: newChat.created_at
        }, ...chats]);
      }

      if (!chatId) {
        throw new Error("Chat ID not initialized");
      }

      const uploaded = await uploadFile(file, chatId, user.id);
      setAttachedFiles(prev => [...prev, uploaded]);
      toast.success(`Uploaded ${file.name}`);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (currentChat?.messages.length || isSending) {
      scrollToBottom();
    }
  }, [currentChat?.messages, isSending]);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      try {
        const fetchedChats = await getChats();
        const chatsWithMessages = await Promise.all(
          fetchedChats.map(async (chat: any) => {
            const messages = await getMessagesByChatId(chat.id);
            return {
              id: chat.id,
              title: chat.title,
              createdAt: chat.created_at,
              messages: messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.created_at,
              })),
            };
          }),
        );
        setChats(chatsWithMessages);
        if (chatsWithMessages.length > 0 && !currentChatId) {
          setCurrentChatId(chatsWithMessages[0].id);
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
        toast.error("Failed to load your chats");
      }
    };

    loadChats();
  }, [user]);

  const handleNewChat = async () => {
    if (!user) return;
    try {
      const newChat = await createChat({ title: "New Chat", user_id: user.id });
      const nextChat: Chat = {
        id: newChat.id,
        title: newChat.title,
        messages: [],
        createdAt: newChat.created_at,
      };

      setChats([nextChat, ...chats]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      const updated = chats.filter((chat) => chat.id !== chatId);
      setChats(updated);

      if (currentChatId === chatId) {
        setCurrentChatId(updated[0]?.id ?? null);
      }
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user || isSending) {
      return;
    }

    const userContent = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      let chatId = currentChatId;
      let activeChat = currentChat;

      if (!chatId) {
        const newChat = await createChat({
          title: userContent.slice(0, 42),
          user_id: user.id,
        });
        chatId = newChat.id;
        activeChat = {
          id: newChat.id,
          title: newChat.title,
          messages: [],
          createdAt: newChat.created_at,
        };
        setChats([activeChat, ...chats]);
        setCurrentChatId(chatId);
      }

      const userMsg = await createMessage({
        chat_id: chatId!,
        role: "user",
        content: userContent,
        user_id: user.id,
      });

      const userMessage: Message = {
        id: userMsg.id,
        role: "user",
        content: userContent,
        timestamp: userMsg.created_at,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, userMessage] } : c,
        ),
      );

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...(activeChat?.messages || []), userMessage],
          provider: selectedProvider,
          model: selectedModel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const assistantId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c,
        ),
      );

      let fullContent = "";

      await consumeReadableStream(
        response.body,
        (chunk) => {
          fullContent += chunk;
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantId ? { ...m, content: fullContent } : m,
                    ),
                  }
                : c,
            ),
          );
        },
        controller.signal,
      );

      const savedAssistantMsg = await createMessage({
        chat_id: chatId!,
        role: "assistant",
        content: fullContent,
        user_id: user.id,
      });

      setAttachedFiles([]);

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        id: savedAssistantMsg.id,
                        timestamp: savedAssistantMsg.created_at,
                      }
                    : m,
                ),
              }
            : c,
        ),
      );

      if (activeChat?.title === "New Chat") {
        const newTitle = userContent.slice(0, 42);
        await updateChat(chatId!, { title: newTitle });
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c)),
        );
      }

      const userMessageCount = [
        ...(activeChat?.messages || []),
        userMessage,
      ].filter((m) => m.role === "user").length;
      if (userMessageCount === 6) {
        setShowFeedbackModal(true);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        toast.error(error.message || "Failed to send message");
        console.error(error);
      }
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside
        className={`border-r border-border bg-background transition-all duration-200 ease-in-out ${
          sidebarOpen ? "w-[300px]" : "w-0"
        }`}
      >
        <div className={`flex h-full flex-col overflow-hidden ${sidebarOpen ? "opacity-100" : "opacity-0 invisible"}`}>
          <div className="flex items-center gap-3 border-b border-border p-4">
            <Brand size="md" />
          </div>

          <div className="p-4 space-y-4">
            <Button className="w-full justify-start gap-2" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
              New chat
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`group mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentChatId === chat.id
                    ? "bg-muted"
                    : "hover:bg-muted/70"
                }`}
              >
                <span className="truncate">{chat.title}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2
                    className="h-3.5 w-3.5 hover:text-destructive"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="group relative transition-transform hover:scale-105"
              >
                <Avatar className="h-16 w-16 border-2 border-border transition-colors group-hover:border-primary">
                  <AvatarImage src={profile?.image_url} />
                  <AvatarFallback className="text-xl bg-primary/10">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </button>
              
              <div className="flex w-full gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => setShowProfileModal(true)}
                >
                  <Settings className="h-4 w-4" />
                  Account
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

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

        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-base font-semibold truncate max-w-[200px] md:max-w-md">
              {currentChat?.title || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Multi-turn chat workspace
            </p>
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
          {!currentChat ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Brand size="xl" showText={false} />
              <div>
                <h2 className="text-2xl font-semibold">Welcome to MultiTurn AI</h2>
                <p className="text-sm text-muted-foreground">
                  Start a new conversation to continue.
                </p>
              </div>
              <Button onClick={handleNewChat}>
                <Plus className="mr-2 h-4 w-4" />
                Start chat
              </Button>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
              {currentChat.messages.map((item, index) => (
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
                    <p className="whitespace-pre-wrap leading-6">{item.content}</p>
                  </div>
                  {item.role === "assistant" && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
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
          )}
        </div>

        <div className="border-t border-border p-4 bg-background">
          <div className="mx-auto max-w-4xl">
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs border border-border"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <button
                      onClick={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((f) => f.id !== file.id),
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex w-full gap-3">
              <div className="relative flex flex-1 items-center">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message MultiTurn AI..."
                  className="h-12 pl-12 rounded-xl border-border bg-background focus:ring-1 focus:ring-primary"
                  disabled={isSending}
                />
                <div className="absolute left-2 flex items-center">
                  <label className="cursor-pointer rounded-full p-2 hover:bg-muted transition-colors">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading || isSending}
                    />
                  </label>
                </div>
              </div>
              <Button type="submit" className="h-12 w-12 rounded-xl" disabled={!message.trim() || isSending}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      {user && currentChatId && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          chatId={currentChatId}
          userId={user.id}
        />
      )}

      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userId={user.id}
          onProfileUpdate={loadProfile}
        />
      )}
    </div>
  );
}


