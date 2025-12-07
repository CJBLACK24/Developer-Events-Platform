"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessDialog({
  open,
  onClose,
  title,
  message,
  buttonText = "Continue",
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-200 border-dark-300 max-w-sm text-center">
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
          <DialogDescription className="text-gray-400 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4 pb-2">
          <Button
            onClick={onClose}
            className="bg-[#00D4AA] text-black hover:bg-[#00C49A] font-semibold px-8 py-2 rounded-lg"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
