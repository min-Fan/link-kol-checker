"use client";

import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useAppDispatch } from "@/app/store/hooks";
import {
  updateIsLoggedIn,
  updateTwitterFullProfile,
} from "@/app/store/reducers/userSlice";
import { ILoginParams, login as loginApi } from "@/app/libs/request";
import { useEffect } from "react";
import { useToast } from "@/app/shadcn/hooks/use-toast";
import { setAuthToken, clearAuthToken } from "@/app/libs/utils";

// 自定义hook处理登录状态
function PrivyLoginHandler() {
  const { user, authenticated, logout } = usePrivy();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (authenticated && user?.twitter) {
        try {
          // 调用后端登录接口
          const loginParams = {
            name: user.twitter.name,
            profile_image_url: user.twitter.profilePictureUrl,
            username: user.twitter.username,
            x_user_id: user.twitter.subject,
          };

          const response = await loginApi(loginParams as ILoginParams);

          if (response.data) {
            // 登录成功，更新store状态
            dispatch(updateIsLoggedIn(true));
            dispatch(updateTwitterFullProfile(user.twitter));
            setAuthToken(response.data.token);
          }
        } catch (error) {
          console.error("Login failed:", error);
          // 登录失败，清理状态
          dispatch(updateIsLoggedIn(false));
          dispatch(updateTwitterFullProfile(null));
          clearAuthToken();

          toast({
            title: "Login failed",
            description: "Please try again later",
          });
          logout();
        }
      } else if (!authenticated) {
        // 用户未认证，清理状态
        dispatch(updateIsLoggedIn(false));
        dispatch(updateTwitterFullProfile(null));
        clearAuthToken();
      }
    };

    handleLoginSuccess();
  }, [authenticated, user, dispatch]);

  return null;
}

export default function PrivyProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
      config={{
        loginMethods: ["twitter"],
        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
        },
      }}
    >
      <PrivyLoginHandler />
      {children}
    </PrivyProvider>
  );
}
