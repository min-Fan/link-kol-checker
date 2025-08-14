"use client";
import { Button } from "@/app/shadcn/components/ui/button";
import { Input } from "@/app/shadcn/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useEffect } from "react";
import PeopleResults from "./components/PeopleResults";
import AnimateOnView from "@/app/components/comm/AnimateOnView";
import { AnimatePresence, motion } from "motion/react";
import { getPrice, IGetPriceData } from "@/app/libs/request";
import { useToast } from "@/app/shadcn/hooks/use-toast";

export default function Home() {
  const t = useTranslations("HomePage");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<IGetPriceData | null>(null);
  const [showPeopleResults, setShowPeopleResults] = useState(true);
  const [priceWidth, setPriceWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(300);
  const priceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    try {
      if (!username) {
        toast({
          title: "Please enter a username",
        });
        return;
      }
      setIsLoading(true);
      // 延迟1秒后隐藏PeopleResults
      setTimeout(() => {
        setShowPeopleResults(false);
      }, 1000);

      const res = await getPrice({ screen_name: username });
      if (res.code === 200 && res.data) {
        setPrice(res.data);
      } else {
        toast({
          title: "Failed to check",
          description: res.message,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to check",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 监听price变化，测量price宽度并设置容器宽度
  useEffect(() => {
    if (price && priceRef.current) {
      setPriceWidth(priceRef.current.offsetWidth);
      // 计算合适的容器宽度：price宽度 + 额外空间（至少300px）
      const newWidth = Math.max(priceRef.current.offsetWidth + 120, 300);
      setContainerWidth(newWidth);
    } else {
      setPriceWidth(0);
      // price不存在时，恢复到默认宽度
      setContainerWidth(300);
    }
  }, [price]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="flex items-center justify-center gap-2 flex-col my-auto sm:p-0 px-4 transition-all duration-300">
        <h1 className="text-xl sm:text-3xl font-pp text-primary text-center mt-10">
          Linkol Checker
        </h1>
        <span className="text-muted-foreground text-md sm:text-xl">
          Check the score of any Twitter (𝕏) user
        </span>
        <div
          className="flex items-center justify-between gap-2 p-1 sm:p-2 border border-border rounded-xl sm:rounded-2xl shadow-md mt-4 sm:mt-10 transition-all duration-500 bg-background min-w-[300px] sm:min-w-[500px]"
          style={{
            width: `${containerWidth}px`,
          }}
        >
          <div className="flex items-center gap-1 w-full">
            <span className="sm:text-xl text-base">@</span>
            <div className="w-full flex items-center justify-between gap-1">
              <Input
                className="border-none text-base sm:text-xl w-full px-0 py-0 h-auto"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {username && (
                <X
                  className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => {
                    setPrice(null);
                    setUsername("");
                    setShowPeopleResults(true);
                  }}
                />
              )}
            </div>
          </div>
          <Button
            className="sm:rounded-xl rounded-lg text-md sm:text-lg !h-auto p-2 py-1 sm:py-2 gap-1 sm:gap-2"
            onClick={handleCheck}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search className="w-4h-4" />
            )}
            <span className="">Check</span>
          </Button>
        </div>
        <AnimatePresence>
          {price && (
            <motion.div
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div
                ref={priceRef}
                className="flex items-center justify-center gap-2 h-[200px] whitespace-nowrap w-[800px]"
              >
                <span className="text-2xl font-pp">
                  Price: {price.current_value}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPeopleResults && !price && (
          <motion.div
            className="mt-auto w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <AnimateOnView animation="fade-up" distance={10}>
              <PeopleResults />
            </AnimateOnView>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
