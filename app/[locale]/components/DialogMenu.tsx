"use client";
import {
  Sheet,
  SheetDescription,
  SheetTrigger,
} from "@/app/shadcn/components/ui/sheet";
import { Button } from "@/app/shadcn/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/shadcn/components/ui/sheet";
import { Link, usePathname } from "@/app/i18n/routing";
import { LogoHorizontalPrimary } from "@/app/assets/svg";
import { cn } from "@/app/shadcn/lib/utils";

export default function DialogMenu({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="items-center justify-center gap-2 sm:hidden flex !p-2 !h-auto"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <LogoHorizontalPrimary className="h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full bg-primary/5 hover:bg-primary/10 hover:text-white",
                  pathname === "/" && "bg-primary/40 hover:bg-primary/50"
                )}
              >
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/rank">
              <Button
                variant="ghost"
                className={cn(
                  "w-full bg-primary/5 hover:bg-primary/10 hover:text-white",
                  pathname === "/rank" && "bg-primary/40 hover:bg-primary/50"
                )}
              >
                <span>Leaderboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
