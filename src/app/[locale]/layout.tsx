// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
// import { NextIntlClientProvider } from "next-intl";
// // import { notFound } from "next/navigation";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Djofo Dashboard",
//   description: "Admin dashboard for Djofo website",
// };

// async function getMessages(locale: string) {
//   try {
//     return (await import(`@/messages/${locale}.json`)).default;
//   } catch {
//     // Fallback to default locale messages instead of using notFound()
//     return (await import(`@/messages/en.json`)).default;
//   }
// }

// export default async function RootLayout(props: { children: React.ReactNode; params: Record<string, string>; }) {
//   const { children, params } = props;
//   const { locale } = params;
//   const messages = await getMessages(locale);

//   return (
//     <html lang={locale} suppressHydrationWarning>
//       <body className={inter.className} suppressHydrationWarning>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <NextIntlClientProvider locale={locale} messages={messages}>
//             {children}
//           </NextIntlClientProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// } 

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Djofo Dashboard",
  description: "Admin dashboard for Djofo website",
};

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    return (await import(`@/messages/en.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(params.locale);

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}