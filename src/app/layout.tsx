import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Restored: Import global styles
// import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

//i want you to create an admin dashboard for a website called djofo.bj that is the sreenshot of the site, this admin dashboard for djofo is a website that allows users to create contents and manage the site djofo. the dashboard should be built using next.js and do not use tailwindcss because given me errors lately use another css instead, and should include features such as user authentication, and the dashboard should also be responsive, make it professional, add themes for light and dark mode, and work well on mobile devices.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Djofo Dashboard",
  description: "Admin dashboard for Djofo website",
};

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // Fallback to default locale messages instead of using notFound()
    return (await import(`@/messages/en.json`)).default;
  }
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { children, params } = props;
  const { locale } = params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}