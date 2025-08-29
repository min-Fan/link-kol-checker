import { copy, formatDateYMDHMS } from "@/app/libs/utils";
import { useTranslations } from "next-intl";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import defaultAvatar from "@/app/assets/img/avatar.png";
import { cn } from "@/app/shadcn/lib/utils";
import { Logo } from "@/app/assets/svg";
import cardBg from "@/app/assets/img/card-bg.png";
import logoBorder from "@/app/assets/img/logo-border.png";
import { IGetPriceData } from "@/app/libs/request";

export default function KolCard({
  data,
  className,
}: {
  data: IGetPriceData;
  className?: string;
}) {
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
          <div className="!rounded-md overflow-hidden flex items-center justify-center w-[140px] h-[140px]">
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

        {/* 品牌名称 */}
        <div className="text-white text-center font-kyiv">
          <div
            id="brand-name"
            className="text-xl font-bold mb-1 truncate max-w-[230px] text-ellipsis text-center whitespace-nowrap cursor-pointer"
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
            {data?.kol?.name}
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

      {/* 价格显示 */}
      <div className="flex justify-center flex-col items-center mt-5 pb-20">
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
          <span className="text-xs text-primary !scale-90">AI</span>
        </div>
      </div>
    </div>
  );
}
