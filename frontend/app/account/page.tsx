"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getProfile, updateProfile, uploadAvatar } from "@/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brand } from "@/components/ui/brand";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, Save, ImagePlus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile(user!.id);
      if (profile) {
        setName(profile.name || "");
        setImageUrl(profile.image_url || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadAvatar(file, user.id);
      setImageUrl(url);
      // Auto-save the new image URL to the profile
      await updateProfile(user.id, { image_url: url });
      toast.success("Avatar updated");
      router.refresh();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    try {
      await updateProfile(user.id, { image_url: "" });
      setImageUrl("");
      toast.success("Photo removed");
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove photo");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user.id, { name, image_url: imageUrl });
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b border-border bg-background p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Brand size="sm" />
          </div>
          <h1 className="text-lg font-semibold">Account Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
          <div className="mb-10 flex flex-col items-center gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-muted shadow-lg">
                <AvatarImage src={imageUrl} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/10">
                  {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <div className="flex flex-col items-center text-white gap-1">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Change</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="text-center">
                <h2 className="text-xl font-bold">{name || "Your Name"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              {imageUrl && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1"
                  onClick={handleRemovePhoto}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove Photo
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                This is how you will appear in chat history and profiles.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isUploading}
                className="w-full h-11 text-base gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="link" className="text-muted-foreground">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
