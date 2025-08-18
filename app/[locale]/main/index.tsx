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
import KolChart from "./components/KolChart";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/app/shadcn/lib/utils";
import { Logo } from "@/app/assets/svg";

export default function Home() {
  const t = useTranslations("HomePage");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<IGetPriceData | null>(null);
  const [showPeopleResults, setShowPeopleResults] = useState(true);
  const { toast } = useToast();

  const handleCheck = async (usernameParam?: string) => {
    try {
      const targetUsername = usernameParam || username;
      if (!targetUsername) {
        toast({
          title: "Please enter a username",
        });
        return;
      }

      setIsLoading(true);

      // 更新URL参数
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("username", targetUsername);
      router.replace(`?${newParams.toString()}`);

      // 延迟1秒后隐藏PeopleResults
      setTimeout(() => {
        setShowPeopleResults(false);
      }, 1000);

      const res = await getPrice({ screen_name: targetUsername });
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

  // 页面初始化时检查URL参数
  useEffect(() => {
    const usernameFromUrl = searchParams.get("username");
    if (usernameFromUrl) {
      setUsername(usernameFromUrl);
      // 自动执行检查
      handleCheck(usernameFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="flex items-center justify-center gap-2 flex-col my-auto sm:p-0 px-2 transition-all duration-300 w-full">
        <h1 className="text-xl sm:text-3xl font-pp text-primary text-center pt-10">
          Tweet Value Checker
        </h1>
        <span className="text-muted-foreground text-md sm:text-xl">
          AI that estimates the true commercial value of any Twitter (𝕏) post.
        </span>
        <div
          className="flex items-center justify-between gap-2 p-1 sm:p-2 border border-border rounded-xl sm:rounded-2xl shadow-md mt-4 sm:mt-10 transition-all duration-500 bg-background min-w-[300px] sm:min-w-[500px] mb-6"
          // style={{
          //   width: `${containerWidth}px`,
          // }}
        >
          <div className="flex items-center gap-1 w-full">
            <span className="sm:text-xl text-base">@</span>
            <div className="w-full flex items-center justify-between gap-1">
              <Input
                className="border-none text-base sm:text-xl w-full px-0 py-0 h-auto font-sf"
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
                    // 清除URL参数
                    const newParams = new URLSearchParams(
                      searchParams.toString(),
                    );
                    newParams.delete("username");
                    const newUrl = newParams.toString()
                      ? `?${newParams.toString()}`
                      : window.location.pathname;
                    router.replace(newUrl);
                  }}
                />
              )}
            </div>
          </div>
          <Button
            className="sm:rounded-xl rounded-lg text-md sm:text-lg !h-auto p-2 py-1 sm:py-2 gap-1 sm:gap-2"
            onClick={() => handleCheck()}
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
              // exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <KolChart data={price} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPeopleResults && !price && (
          <motion.div
            className={cn("mt-auto w-full", price && "hidden")}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <AnimateOnView animation="fade-up" distance={10}>
              <PeopleResults />
            </AnimateOnView>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-center relative z-1">
        <span className="text-md text-muted-foreground flex items-center gap-0">
          Powered by <Logo className="w-4 h-4" />
          <a
            href="https://linkol.ai"
            target="_blank"
            className="font-sf-bold cursor-pointer text-foreground hover:underline"
          >
            Linkol
          </a>
        </span>
      </div>
    </div>
  );
}
