"use client";

import { Link, usePathname } from "@/app/i18n/routing";
import React, { useState } from "react";
import UserInfo from "./userInfo";
import { cn } from "@/app/shadcn/lib/utils";
import DialogMenu from "./DialogMenu";

export default function nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="w-full bg-transparent flex items-center justify-between relative z-10 p-2 sm:p-0">
      <div className="w-full h-10 sm:h-12 flex items-center justify-between rounded-lg sm:rounded-xl p-2 sm:p-4 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
        <div className="flex items-center justify-between gap-2">
          <div className="sm:hidden flex">
            <DialogMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
          </div>
          <Link href="/">
            <div className="flex items-center justify-between mr-10">
              {/* <Logo className="w-8 h-8 text-white" />
            <span className="text-lg font-sf-bold whitespace-nowrap sm:block hidden">
              LinKol Checker
            </span> */}
              <span className="sm:text-xl text-sm font-kyiv font-bold whitespace-nowrap">
                Tweet Value Checker
              </span>
            </div>
          </Link>
          <div className="items-center justify-center gap-2 sm:flex hidden">
            <Link href="/rank">
              <div
                className={cn(
                  "p-2 py-1 flex items-center justify-center hover:bg-white transition-all duration-300 hover:text-black",
                  pathname === "/rank" && "bg-white text-black",
                )}
              >
                <span className="text-md cursor-pointer transition-all duration-300">
                  Leaderboard
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between pr-2 gap-2">
          {/* <Link href="https://app.linkol.fun/en" target="_blank">
            <div className="p-4 py-1.5 rounded-md flex items-center justify-center bg-primary/80 text-white hover:bg-primary/80 transition-all duration-300 hover:text-white gap-1">
              <span className="sm:text-md text-sm cursor-pointer transition-all duration-300 whitespace-nowrap">
                Raffle tweet
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link> */}

          <UserInfo />
        </div>
      </div>
    </div>
  );
}
