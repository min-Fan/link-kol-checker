"use client";
import { Button } from "@/app/shadcn/components/ui/button";
import { Input } from "@/app/shadcn/components/ui/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useMemo } from "react";
import PeopleResults from "./components/PeopleResults";
import AnimateOnView from "@/app/components/comm/AnimateOnView";
import { AnimatePresence, motion } from "motion/react";
import { getPrice, IGetPriceData } from "@/app/libs/request";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/app/shadcn/lib/utils";
import { PixelartArrowRight, PixelartLoader } from "@/app/assets/svg";
import FaultyTerminal from "@/app/components/FaultyTerminal/FaultyTerminal";
import MainContentContext from "@/app/context/MainContentContext";
import KolCardView from "./components/KolCardView";
import DialogDisclaimer from "./components/dialog/DialogDisclaimer";

// 缓存的 FaultyTerminal 组件，防止因为页面数据改变而重新渲染
const CachedFaultyTerminal = React.memo(() => {
  const terminalProps = useMemo(
    () => ({
      scale: 2.7,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 0.4,
      pause: false,
      scanlineIntensity: 0.5,
      glitchAmount: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0.35,
      tint: "#007AFF",
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: false,
      brightness: 0.6,
    }),
    [],
  );

  return <FaultyTerminal {...terminalProps} />;
});

CachedFaultyTerminal.displayName = "CachedFaultyTerminal";

export default function Home() {
  const t = useTranslations("HomePage");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<IGetPriceData | null>(null);
  const [showPeopleResults, setShowPeopleResults] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
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

      // 延迟一点时间后隐藏PeopleResults，让进入动画有时间完成
      setTimeout(() => {
        setShowPeopleResults(false);
      }, 500);

      const res: any = await getPrice({
        screen_name: targetUsername,
        source: "web",
      });
      if (res.code === 200 && res.data) {
        setPrice(res.data);
      } else {
        toast({
          title: "Failed to check",
          description: res.msg,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to check",
        description:
          "This username can’t be analyzed. It may not exist or is not public. Please try another one.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // 先清除价格数据，触发退出动画
    setPrice(null);

    // 延迟一点时间再更新其他状态，让退出动画有时间完成
    setTimeout(() => {
      setUsername("");
      setShowPeopleResults(true);
      // 清除URL参数
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("username");
      const newUrl = newParams.toString()
        ? `?${newParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    }, 300); // 给退出动画300ms的时间
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
    <>
      <div className="w-full h-full absolute z-0 inset-0">
        <CachedFaultyTerminal />
        <div className="w-full h-full absolute z-0 inset-0 bg-black/60 pointer-events-none"></div>
      </div>
      <MainContentContext className="flex flex-col items-center justify-start">
        <AnimatePresence mode="wait" initial={false}>
          {!price ? (
            <motion.div
              key="input-form"
              className="flex items-center justify-center gap-1 flex-col sm:p-0 px-2 my-auto transition-all duration-300 w-full z-10"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                opacity: { duration: 0.3 },
                y: { duration: 0.5 },
                scale: { duration: 0.4 },
              }}
            >
              <h1 className="text-xl sm:text-3xl text-center pt-10 font-[840]">
                What’s Your{" "}
                <span className="text-primary">One Tweet Worth</span>?
              </h1>
              <span className="text-md sm:text-base text-center font-[700]">
                One Tweet. One Price. AI values your tweet.
              </span>
              <div className="flex flex-col items-center justify-between gap-2 p-1 sm:p-2 shadow-md mt-4 sm:mt-10 transition-all duration-500 min-w-[300px] sm:min-w-[400px] mb-6">
                <div className="flex items-center justify-center gap-1 w-full border border-foreground p-4 bg-background/5 backdrop-blur-sm">
                  <span className="sm:text-base text-base font-sf">@</span>
                  <div className="flex items-center justify-between gap-1">
                    <Input
                      className="border-none text-base sm:text-base w-auto px-0 py-0 h-auto"
                      placeholder="Enter twitter handle"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.replace(/\s/g, ""))
                      }
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleCheck();
                        }
                      }}
                    />
                    {username && (
                      <X
                        className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={handleReset}
                      />
                    )}
                  </div>
                </div>
                <Button
                  className="text-md sm:text-lg !h-14 p-2 py-1 sm:py-2 gap-1 sm:gap-2 w-full bg-foreground text-background !rounded-none hover:bg-foreground/90 !transition-all duration-300"
                  onClick={() => handleCheck()}
                  disabled={isLoading}
                >
                  <span className="whitespace-nowrap">
                    {isLoading ? "Checking" : "Check your tweet value now"}
                  </span>
                  {isLoading ? (
                    <PixelartLoader className="animate-spin w-6 h-6" />
                  ) : (
                    <PixelartArrowRight className="w-6 h-6" />
                  )}
                </Button>
                <span
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Disclaimer
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-card"
              className="flex items-center justify-center gap-1 flex-col sm:p-0 px-2 my-auto transition-all duration-300 w-full z-10"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                opacity: { duration: 0.3 },
                y: { duration: 0.5 },
                scale: { duration: 0.4 },
              }}
            >
              <KolCardView
                data={price}
                onReset={handleReset}
                onDataUpdate={(newData) => setPrice(newData)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {showPeopleResults && !price && (
            <motion.div
              key="people-results"
              className={cn("mt-auto w-full", price && "hidden")}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                opacity: { duration: 0.4 },
                y: { duration: 0.6 },
                scale: { duration: 0.5 },
              }}
            >
              <AnimateOnView animation="fade-up" distance={10}>
                <PeopleResults />
              </AnimateOnView>
            </motion.div>
          )}
        </AnimatePresence>
      </MainContentContext>
      <DialogDisclaimer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
