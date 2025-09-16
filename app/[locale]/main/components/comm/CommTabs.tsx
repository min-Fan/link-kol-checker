"use client";
import { Tabs, TabsList, TabsTrigger } from "@/app/shadcn/components/ui/tabs";
import { cn } from "@/app/shadcn/lib/utils";
import { Clock } from "lucide-react";

export enum ActiveTab {
  "tab1" = "24h",
  "tab2" = "7D",
  "tab3" = "1M",
  "tab4" = "3M",
}

export default function CommTabs({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: ActiveTab;
  onTabChange: (value: string) => void;
  tabs: ActiveTab[];
}) {
  return (
    <Tabs defaultValue={tabs[0]} onValueChange={onTabChange}>
      <TabsList className="bg-foreground shadow-muted-foreground/10 rounded-full p-1 shadow-lg">
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab}
            className={cn(
              "text-background !h-full",
              activeTab === tab &&
                "!bg-primary/5 !text-primary border !border-primary !rounded-full text-sm font-bold sm:text-md gap-1 p-1 px-1.5",
            )}
          >
            {activeTab === tab && <Clock className="h-4 w-4 min-w-4 min-h-4" />}
            <span
              className={cn("font-sf", activeTab === tab && "font-sf-bold")}
            >
              {tab}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
