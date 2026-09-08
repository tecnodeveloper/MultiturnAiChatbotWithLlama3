"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Template, CreateTemplateInput, templateService } from "@/lib/template-service";
import { TemplateFormModal } from "@/components/templates/template-form-modal";
import { useChat } from "@/context/chat-context";
import { useDashboard } from "@/hooks/use-dashboard";
import { toast } from "sonner";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const { setCurrentChatId } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  const { handleNewChat, handleDeleteChat } = useDashboard();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const data = await templateService.getTemplateById(templateId);
        if (data?.isSystemTemplate) {
          toast.error("System templates cannot be edited");
          router.push(`/templates/${templateId}`);
          return;
        }
        setTemplate(data);
      } catch (err) {
        toast.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, router]);

  const handleSave = async (input: CreateTemplateInput) => {
    await templateService.updateTemplate(templateId, input);
    router.push(`/templates/${templateId}`);
  };

  const handleClose = () => {
    router.push(`/templates/${templateId}`);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        collapsed={!sidebarOpen}
        onToggleCollapse={() => setSidebarOpen((prev) => !prev)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={setCurrentChatId}
      />

      <main className="flex-1 p-8 flex items-center justify-center">
        {!loading && template && (
          <TemplateFormModal
            isOpen={true}
            onClose={handleClose}
            onSave={handleSave}
            initialTemplate={template}
          />
        )}
      </main>
    </div>
  );
}
