"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/shadcn/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/app/shadcn/components/ui/pagination";
import { Skeleton } from "@/app/shadcn/components/ui/skeleton";
import avatar from "@/app/assets/img/avatar.png";
import React, { useEffect, useState } from "react";
import { copy, formatNumberKMB } from "@/app/libs/utils";
import { Top1, Top2, Top3, TwitterIcon } from "@/app/assets/svg";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import { useTranslations } from "next-intl";
import { rankList } from "@/app/libs/request";

export default function RankList() {
  const { toast } = useToast();
  const t = useTranslations("common");
  const tRank = useTranslations("rank");
  const [list, setList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const renderRank = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-start gap-2">
          <span className="sm:text-md text-sm">Top </span>
          <Top1 className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-start gap-2">
          <span className="sm:text-md text-sm">Top </span>
          <Top2 className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-start gap-2">
          <span className="sm:text-md text-sm">Top </span>
          <Top3 className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
      );
    } else {
      return <span className="sm:text-md text-sm">{rank}</span>;
    }
  };

  const getRankList = async (page: number = 1) => {
    try {
      setLoading(true);
      const res: any = await rankList({
        page,
        size: pageSize,
      });
      if (res.code === 200) {
        setList(res.data.list);
        setTotalItems(res.data.total || 0);
        setTotalPages(Math.ceil((res.data.total || 0) / pageSize));
        setCurrentPage(page);
      } else {
        toast({
          title: t("error_rank_list"),
          variant: "destructive",
          content: res.msg || t("error_retry"),
        });
      }
    } catch (error: any) {
      toast({
        title: t("error_rank_list"),
        variant: "destructive",
        content: error?.message || t("error_retry"),
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      getRankList(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数少于等于最大显示页数，显示所有页
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // 如果总页数大于最大显示页数，显示部分页
      if (currentPage <= 3) {
        // 当前页在前几页
        for (let i = 1; i <= 4; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后几页
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>,
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      } else {
        // 当前页在中间
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>,
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  useEffect(() => {
    getRankList();
  }, []);

  return (
    <div className="w-full px-2 sm:px-0 sm:w-[740px] flex flex-col items-center justify-start gap-4 border-t border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="sm:text-md text-sm text-foreground">
                {tRank("rank")}
              </span>
            </TableHead>
            <TableHead className="w-[50%]">
              <span className="sm:text-md text-sm text-foreground">
                {tRank("name")}
              </span>
            </TableHead>
            <TableHead>
              <span className="sm:text-md text-sm text-foreground">
                {tRank("price")}
              </span>
            </TableHead>
            <TableHead>
              <span className="sm:text-md text-sm text-foreground">
                {tRank("followers")}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // 使用Skeleton组件显示加载状态，支持移动端适配
            Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton className="w-6 h-4 sm:w-8 sm:h-6" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <Skeleton className="w-20 h-3 sm:w-24 sm:h-4" />
                      <Skeleton className="w-16 h-2 sm:w-20 sm:h-3" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-12 h-4 sm:w-16 sm:h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-4 sm:w-20 sm:h-6" />
                </TableCell>
              </TableRow>
            ))
          ) : list?.length > 0 ? (
            list.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {renderRank((currentPage - 1) * pageSize + index + 1)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-between w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                      <img
                        src={item.profile_image_url}
                        alt="avatar"
                        className="w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = avatar.src;
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                      <span className="sm:text-md text-sm text-foreground font-sf">
                        {item.name}
                      </span>
                      <span
                        className="sm:text-sm text-xs text-muted-foreground font-sf cursor-pointer"
                        onClick={() => {
                          copy("john_doe").then((success) => {
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
                        @{item.screen_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <TwitterIcon
                        className="w-4 h-4 sm:w-6 sm:h-6 text-foreground cursor-pointer"
                        onClick={() => {
                          window.open(
                            `https://x.com/${item.screen_name}`,
                            "_blank",
                          );
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="sm:text-md text-sm text-primary font-sf-bold">
                    ${item.price}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="sm:text-md text-sm">
                    {formatNumberKMB(item.followers_count)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // 空状态
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <span className="sm:text-md text-sm text-muted-foreground">
                  {tRank("no_data")}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 gap-4">
          <Pagination className="w-full sm:w-auto">
            <PaginationContent className="flex-wrap justify-center sm:justify-start">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`cursor-pointer min-w-[44px] h-[44px] sm:min-w-[32px] sm:h-[32px] flex items-center justify-center ${
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>

              {/* 移动端简化分页显示 */}
              <div className="hidden sm:flex">{renderPaginationItems()}</div>

              {/* 移动端显示当前页和总页数 */}
              <div className="sm:hidden flex items-center gap-2">
                <PaginationItem>
                  <PaginationLink
                    isActive={true}
                    className="flex items-center justify-center w-6 h-6"
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-muted-foreground text-sm">
                  {totalPages}
                </span>
              </div>

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`cursor-pointer min-w-[44px] h-[44px] sm:min-w-[32px] sm:h-[32px] flex items-center justify-center ${
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
