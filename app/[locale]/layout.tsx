import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/app/assets/font/index.scss";
import "@/app/[locale]/globals.scss";
import { Toaster } from "@/app/shadcn/components/ui/toaster";
import { ScrollArea } from "../shadcn/components/ui/scroll-area";
import CanvasBackground from "../components/background/CanvasBackground";
import Footer from "./components/footer";
import Nav from "./components/nav";
import WagmiProviderContext from "../context/WagmiProviderContext";
import { MiniKitContextProvider } from "../providers/MiniKitProvider";
import { Metadata } from "next";


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <WagmiProviderContext>
            <MiniKitContextProvider>
              <ScrollArea className="bg-background flex w-full h-screen flex-col bg-[radial-gradient(66.14%_90.55%_at_49.89%_100%,rgba(0,122,255,0.10)_0%,rgba(0,122,255,0.00)_100%)] shadow-[0px 4px 6px_0px_rgba(0,0,0,0.05)] backdrop-blur-[30px]">
                <div className="absolute inset-0 z-[0] w-full h-full">
                  <CanvasBackground />
                </div>
                <div className="relative z-[0] w-full">
                  <Nav />
                  {children}
                  <Footer />
                </div>
              </ScrollArea>
            </MiniKitContextProvider>
          </WagmiProviderContext>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    description: 'LinkKol Checker',
    other: {
      'fc:frame': JSON.stringify({
        version: '1.0.0',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
          action: {
            type: 'launch_frame',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}