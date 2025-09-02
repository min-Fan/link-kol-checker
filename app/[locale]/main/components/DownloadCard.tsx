"use client";
import React, { forwardRef } from "react";
import { cn } from "@/app/shadcn/lib/utils";
import downloadCardBg from "@/app/assets/img/download-card-bg.png";
import { IGetPriceData } from "@/app/libs/request";
import { getCurrentDomain } from "@/app/libs/utils";

interface DownloadCardProps {
  className?: string;
  data: IGetPriceData;
}

import { copy, formatDateYMDHMS } from "@/app/libs/utils";
import { useTranslations } from "next-intl";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import defaultAvatar from "@/app/assets/img/avatar.png";
import { Logo } from "@/app/assets/svg";
import cardBg from "@/app/assets/img/card-bg.png";
import logoBorder from "@/app/assets/img/logo-border.png";

const KolCard = ({
  data,
  className,
}: {
  data: IGetPriceData;
  className?: string;
}) => {
  const t = useTranslations("common");
  const { toast } = useToast();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 背景图片 */}
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <img src={cardBg.src} alt="Card Background" className="w-full h-full" />
      </div>

      {/* 日期 */}
      <div
        id="date"
        className="text-sm font-medium z-10 flex justify-end text-primary text-right pt-2 pr-2 scale-90 leading-none absolute top-0 right-0"
      >
        {new Date().toISOString().split("T")[0].replace(/-/g, ".")}
      </div>

      {/* 中央Logo区域 */}
      <div className="flex flex-col items-center z-10 mt-14">
        {/* Logo背景圆圈 */}
        <div className="flex items-center justify-center mb-3 relative p-5">
          <div className="absolute inset-0 w-full h-full z-1">
            <img
              src={logoBorder.src}
              alt="Card Background"
              className="w-full h-full"
            />
          </div>

          {/* 用户头像 */}
          <div className="!rounded-md overflow-hidden flex items-center justify-center w-[200px] h-[200px]">
            <img
              id="user-avatar"
              src={
                data?.kol?.profile_image_url?.replace("_normal", "") ||
                defaultAvatar.src
              }
              alt="User Avatar"
              className="w-full h-full object-cover !rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* 价格显示 */}
      <div className="flex justify-center flex-col items-center mt-5 pb-10">
        <div
          id="price"
          className="text-white text-4xl font-bold leading-none mb-2 font-kyiv"
        >
          $
          {data?.current_value >= 10000
            ? "10000+"
            : data?.current_value?.toLocaleString() || "0"}
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs text-primary !scale-90">Single</span>
          <span className="text-xs text-primary !scale-90">Tweet</span>
          <span className="text-xs text-primary !scale-90">Value</span>
          <span className="text-xs text-primary !scale-90">By</span>
          <span className="text-xs text-primary !scale-90 ml-0.5">AI</span>
        </div>
      </div>

      {/* 用户名称 */}
      <div className="text-[#090909] font-kyiv pl-16 pb-[18px]">
        <div
          id="brand-name"
          className="text-xl font-bold cursor-pointer"
          onClick={() => {
            copy(data?.kol?.name).then((success) => {
              if (success) {
                toast({
                  title: t("copy_success"),
                  variant: "default",
                });
              } else {
                toast({
                  title: t("copy_failed"),
                  variant: "destructive",
                });
              }
            });
          }}
        >
          {data?.kol?.name.length > 16
            ? data?.kol?.name.slice(0, 16) + "..."
            : data?.kol?.name}
        </div>
        <div
          id="username"
          className="text-sm font-bold cursor-pointer"
          onClick={() => {
            copy(data?.kol?.screen_name).then((success) => {
              if (success) {
                toast({
                  title: t("copy_success"),
                  variant: "default",
                });
              } else {
                toast({
                  title: t("copy_failed"),
                  variant: "destructive",
                });
              }
            });
          }}
        >
          @{data?.kol?.screen_name}
        </div>
      </div>
    </div>
  );
};

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
          <KolCard data={data} className="w-[330px] z-10" />
          <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] h-[96%] shadow-[0_0_130px_rgba(255,255,255,0.9)] z-0"></div>
        </div>
        <div className="w-full absolute bottom-4 left-0 text-2xl text-black font-bold text-center">
          {getCurrentDomain()}
        </div>
      </div>
    );
  }
);

DownloadCard.displayName = "DownloadCard";

export default DownloadCard;
