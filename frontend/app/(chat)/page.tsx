"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Menu,
  Send,
  LogOut,
  Settings,
  Plus,
  ChevronDown,
  Copy,
  Trash2,
} from "lucide-react";
import { Brand } from "@/components/ui/brand";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      // Load chats from localStorage
      const savedChats = localStorage.getItem("chats");
      if (savedChats) {
        try {
          const parsedChats = JSON.parse(savedChats);
          setChats(parsedChats);
          setCurrentChatId(parsedChats[0]?.id || null);
        } catch (e) {
          console.error("Failed to load chats:", e);
        }
      }
    }
  }, [isAuthenticated, router]);

  const currentChat = currentChatId
    ? chats.find((c) => c.id === currentChatId)
    : null;
  const messages = currentChat?.messages || [];

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    setCurrentChatId(newChat.id);
    setMessage("");
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chats.filter((c) => c.id !== chatId);
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    if (currentChatId === chatId) {
      setCurrentChatId(updatedChats[0]?.id || null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMsg: Message = {
        role: "assistant",
        content:
          "This is a placeholder response. Connect to your AI API here. The MultiTurn AI Chatbot is ready to process your queries using LLaMA 3.",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];

      // Update chat with new messages and title
      const updatedChats = chats.map((c) => {
        if (c.id === currentChat.id) {
          return {
            ...c,
            messages: finalMessages,
            title:
              c.messages.length === 0 && message.length > 30
                ? message.substring(0, 30) + "..."
                : c.title,
          };
        }
        return c;
      });

      setChats(updatedChats);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      setIsLoading(false);
    }, 800);

    setMessage("");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header with Brand */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && <Brand size="md" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-0 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        {sidebarOpen && (
          <div className="p-4">
            <Button
              onClick={handleNewChat}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white gap-2 h-10"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {sidebarOpen && chats.length > 0 && (
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {chat.title}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {sidebarOpen && (
            <>
              <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
                size="sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          )}
          {!sidebarOpen && (
            <Button
              variant="ghost"
              className="w-full p-0 h-8 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentChat.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-700">
                  <option>LLaMA 3</option>
                  <option>Grok</option>
                  <option>OpenRouter</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 text-6xl">🚀</div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Start Your Conversation
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Welcome to MultiTurn AI powered by LLaMA 3. Ask anything and
                    get intelligent responses.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-lg px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    {msg.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-6 py-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message MultiTurn AI..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={!message.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                MultiTurn AI can make mistakes. Please verify important
                information.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Brand size="xl" />
            <p className="mt-6 text-gray-600 dark:text-gray-400">
              Start a new chat to begin
            </p>
            <Button
              onClick={handleNewChat}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
