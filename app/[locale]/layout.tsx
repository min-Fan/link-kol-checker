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

export const metadata = {
  title: "LinKol Checker",
  description: "LinKol Checker",
};

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
          </WagmiProviderContext>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
