import { Logo } from "@/app/assets/svg";
import React from "react";

export default function footer() {
  return (
    <div className="flex items-center h-10 justify-center z-1">
      <span className="text-md text-muted-foreground flex items-center gap-0">
        Powered by <Logo className="w-4 h-4" />
        <a
          href="https://linkol.ai"
          target="_blank"
          className="font-sf-bold cursor-pointer text-foreground hover:underline"
        >
          Linkol
        </a>
      </span>
    </div>
  );
}
