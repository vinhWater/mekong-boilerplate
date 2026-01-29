import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { ThemeProvider } from "@/components/providers/theme-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import LinkedInInsight from "@/components/LinkedInInsight";

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side for i18n pages
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <LinkedInInsight />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="theme-public"
      >
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
