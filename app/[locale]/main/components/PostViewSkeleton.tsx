import React from "react";
import { Skeleton } from "@/app/shadcn/components/ui/skeleton";

export default function PostViewSkeleton() {
  return (
    <div className="text-md bg-background/80 border-border/50 box-border flex flex-col gap-2 rounded-2xl border p-4 shadow-sm backdrop-blur-sm animate-pulse w-[300px] h-full">
      {/* 头部：头像、用户信息、时间 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex w-full items-center gap-2">
          {/* 头像骨架 */}
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              {/* 用户名骨架 */}
              <Skeleton className="h-4 w-24" />
              {/* @用户名骨架 */}
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        {/* 时间骨架 */}
        <Skeleton className="h-3 w-16" />
      </div>

      {/* 内容区域 */}
      <div className="w-full">
        {/* 文本内容骨架 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* 图片区域骨架 (模拟可能有图片) */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>

      {/* 底部互动数据骨架 */}
      <div className="mt-auto flex items-center justify-between gap-1">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-6" />
        </div>
        <Skeleton className="h-2 w-2 rounded-full" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-6" />
        </div>
        <Skeleton className="h-2 w-2 rounded-full" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-6" />
        </div>
        <Skeleton className="h-2 w-2 rounded-full" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}
