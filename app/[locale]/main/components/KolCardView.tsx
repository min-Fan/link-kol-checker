import { IGetPriceData } from "@/app/libs/request";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/app/shadcn/components/ui/button";
import {
  CopyIcon,
  DownloadIcon,
  ShareIcon,
  Loader2Icon,
  RefreshCcw,
} from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/app/shadcn/hooks/use-toast";
import KolCard from "./KolCard";
import ProfileCard from "@/app/components/ProfileCard/ProfileCard";
import {
  Dislike,
  DislikeBold,
  Like,
  LikeBold,
  Logo,
  TwitterX,
} from "@/app/assets/svg";
import DownloadCard from "./DownloadCard";
import DialogConfimPrice from "./dialog/DialogConfimPrice";
import { useAppSelector } from "@/app/store/hooks";

export default function KolCardView({
  data,
  onReset,
  onDataUpdate,
}: {
  data: IGetPriceData;
  onReset: () => void;
  onDataUpdate?: (newData: IGetPriceData) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLikeHovered, setIsLikeHovered] = useState(false);
  const [isDislikeHovered, setIsDislikeHovered] = useState(false);
  const [clipboardSupported, setClipboardSupported] = useState<boolean | null>(
    null,
  );

  // 检测Clipboard API支持状态
  useEffect(() => {
    const checkClipboardSupport = async () => {
      try {
        // 检查是否支持现代Clipboard API
        const hasClipboard = !!(navigator.clipboard && window.ClipboardItem);
        setClipboardSupported(hasClipboard);

        if (!hasClipboard) {
          console.log("Clipboard API not supported, will use fallback methods");
        }
      } catch (error) {
        console.log("Clipboard support check failed:", error);
        setClipboardSupported(false);
      }
    };

    checkClipboardSupport();
  }, []);

  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const twitter_full_profile = useAppSelector(
    (state) => state.userReducer.twitter_full_profile,
  );

  const shareOnX = () => {
    const str = `AI priced my tweet at $${data.current_value}. What's yours worth? \n👉 ${window.location.href}`;
    const url = `https://x.com/intent/post?text=${encodeURIComponent(str)}`;
    window.open(url, "_blank");
  };

  const copyChart = async () => {
    if (!chartRef.current) return;

    setIsCopying(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2, // 高质量
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // 将canvas转换为blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // 尝试使用现代Clipboard API
            if (navigator.clipboard && window.ClipboardItem) {
              const clipboardItem = new ClipboardItem({
                [blob.type]: blob,
              });
              await navigator.clipboard.write([clipboardItem]);

              toast({
                title: "Copy successful",
                description: "Card has been copied to clipboard",
              });
            } else {
              // 降级方案：尝试复制图片到剪贴板
              throw new Error("Clipboard API not supported");
            }
          } catch (clipboardError) {
            console.log(
              "Modern clipboard failed, trying fallback:",
              clipboardError,
            );

            try {
              // 降级方案1：尝试使用canvas的toBlob方法复制
              const dataUrl = canvas.toDataURL("image/png");

              // 创建一个临时的textarea来复制图片URL
              const textArea = document.createElement("textarea");
              textArea.value = dataUrl;
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              textArea.style.top = "-999999px";
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();

              const successful = document.execCommand("copy");
              document.body.removeChild(textArea);

              if (successful) {
                toast({
                  title: "Copy successful",
                  description: "Card URL has been copied to clipboard",
                });
              } else {
                throw new Error("execCommand copy failed");
              }
            } catch (fallbackError) {
              console.log("Fallback copy failed:", fallbackError);

              // 最后的降级方案：提示用户手动保存
              toast({
                title: "Copy not supported",
                description: "Please right-click the card and save as image",
                variant: "destructive",
              });
            }
          }
        }
      }, "image/png");
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to generate card image. Please try again.",
        variant: "destructive",
      });
      console.error("Canvas generation failed:", error);
    } finally {
      setIsCopying(false);
    }
  };

  const downloadChart = async () => {
    if (!chartRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2, // 高质量
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // 创建下载链接
      const link = document.createElement("a");
      link.download = `@${data.kol.screen_name}_linkol_price.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Download successful",
        description: "Card has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("下载失败:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full sm:w-auto">
      <h1 className="text-center sm:text-4xl text-2xl font-bold mt-10 sm:mt-0">
        Your Tweet Value
      </h1>
      <div className="flex items-center justify-center flex-col relative">
        <DownloadCard
          data={data}
          className="w-[800px] h-[800px] fixed top-[-200%] left-[-200%]"
          ref={chartRef}
        />
        <ProfileCard
          avatarUrl={data.kol.profile_image_url}
          iconUrl="https://check.linkol.fun/linkol-logoicon-dark.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => console.log("Contact clicked")}
          data={data}
        />
        {!data.is_do_accepted &&
          isLoggedIn &&
          twitter_full_profile &&
          twitter_full_profile.username === data.kol.screen_name && (
            <div className="absolute bottom-0 -right-20 z-10 items-center justify-center gap-6 flex-col sm:flex hidden">
              <div
                className="cursor-pointer hover:scale-110 transition-all duration-300"
                onMouseEnter={() => setIsLikeHovered(true)}
                onMouseLeave={() => setIsLikeHovered(false)}
                onClick={() => setIsOpen(true)}
              >
                {isLikeHovered ? (
                  <LikeBold className="w-12 h-12" />
                ) : (
                  <Like className="w-12 h-12" />
                )}
              </div>
              <div
                className="cursor-pointer hover:scale-110 transition-all duration-300"
                onMouseEnter={() => setIsDislikeHovered(true)}
                onMouseLeave={() => setIsDislikeHovered(false)}
                onClick={() => setIsOpen(true)}
              >
                {isDislikeHovered ? (
                  <DislikeBold className="w-12 h-12" />
                ) : (
                  <Dislike className="w-12 h-12" />
                )}
              </div>
            </div>
          )}
        {!data.is_do_accepted &&
          isLoggedIn &&
          twitter_full_profile &&
          twitter_full_profile.username === data.kol.screen_name && (
            <div className="items-center justify-between gap-4 sm:hidden flex w-full px-10 mt-4">
              <div
                className="cursor-pointer hover:scale-110 transition-all duration-300"
                onMouseEnter={() => setIsLikeHovered(true)}
                onMouseLeave={() => setIsLikeHovered(false)}
                onClick={() => setIsOpen(true)}
              >
                {isLikeHovered ? (
                  <LikeBold className="w-6 h-6" />
                ) : (
                  <Like className="w-6 h-6" />
                )}
              </div>
              <div
                className="cursor-pointer hover:scale-110 transition-all duration-300"
                onMouseEnter={() => setIsDislikeHovered(true)}
                onMouseLeave={() => setIsDislikeHovered(false)}
                onClick={() => setIsOpen(true)}
              >
                {isDislikeHovered ? (
                  <DislikeBold className="w-6 h-6" />
                ) : (
                  <Dislike className="w-6 h-6" />
                )}
              </div>
            </div>
          )}
      </div>
      <div className="w-full flex items-center justify-center gap-2 pb-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Button
            className="flex items-center py-1 text-md !h-10"
            variant="outline_foreground"
            onClick={onReset}
          >
            <RefreshCcw className="w-6 h-6 mr-2" />
            <span>Try again</span>
          </Button>
          <Button
            className="flex items-center py-1 text-md !h-10"
            variant="outline_foreground"
            onClick={copyChart}
            disabled={isCopying}
          >
            {isCopying ? (
              <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <CopyIcon className="w-6 h-6" />
            )}
            <span>{isCopying ? "Copying..." : "Copy"}</span>
          </Button>
          <Button
            className="flex items-center py-1 text-md !h-10"
            variant="outline_foreground"
            onClick={downloadChart}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <DownloadIcon className="w-6 h-6" />
            )}
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </Button>
          <Button
            variant="outline_foreground"
            className="flex items-center py-1 text-md !h-10"
            onClick={shareOnX}
          >
            {/* 𝕏 */}
            <TwitterX className="w-6 h-6" />
            <span>Share</span>
          </Button>
        </div>
        {/* <Button
          className="rounded-full flex items-center h-auto py-1 text-md"
          onClick={() => {
            window.open("https://x.com/linkol_ai", "_blank");
          }}
        >
          <p>
            Made by <span className="font-bold font-sf-bold">LINKOL</span>
          </p>
        </Button> */}
      </div>
      <DialogConfimPrice
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
        onDataUpdate={(newData) => {
          // 更新父组件的数据
          if (onDataUpdate) {
            onDataUpdate(newData);
          }
        }}
      />
    </div>
  );
}
