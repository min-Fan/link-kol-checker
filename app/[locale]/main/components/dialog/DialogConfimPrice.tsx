"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/shadcn/components/ui/button";
import { Input } from "@/app/shadcn/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/app/shadcn/components/ui/dialog";
import { useAppSelector } from "@/app/store/hooks";
import { Fail, Success, TwitterX } from "@/app/assets/svg";
import { usePrivy } from "@privy-io/react-auth";
import {
  IGetPriceData,
  IAcceptPriceParams,
  acceptPrice,
  getPrice,
} from "@/app/libs/request";
import { useToast } from "@/app/shadcn/hooks/use-toast";

interface DialogConfimPriceProps {
  isOpen: boolean;
  onClose: () => void;
  data: IGetPriceData;
  onDataUpdate?: (newData: IGetPriceData) => void;
}

type DialogState =
  | "confirm"
  | "expected-price"
  | "contact-info"
  | "success"
  | "error"
  | "already-completed"
  | "unauthorized";

export default function DialogConfimPrice({
  isOpen,
  onClose,
  data,
  onDataUpdate,
}: DialogConfimPriceProps) {
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const twitterFullProfile = useAppSelector(
    (state) => state.userReducer.twitter_full_profile,
  );
  const { login } = usePrivy();
  const { toast } = useToast();

  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(data.current_value);
  const [contactInfo, setContactInfo] = useState({
    twitter: "",
    telegram: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // 邮箱格式验证函数
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 当data变化时更新currentPrice
  useEffect(() => {
    setCurrentPrice(data.current_value);
  }, [data.current_value]);

  // 检查初始状态
  useEffect(() => {
    if (isOpen && data) {
      // 如果已经完成价格评价
      if (isLoggedIn && data.is_do_accepted) {
        setDialogState("already-completed");
        return;
      }

      // 如果已登录，检查用户名是否匹配
      if (isLoggedIn) {
        const twitterUsername = twitterFullProfile?.username;
        if (twitterUsername && twitterUsername !== data.kol.screen_name) {
          setDialogState("unauthorized");
          return;
        }
      }

      // 正常流程
      setDialogState("confirm");
    }
  }, [isOpen, data, isLoggedIn, twitterFullProfile?.username]);

  const handleVerifyClick = () => {
    if (!isLoggedIn) {
      // 如果未登录，打开Privy登录弹窗
      login();
      onClose();
    } else {
      // 如果已登录，直接跳转到联系信息页面
      setDialogState("contact-info");
    }
  };

  const handleNoClick = () => {
    setDialogState("expected-price");
  };

  const handleExpectedPriceConfirm = () => {
    if (!expectedPrice || isNaN(Number(expectedPrice))) {
      toast({
        title: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    // 更新当前价格为用户输入的价格
    setCurrentPrice(Number(expectedPrice));
    setDialogState("confirm");
  };

  const handleContactInfoSubmit = async () => {
    if (!contactInfo.email) {
      setEmailError(true);
      toast({
        title: "Please fill in your email address",
        variant: "destructive",
      });
      return;
    }

    // 验证邮箱格式
    if (!validateEmail(contactInfo.email)) {
      setEmailError(true);
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    await submitAcceptPrice(true, currentPrice);
  };

  const submitAcceptPrice = async (isAccepted: boolean, price: number) => {
    setIsLoading(true);
    try {
      const params: IAcceptPriceParams = {
        email: contactInfo.email,
        expected_price: price,
        is_accepted: isAccepted,
        telegram: contactInfo.telegram,
        tweet: contactInfo.twitter,
      };

      const response = await acceptPrice(params);

      if (response.data) {
        // 成功提交后，重新获取价格数据
        try {
          const newPriceData = await getPrice({
            screen_name: data.kol.screen_name,
          });
          if (newPriceData.data) {
            // 通知父组件数据已更新
            if (onDataUpdate) {
              onDataUpdate(newPriceData.data);
            }
          }
        } catch (error) {
          console.error("Failed to fetch updated price data:", error);
        }

        setDialogState("success");
      } else {
        setDialogState("error");
      }
    } catch (error) {
      console.error("提交失败:", error);
      setDialogState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setDialogState("confirm");
  };

  const handleClose = () => {
    // 重置所有状态
    setDialogState("confirm");
    setExpectedPrice("");
    setContactInfo({ twitter: "", telegram: "", email: "" });
    setCurrentPrice(data.current_value);
    setIsLoading(false);
    setEmailError(false);
    onClose();
  };

  const handleDone = () => {
    handleClose();
  };

  const shareOnX = () => {
    const str = `AI priced my tweet at $${data.current_value}. What's yours worth? \n👉 ${window.location.href}`;
    const url = `https://x.com/intent/post?text=${encodeURIComponent(str)}`;
    window.open(url, "_blank");
    handleClose();
  };

  const renderContent = () => {
    switch (dialogState) {
      case "confirm":
        return (
          <>
            <div className="flex flex-col text-center">
              <p className="text-base font-sf-bold">
                The AI valued your tweet at ${currentPrice.toLocaleString()}
              </p>
              <p className="text-base font-sf">
                Do you agree to receive offers based on this price?
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleNoClick}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                No
              </Button>
              <Button
                onClick={handleVerifyClick}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf gap-1"
              >
                <span className="font-sf">
                  {!isLoggedIn ? "Yes, Verify " : "Yes"}
                </span>
                {!isLoggedIn && <TwitterX className="w-5 h-5 text-white" />}
              </Button>
            </div>
          </>
        );

      case "expected-price":
        return (
          <>
            <div className="flex flex-col text-center">
              <p className="text-base font-sf-bold">Not satisfied?</p>
              <p className="text-base font-sf">
                What value do you expect for your tweet (USD)?
              </p>
              <div className="text-left mt-4">
                <label className="text-sm font-medium font-sf">
                  Expected Value Price ($ USD)
                </label>
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  className="mt-2 font-sf"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setDialogState("confirm")}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Back
              </Button>
              <Button
                onClick={handleExpectedPriceConfirm}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf"
              >
                Confirm
              </Button>
            </div>
          </>
        );

      case "contact-info":
        return (
          <>
            <div className="flex flex-col text-center">
              <p className="text-base font-sf-bold">Great!</p>
              <p className="text-base font-sf">
                We'll recommend projects at this price.
              </p>
              <p className="text-base font-sf">How should we contact you?</p>
              <div className="text-left mt-4 space-y-1">
                <div>
                  <label className="text-sm font-medium font-sf">
                    Email <span className="text-red">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={contactInfo.email}
                    onChange={(e) => {
                      setContactInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      // 清除错误状态
                      if (emailError) {
                        setEmailError(false);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value && !validateEmail(e.target.value)) {
                        setEmailError(true);
                        toast({
                          title: "Invalid email format",
                          description: "Please enter a valid email address",
                          variant: "destructive",
                        });
                      }
                    }}
                    className={`mt-1 font-sf ${
                      emailError ? "border-red focus:border-red" : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium font-sf">Twitter</label>
                  <Input
                    placeholder="Enter twitter"
                    value={contactInfo.twitter}
                    onChange={(e) =>
                      setContactInfo((prev) => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    className="mt-1 font-sf"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium font-sf">
                    Telegram
                  </label>
                  <Input
                    placeholder="Enter telegram handle"
                    value={contactInfo.telegram}
                    onChange={(e) =>
                      setContactInfo((prev) => ({
                        ...prev,
                        telegram: e.target.value,
                      }))
                    }
                    className="mt-1 font-sf"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setDialogState("confirm")}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Back
              </Button>
              <Button
                onClick={handleContactInfoSubmit}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf"
              >
                {isLoading ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </>
        );

      case "success":
        return (
          <>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full flex items-center justify-center">
                <Success />
              </div>
              <p className="text-base font-sf-bold">Preference Saved!</p>
              <p className="text-base font-sf">
                We'll recommend projects for you soon and contact you if a
                suitable match is found.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDone}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Done
              </Button>
              <Button
                onClick={shareOnX}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf gap-1"
              >
                <span className="font-sf">Share on</span>
                <TwitterX className="w-6 h-6 text-white" />
              </Button>
            </div>
          </>
        );

      case "error":
        return (
          <>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full flex items-center justify-center">
                <Fail />
              </div>
              <p className="text-base font-sf-bold">Submission Failed</p>
              <p className="text-base font-sf">
                Something went wrong. Please try again.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDone}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Close
              </Button>
              <Button
                onClick={handleRetry}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf"
              >
                Try Again
              </Button>
            </div>
          </>
        );

      case "already-completed":
        return (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full flex items-center justify-center mb-4">
                <Success />
              </div>
              <p className="text-base font-sf-bold">Price Already Set!</p>
              <p className="text-base font-sf">
                Great, thank you for your feedback.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDone}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Done
              </Button>
              <Button
                onClick={shareOnX}
                className="bg-primary hover:bg-primary/90 !h-auto flex-1 !rounded-md text-white font-sf gap-1"
              >
                <span className="font-sf">Share on</span>
                <TwitterX className="w-6 h-6 text-white" />
              </Button>
            </div>
          </>
        );

      case "unauthorized":
        return (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full flex items-center justify-center mb-4">
                <Fail />
              </div>
              <p className="text-base font-sf-bold">Unauthorized Access!</p>
              <p className="text-base font-sf">
                Only the corresponding Twitter account can be operated.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDone}
                className="border-border hover:bg-muted-foreground/10 !h-auto flex-1 !rounded-md font-sf"
              >
                Close
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    switch (dialogState) {
      case "confirm":
        return "Confirm Price";
      case "expected-price":
        return "Confirm Price";
      case "contact-info":
        return "Contact Info";
      case "success":
        return "Preference Saved!";
      case "error":
        return "Submission Failed";
      case "already-completed":
        return "Price Already Set!";
      case "unauthorized":
        return "Unauthorized Access";
      default:
        return "Confirm Price";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogClose asChild></DialogClose>
      <DialogContent
        className="border-border flex max-h-[90vh] w-[450px] max-w-full flex-col gap-0 overflow-hidden bg-transparent p-2 shadow-none sm:w-96 sm:max-w-full sm:p-0"
        nonClosable
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="bg-primary gap-0 rounded-t-lg p-2 text-center text-white sm:rounded-t-xl sm:p-4">
          <DialogTitle className="text-center text-base font-semibold text-white font-sf">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="bg-foreground space-y-4 rounded-b-lg p-6 sm:rounded-b-xl text-background">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
