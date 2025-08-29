"use client";

import { Link } from "@/app/i18n/routing";
import React from "react";
import UserInfo from "./userInfo";

export default function nav() {
  return (
    <div className="w-full bg-transparent flex items-center justify-between relative z-10">
      <div className="w-full h-10 sm:h-12 flex items-center justify-between rounded-lg sm:rounded-xl p-2 sm:p-4 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
        <Link href="/">
          <div className="flex items-center justify-between">
            {/* <Logo className="w-8 h-8 text-white" />
            <span className="text-lg font-sf-bold whitespace-nowrap sm:block hidden">
              LinKol Checker
            </span> */}
            <span className="sm:text-xl text-md font-kyiv font-bold">
              Tweet Value Checker
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-between pr-2">
          {/* <Link href="/rank">
            <div className="p-2 py-1 rounded-md flex items-center justify-center hover:bg-primary/80 transition-all duration-300 hover:text-white">
              <span className="text-md cursor-pointer transition-all duration-300">
                Leaderboard
              </span>
            </div>
          </Link> */}

          <UserInfo />
        </div>
      </div>
    </div>
  );
}
