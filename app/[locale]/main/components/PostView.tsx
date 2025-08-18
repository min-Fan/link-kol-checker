import React from "react";
import { ChartNoAxesColumn, Heart, MessageCircle, Repeat2 } from "lucide-react";
import defaultAvatar from "@/app/assets/img/avatar.png";
import { copy, formatDateYMDHMS, formatNumberKMB } from "@/app/libs/utils";
import { useTranslations } from "next-intl";
import { TwitterPost } from "./PeopleResults";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import { CommLineChart } from "./CommLineChart";

export default function PostView({ post }: { post: TwitterPost }) {
  const t = useTranslations("common");
  const { toast } = useToast();
  const renderImages = (medias: string[]) => {
    if (medias.length === 1) {
      return (
        <div className="mt-2">
          <img src={medias[0]} className="w-full rounded-xl object-cover" />
        </div>
      );
    }
    if (medias.length === 2) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {medias.map((item, i) => (
            <img
              key={i}
              src={item}
              className="h-40 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      );
    }
    if (medias.length === 3) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <img
            src={medias[0]}
            className="col-span-2 h-40 w-full rounded-xl object-cover"
          />
          {medias.slice(1).map((item, i) => (
            <img
              key={i}
              src={item}
              className="h-40 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      );
    }
    if (medias.length >= 4) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {medias.slice(0, 4).map((item, i) => (
            <img
              key={i}
              src={item}
              className="h-40 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="text-md bg-background/80 border-border/50 box-border flex h-full flex-col gap-2 rounded-2xl border p-2 sm:p-4 shadow-sm backdrop-blur-sm w-[300px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex w-full items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={post?.kol?.profile_image_url || ""}
              alt={post?.kol?.screen_name}
              className="size-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultAvatar.src;
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-0">
              <span
                className="text-base font-bold truncate max-w-[100px] cursor-pointer"
                onClick={() => {
                  copy(post?.kol?.name).then((success) => {
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
                {post?.kol?.name}
              </span>
              <span
                className="text-muted-foreground cursor-pointer text-sm truncate max-w-[80px]"
                onClick={() => {
                  copy(post?.kol?.screen_name).then((success) => {
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
                @{post?.kol?.screen_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={() => {
              window.open(`https://x.com/${post?.kol?.screen_name}`, "_blank");
            }}
          >
            𝕏
          </span>
          <span className="text-muted-foreground text-right text-sm whitespace-nowrap">
            {formatDateYMDHMS(new Date(post?.created_at).getTime())}
          </span>
        </div>
      </div>
      <div className="text-md w-full flex-1 flex flex-col">
        <div className="flex-1">
          <p>{post?.content}</p>
          {post?.medias && renderImages(post?.medias)}
        </div>
        {post?.data && (
          <div className="flex items-center justify-center gap-2 flex-col p-2 border bg-background rounded-xl sm:rounded-2xl mt-2">
            <h1 className="sm:text-base text-md font-bold text-center">
              @{post?.kol?.screen_name} linkol price{" "}
              <span className="text-primary font-bold">
                ${post?.current_value}
              </span>
            </h1>
            <p className="sm:text-sm text-sm text-muted-foreground text-center">
              Leading other KOL ({" "}
              {post?.leading_percentage >= 0 && post?.leading_percentage < 30
                ? "Bottom "
                : post?.leading_percentage > 30 && post?.leading_percentage < 70
                  ? "Middle "
                  : "Top "}
              {post?.leading_percentage}% )
            </p>
            <div className="w-full flex-1">
              <CommLineChart data={post} />
            </div>
          </div>
        )}
      </div>
      <div className="text-muted-foreground mt-auto flex items-center justify-between gap-1">
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{formatNumberKMB(post?.replay) || 0}</span>
        </div>
        <span>·</span>
        <div className="flex items-center space-x-1">
          <Repeat2 className="h-4 w-4" />
          <span>{formatNumberKMB(post?.repost) || 0}</span>
        </div>
        <span>·</span>
        <div className="flex items-center space-x-1">
          <Heart className="relative z-10 h-4 w-4" />
          <span>{formatNumberKMB(post?.like) || 0}</span>
        </div>
        <span>·</span>
        <div className="relative flex items-center space-x-1">
          <ChartNoAxesColumn className="relative z-10 h-4 w-4" />
          <span>{formatNumberKMB(post?.views || 0)}</span>
        </div>
      </div>
    </div>
  );
}
