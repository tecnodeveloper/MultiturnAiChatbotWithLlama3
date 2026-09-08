"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { submitFeedback } from "@/db";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  userId: string;
}

export function FeedbackModal({
  isOpen,
  onClose,
  chatId,
  userId,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a star rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        chat_id: chatId,
        user_id: userId,
        rating,
        comment,
      });
      toast.success("Thank you for your feedback!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-base font-medium text-foreground">Share your feedback</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            How was your conversation with MultiTurn AI? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-center mb-2 text-xs font-normal text-muted-foreground">Rating</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 p-0.5"
                >
                  <Star
                    className={`h-7 w-7 ${
                      rating >= star
                        ? "fill-[#f5a623] text-[#f5a623]"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comment" className="text-xs font-normal text-muted-foreground">Comments (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you liked or what we can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none text-xs bg-background border-border text-foreground"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-xs font-normal">
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="text-xs font-medium bg-[#f5a623] hover:bg-[#e09612] text-[#0f1117] transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
