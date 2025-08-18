import React from "react";
import CanvasBackground from "@/app/components/background/CanvasBackground";
import { ScrollArea } from "@/app/shadcn/components/ui/scroll-area";
import { Logo } from "@/app/assets/svg";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollArea className="bg-background flex w-full h-full flex-col bg-[radial-gradient(66.14%_90.55%_at_49.89%_100%,rgba(0,122,255,0.10)_0%,rgba(0,122,255,0.00)_100%)] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] backdrop-blur-[30px] overflow-auto">
      <div className="absolute inset-0 z-[0] w-full h-full">
        <CanvasBackground />
      </div>
      <div className="relative z-[0] w-full h-full">{children}</div>
    </ScrollArea>
  );
}
