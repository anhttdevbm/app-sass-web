import "react-datepicker/dist/react-datepicker.css";
import "public/styles/index.css";
import "public/styles/html.css";
import "public/styles/date-picker.css";
import "highlight.js/styles/atom-one-dark.css";

import AppProvider from "contexts/AppProvider";
import { openSans } from "public/material/typography";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "constant/types";
import { NS_COMMON } from "constant/index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMMON);

  return {
    title: t("app.title"),
    description: t("app.description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  const messages = (await import(`dictionaries/${locale}`)).default;

  return (
    <html lang={locale}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <body suppressHydrationWarning={true} className={openSans.className}>
        <AppProvider locale={locale} messages={messages}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
