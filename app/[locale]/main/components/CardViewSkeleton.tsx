import React from "react";
import { Skeleton } from "@/app/shadcn/components/ui/skeleton";

export default function CardViewSkeleton() {
  return (
    <div className="relative overflow-hidden w-[200px] h-[300px]">
      {/* 背景骨架 */}
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <Skeleton className="w-full h-full" />
      </div>

      {/* 日期骨架 */}
      <div className="text-sm font-medium z-10 flex justify-end text-primary text-right pt-2 scale-75 leading-none absolute top-0 right-0">
        <Skeleton className="h-4 w-20" />
      </div>

      {/* 中央Logo区域骨架 */}
      <div className="flex flex-col items-center z-10 mt-9">
        {/* Logo背景圆圈骨架 */}
        <div className="flex items-center justify-center mb-[7px] relative p-3">
          {/* 用户头像骨架 */}
          <div className="bg-primary/10 rounded-sm overflow-hidden flex items-center justify-center w-[93px] h-[93px]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        {/* 品牌名称骨架 */}
        <div className="text-white text-center font-kyiv">
          <div id="brand-name" className="text-md font-bold mb-1">
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
          <div id="username" className="text-xs font-bold">
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        </div>
      </div>

      {/* 价格显示骨架 */}
      <div className="flex justify-center flex-col items-center mt-5 pb-[50px]">
        <div id="price" className="text-white text-2xl font-bold leading-none">
          <Skeleton className="h-8 w-32" />
        </div>
        <span className="text-xs text-primary scale-50 leading-none">
          <Skeleton className="h-3 w-24 mx-auto" />
        </span>
      </div>
    </div>
  );
}
