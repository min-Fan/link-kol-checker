"use client";
import React, { useState } from "react";
import { Info } from "lucide-react";
import CommTabs from "./comm/CommTabs";
import { ActiveTab } from "./comm/CommTabs";
import { PriceCurveChart } from "./PriceCurveChart";
import { IGetPriceData } from "@/app/libs/request";

interface KolHistoryLineChartProps {
  screenName?: string;
  info: IGetPriceData;
}

export default function KolHistoryLineChart({
  screenName,
  info,
}: KolHistoryLineChartProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.tab2);
  const tabs = [ActiveTab.tab2];
  const handleTabChange = (value: string) => {
    setActiveTab(value as ActiveTab);
  };

  return (
    <div className="w-full h-full mx-auto max-w-[700px] sm:w-[700px] bg-primary/20 border-2 border-primary rounded-md flex flex-1 flex-col gap-4 min-w-[300px] md:min-w-[500px] mr-auto md:mr-10">
      <div className="w-full h-full p-2 sm:p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-md font-sf-bold">
              Tweet value performance tracker
            </span>
            <Info className="w-3 h-3 text-foreground/90" />
          </div>
          <CommTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={tabs}
          />
        </div>
        <div className="w-full h-full flex-1">
          <PriceCurveChart screenName={screenName || ""} info={info} />
        </div>
      </div>
    </div>
  );
}
