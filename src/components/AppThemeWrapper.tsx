"use client";
import React from "react";
import { useSettings } from "../context/SettingsContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#6D4C41" : "#A1887F",
      },
      secondary: {
        main: mode === "light" ? "#A1887F" : "#8D6E63",
      },
      background: {
        default: mode === "light" ? "#F5F5DC" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

export default function AppThemeWrapper({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSettings();
  const theme = getTheme(darkMode ? "dark" : "light");
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>;
}