import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/app/shadcn/components/ui/dialog";
import { Clock, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/app/shadcn/components/ui/button";

interface DialogDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DialogDisclaimer({
  isOpen,
  onClose,
}: DialogDisclaimerProps) {
  const t = useTranslations("common");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogClose asChild></DialogClose>
      <DialogContent
        className="border-border flex max-h-[90vh] w-full max-w-full flex-col gap-0 overflow-hidden bg-transparent p-2 shadow-none sm:w-[450px] sm:max-w-full sm:p-0"
        nonClosable
      >
        {/* Header */}
        <DialogHeader className="bg-primary gap-0 rounded-t-xl p-2 text-center text-white sm:rounded-t-2xl sm:p-4">
          <DialogTitle className="text-center text-base font-semibold text-white">
            Disclaimer
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="bg-background h-full space-y-4 overflow-y-auto rounded-b-xl p-4 pt-4 sm:rounded-b-2xl sm:p-4 sm:pt-8">
          {/* Step 1: Share the Campaign */}
          <div className="flex items-start gap-3 pb-4 border-b border-border/20">
            {/* <div className="bg-primary/5 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
              1
            </div> */}
            <div className="flex-1">
              <h3 className="py-1 text-md sm:text-base font-semibold">
                Tweet Value Checker is an AI-estimated model.
              </h3>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                It does not claim to be 100% definitive, but provides
                directional benchmarks based on multiple signals beyond vanity
                metrics.
              </p>
              {/* <div className="border-primary bg-primary/5 mt-2 border-l-5 py-2 pl-3">
                <p className="text-sm italic"></p>
              </div> */}
            </div>
          </div>

          {/* Step 2: Wait for Verification */}
          <div className="flex items-start gap-3">
            {/* <div className="bg-primary/5 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
              2
            </div> */}
            <div className="flex-1">
              <h3 className="py-1 text-md sm:text-base font-semibold">
                Our model considers:
              </h3>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                Post quality – language clarity, originality, and alignment with
                narrative hotspots.
              </p>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                Real engagement – authentic likes, replies, reposts vs. botted
                or low-quality interactions.
              </p>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                Follower influence & network strength – how powerful the
                audience is (are they builders, whales, normies?).
              </p>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                Consistency & virality potential – track record of producing
                content that travels beyond immediate followers.
              </p>
              <p className="text-foreground/80 mt-1 text-sm sm:text-base">
                Sentiment resonance – whether the post shifts conversations
                positively/negatively in the ecosystem.
              </p>
            </div>
          </div>

          {/* Got it! Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 !h-auto w-full !rounded-lg py-3 font-medium text-white"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
