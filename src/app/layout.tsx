import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

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
import { SettingsProvider } from "../contexts/SettingsContext";
import AppThemeWrapper from "../components/AppThemeWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${raleway.variable}`}>
        <AppRouterCacheProvider>
          <SettingsProvider>
            <AppThemeWrapper>
              {children}
            </AppThemeWrapper>
          </SettingsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}