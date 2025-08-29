"use client";
import React, { forwardRef } from "react";
import { cn } from "@/app/shadcn/lib/utils";
import downloadCardBg from "@/app/assets/img/download-card-bg.png";
import KolCard from "./KolCard";
import { IGetPriceData } from "@/app/libs/request";
import { getCurrentDomain } from "@/app/libs/utils";

interface DownloadCardProps {
  className?: string;
  data: IGetPriceData;
}

const DownloadCard = forwardRef<HTMLDivElement, DownloadCardProps>(
  ({ className, data }, ref) => {
    return (
      <div
        className={cn(
          "w-[800px] h-[800px] flex items-center justify-center relative",
          className
        )}
        style={{
          backgroundImage: `url(${downloadCardBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        ref={ref}
      >
        <div className="relative z-10">
          <KolCard data={data} className="w-[350px] z-10" />
          <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] h-[96%] shadow-[0_0_130px_rgba(255,255,255,0.9)] z-0"></div>
        </div>
        <div className="w-full absolute bottom-16 left-0 text-2xl text-black font-bold text-center">
          {getCurrentDomain()}
        </div>
      </div>
    );
  }
);

DownloadCard.displayName = "DownloadCard";

export default DownloadCard;
