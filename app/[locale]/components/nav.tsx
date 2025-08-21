import { Logo } from "@/app/assets/svg";
import { Link } from "@/app/i18n/routing";
import React from "react";

export default function nav() {
  return (
    <div className="w-full bg-transparent flex items-center justify-between p-2 sm:p-4 !py-2 sticky top-0 z-[10]">
      <div className="w-full h-12 flex items-center justify-between rounded-xl px-2 py-2">
        <Link href="/">
          <div className="flex items-center justify-between">
            <Logo className="w-8 h-8 text-white" />
            <span className="text-lg font-sf-bold whitespace-nowrap">
              LinKol Checker
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-between pr-2">
          <Link href="/rank">
            <div className="p-2 py-1 rounded-md flex items-center justify-center hover:bg-primary/80 transition-all duration-300 hover:text-white">
              <span className="text-md cursor-pointer transition-all duration-300">
                Leaderboard
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
