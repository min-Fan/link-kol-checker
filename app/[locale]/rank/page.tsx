import { LogoHorizontalPrimary } from "@/app/assets/svg";
import React from "react";
import RankList from "./components/RankList";

export default function RankPage() {
  return (
    <div className="w-full min-h-screen pb-10">
      <div className="flex flex-col items-center gap-4">
        <LogoHorizontalPrimary className="w-72" />
        <RankList />
      </div>
    </div>
  );
}
