"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/ui/brand";
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
} from "lucide-react";

interface Message {
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem("mtai-chats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats) as Chat[];
        setChats(parsedChats);
        setCurrentChatId(parsedChats[0]?.id ?? null);
      } catch {
        localStorage.removeItem("mtai-chats");
      }
    }
  }, []);

  const currentChat = useMemo(
    () => chats.find(chat => chat.id === currentChatId) ?? null,
    [chats, currentChatId],
  );

  const handleNewChat = () => {
    const nextChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [nextChat, ...chats];
    setChats(updated);
    setCurrentChatId(nextChat.id);
    localStorage.setItem("mtai-chats", JSON.stringify(updated));
  };

  const handleDeleteChat = (chatId: string) => {
    const updated = chats.filter(chat => chat.id !== chatId);
    setChats(updated);
    localStorage.setItem("mtai-chats", JSON.stringify(updated));

    if (currentChatId === chatId) {
      setCurrentChatId(updated[0]?.id ?? null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsSending(true);

    const chatId = currentChatId ?? crypto.randomUUID();
    const chat =
      chats.find(item => item.id === chatId) ??
      ({
        id: chatId,
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
      } as Chat);

    const userMessage: Message = {
      role: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: Message = {
      role: "assistant",
      content:
        "This is the MultiTurn AI dashboard shell. Next step is wiring this UI to Supabase chat persistence and AI responses.",
      timestamp: new Date().toISOString(),
    };

    const updatedChat = {
      ...chat,
      title:
        chat.messages.length === 0
          ? message.trim().slice(0, 42)
          : chat.title,
      messages: [...chat.messages, userMessage, assistantMessage],
    };

    const nextChats = chat.messages.length === 0
      ? [updatedChat, ...chats.filter(item => item.id !== chatId)]
      : chats.map(item => (item.id === chatId ? updatedChat : item));

    setChats(nextChats);
    setCurrentChatId(chatId);
    localStorage.setItem("mtai-chats", JSON.stringify(nextChats));
    setMessage("");
    setIsSending(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={`border-r border-border bg-background transition-all duration-200 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            {sidebarOpen ? <Brand size="md" showText={false} /> : <Brand size="sm" showText={false} />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4">
            {sidebarOpen && (
              <Button className="w-full justify-start gap-2" onClick={handleNewChat}>
                <Plus className="h-4 w-4" />
                New chat
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {sidebarOpen &&
              chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`group mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    currentChatId === chat.id
                      ? "bg-muted"
                      : "hover:bg-muted/70"
                  }`}
                >
                  <span className="truncate">{chat.title}</span>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">
                    <Trash2
                      className="h-3.5 w-3.5"
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
            {sidebarOpen ? (
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-base font-semibold">
              {currentChat?.title || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Multi-turn chat workspace
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-10 rounded-md border border-border bg-background px-3 text-sm">
              <option>Groq</option>
              <option>OpenRouter</option>
              <option>Ollama</option>
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${
                      item.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-6">{item.content}</p>
                  </div>
                  {item.role === "assistant" && (
                    <Button variant="ghost" size="icon" className="h-9 w-9">
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
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="mx-auto flex w-full max-w-4xl gap-3">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Message MultiTurn AI..."
              className="h-12"
            />
            <Button type="submit" disabled={!message.trim() || isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
