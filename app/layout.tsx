import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { authOptions } from "./api/auth/[...nextauth]/auth";
import SessionProvider from "./components/SessionProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toast/toaster";
import Loading from "./loading";

import "./globals.css";

const notoSanThai = Noto_Sans_Thai({
  weight: ["100", "300", "200", "400", "700", "900"],
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "Truck Web",
  description: "Truck Web by SSL Logistic",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${notoSanThai.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <SessionProvider session={session}>{children}</SessionProvider>
            <Toaster />
            <Loading />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
