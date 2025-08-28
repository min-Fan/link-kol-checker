import { copy, formatDateYMDHMS } from "@/app/libs/utils";
import { useTranslations } from "next-intl";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import defaultAvatar from "@/app/assets/img/avatar.png";
import { TwitterPost } from "./PeopleResults";
import { cn } from "@/app/shadcn/lib/utils";
import { Logo } from "@/app/assets/svg";
import cardBg from "@/app/assets/img/card-bg.png";
import logoBorder from "@/app/assets/img/logo-border.png";

export default function CardView({
  data,
  className,
}: {
  data: TwitterPost;
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
        className="text-sm font-medium z-10 flex justify-end text-primary text-right pt-2 scale-75 leading-none absolute top-0 right-0"
      >
        {new Date(data?.created_at)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, ".")}
      </div>

      {/* 中央Logo区域 */}
      <div className="flex flex-col items-center z-10 mt-9">
        {/* Logo背景圆圈 */}
        <div className="flex items-center justify-center mb-[7px] relative p-3">
          <div className="absolute inset-0 w-full h-full z-1">
            <img
              src={logoBorder.src}
              alt="Card Background"
              className="w-full h-full"
            />
          </div>

          {/* 用户头像 */}
          <div className="bg-white rounded-sm overflow-hidden flex items-center justify-center w-[93px] h-[93px]">
            <img
              id="user-avatar"
              src={
                data?.kol?.profile_image_url?.replace("_normal", "") ||
                defaultAvatar.src
              }
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 品牌名称 */}
        <div className="text-white text-center font-kyiv">
          <div id="brand-name" className="text-md font-bold mb-1">
            {data?.kol?.name}
          </div>
          <div
            id="username"
            className="text-xs font-bold cursor-pointer"
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
      <div className="flex justify-center flex-col items-center mt-5 pb-[50px]">
        <div id="price" className="text-white text-2xl font-bold leading-none">
          ${data?.current_value?.toLocaleString() || "0"}
        </div>
        <span className="text-xs text-primary scale-50 leading-none">
          Single Tweet Value by AI
        </span>
      </div>
    </div>
  );
}
