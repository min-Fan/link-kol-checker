import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/app/assets/font/index.scss";
import "@/app/[locale]/globals.scss";
import { Toaster } from "@/app/shadcn/components/ui/toaster";

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
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
