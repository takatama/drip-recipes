import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drip Recipes: Your Guide to Perfect Pour-Over Coffee",
  description: "Drip Recipes is an intuitive coffee brewing app that provides expertly crafted pour-over recipes, including the 4:6 method and other popular techniques. Achieve consistent, café-quality coffee at home with precise step-by-step guidance, customizable brewing parameters, and expert tips for the perfect pour.",
  icons: { icon: "/favicon.svg" },
};

import React from "react";
import { SettingsProvider } from "../context/SettingsContext";
import AppThemeWrapper from "../components/AppThemeWrapper";

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body className={`${raleway.variable}`}>
        <AppRouterCacheProvider>
          <NextIntlClientProvider messages={messages}>
            <SettingsProvider>
              <AppThemeWrapper>
                {children}
              </AppThemeWrapper>
            </SettingsProvider>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}