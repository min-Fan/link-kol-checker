import { IGetPriceData } from "@/app/libs/request";
import React, { useRef, useState } from "react";
import { CommLineChart } from "./CommLineChart";
import { Button } from "@/app/shadcn/components/ui/button";
import { CopyIcon, DownloadIcon, ShareIcon, Loader2Icon } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/app/shadcn/hooks/use-toast";

export default function KolChart({ data }: { data: IGetPriceData }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const shareOnX = () => {
    const url = `https://x.com/intent/post?text=My linkol price: ${encodeURIComponent(
      window.location.href
    )}`;
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
            // 创建ClipboardItem并复制到剪贴板
            const clipboardItem = new ClipboardItem({
              [blob.type]: blob,
            });
            await navigator.clipboard.write([clipboardItem]);

            toast({
              title: "Copy successful",
              description: "Chart has been copied to clipboard",
            });
          } catch (clipboardError) {
            // 如果剪贴板API不支持，尝试使用传统方法
            try {
              const dataUrl = canvas.toDataURL("image/png");
              await navigator.clipboard.writeText(dataUrl);
              toast({
                title: "Copy successful",
                description: "Chart URL has been copied to clipboard",
              });
            } catch (fallbackError) {
              throw new Error("Clipboard API not supported");
            }
          }
        }
      }, "image/png");
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("复制失败:", error);
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
        description: "Chart has been downloaded successfully",
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
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <div
        ref={chartRef}
        className="flex items-center justify-center gap-2 flex-col p-4 pb-2 border bg-background border-border rounded-xl sm:rounded-2xl shadow-lg mt-2"
      >
        <h1 className="sm:text-2xl text-xl font-bold text-center font-sf">
          @{data.kol.screen_name}'s tweet value:{" "}
          <span className="text-primary font-bold font-sf-bold">
            ${data.current_value}
          </span>
        </h1>
        <p className="sm:text-base text-md text-muted-foreground text-center">
          AI ranks you above {data.leading_percentage}% of KOLs
        </p>
        <div className="w-full sm:w-[600px]">
          <CommLineChart data={data} />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          price.linkol.ai
        </p>
      </div>
      <div className="w-full flex items-center justify-between gap-2 pb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="rounded-full flex items-center h-auto py-1 text-md"
            variant="outline"
            onClick={copyChart}
            disabled={isCopying}
          >
            {isCopying ? (
              <Loader2Icon className="w-4 h-4 mr-2" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
            <span>{isCopying ? "Copying..." : "Copy"}</span>
          </Button>
          <Button
            className="rounded-full flex items-center h-auto py-1 text-md"
            variant="outline"
            onClick={downloadChart}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2Icon className="w-4 h-4 mr-2" />
            ) : (
              <DownloadIcon className="w-4 h-4" />
            )}
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </Button>
          <Button
            variant="outline"
            className="rounded-full flex items-center h-auto py-1 text-md"
            onClick={shareOnX}
          >
            <ShareIcon className="w-4 h-4" />
            <span>Share on 𝕏</span>
          </Button>
        </div>
        <Button
          className="rounded-full flex items-center h-auto py-1 text-md"
          onClick={() => {
            window.open("https://x.com/linkol_ai", "_blank");
          }}
        >
          <p>
            Made by <span className="font-bold font-sf-bold">LINKOL</span>
          </p>
        </Button>
      </div>
    </div>
  );
}
