"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { TemplatesUI } from "@/components/templates/templates-ui";
import { useChat } from "@/context/chat-context";
import { useDashboard } from "@/hooks/use-dashboard";

export default function TemplatesPage() {
  const { setCurrentChatId } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { handleNewChat, handleDeleteChat } = useDashboard();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        collapsed={!sidebarOpen}
        onToggleCollapse={() => setSidebarOpen((prev) => !prev)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={setCurrentChatId}
      />

      <TemplatesUI
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}
