import React from "react";
import { cn } from "../shadcn/lib/utils";

export default function MainContentContext({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full min-h-[calc(100vh-8rem)] z-10", className)}>
      {children}
    </div>
  );
}
