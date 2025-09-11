"use client";

import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { Button } from "@/app/shadcn/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import avatar from "@/app/assets/img/avatar.png";
import {
  updateIsLoggedIn,
  updateTwitterFullProfile,
} from "@/app/store/reducers/userSlice";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import { clearAuthToken } from "@/app/libs/utils";

export default function UserInfo() {
  const { login, logout } = usePrivy();
  const twitterFullProfile = useAppSelector(
    (state) => state.userReducer.twitter_full_profile
  );
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    clearAuthToken();
    dispatch(updateIsLoggedIn(false));
    dispatch(updateTwitterFullProfile(null));
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center sm:gap-2 gap-1">
            <img
              src={twitterFullProfile?.profilePictureUrl || ""}
              alt="user"
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.src = avatar.src;
                e.currentTarget.className = "w-8 h-8 rounded-full";
              }}
            />
            <span className="text-sm sm:block hidden">
              {twitterFullProfile?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent hover:text-primary"
            onClick={handleLogout}
            size="sm"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent hover:text-primary"
          onClick={() => {
            login();
          }}
        >
          <span className="text-sm">Login</span>
          <LogIn className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
