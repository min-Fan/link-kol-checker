import { LogoHorizontalDark, SpreadX } from "@/app/assets/svg";
import React from "react";

export default function footer() {
  return (
    <div className="flex items-center justify-end pb-2 z-10 relative flex-col gap-1 h-20">
      <span className="text-xs">Powered by</span>
      <div className="flex items-center">
        <LogoHorizontalDark />
        <span className="text-sm font-sf mr-1">X</span>
        <SpreadX />
      </div>
    </div>
  );
}
