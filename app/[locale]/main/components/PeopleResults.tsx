"use client";
import React, { useEffect, useState } from "react";
import PostView from "./PostView";
import PostViewSkeleton from "./PostViewSkeleton";
import { getPosts } from "@/app/libs/request";
import { useSearchParams } from "next/navigation";

export interface TwitterPost {
  /**
   * 推文内容
   */
  content: string;
  created_at: string;
  /**
   * 推文语言
   */
  language: string;
  like: number;
  /**
   * 图片
   */
  medias: string[];
  quote: number;
  replay: number;
  repost: number;
  user: User;
  views: number;
}

export interface User {
  /**
   * 位置
   */
  location: string;
  /**
   * @昵称
   */
  name: string;
  /**
   * 头像
   */
  profile_image_url: string;
  /**
   * @后的名字
   */
  screen_name: string;
  /**
   * 是不是已经认证
   */
  verified: boolean;
}

export default function PeopleResults() {
  const searchParams = useSearchParams();
  const [postIds, setPostIds] = useState<string[]>([
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
    "1955879928337232130",
  ]);
  const [posts, setPosts] = useState<TwitterPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      // 并发获取所有推文数据
      const promises = postIds.map((id) =>
        getPosts({
          tweet_id: id,
        }),
      );

      const results = await Promise.all(promises);
      const allPosts: TwitterPost[] = [];

      results.forEach((res) => {
        if (res.code === 200 && Array.isArray(res.data)) {
          allPosts.push(...res.data);
        } else if (res.code === 200 && res.data) {
          // 如果返回的是单个对象而不是数组
          allPosts.push(res.data);
        }
      });

      setPosts(allPosts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error setting dashboard data:", error);
      // 确保 posts 始终是数组
      setPosts([]);
    }
  };

  useEffect(() => {
    // 检查URL参数，如果有username参数就不请求数据
    const usernameFromUrl = searchParams.get("username");
    if (usernameFromUrl) {
      setIsLoading(false);
      setPosts([]);
      return;
    }

    getData();
  }, [searchParams]);

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 10 }, (_, index) => (
        <PostViewSkeleton key={`skeleton-${index}`} />
      ));
    }
    return posts.map((post, index) => <PostView key={index} post={post} />);
  };

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      {(isLoading || posts.length > 0) && (
        <>
          <h1 className="text-base sm:text-2xl font-pp text-center">
            People's Results
          </h1>
          <div className="w-full flex items-center">
            <div
              className="flex items-center gap-2 sm:gap-4 animate-scroll-left pl-2 sm:pl-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {renderContent()}
            </div>
            <div
              className="flex items-center gap-2 sm:gap-4 animate-scroll-left pl-2 sm:pl-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {renderContent()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
