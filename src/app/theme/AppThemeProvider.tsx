import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme, alpha } from "@mui/material";
import { useColorMode } from "./useColorMode";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#6366f1",
            light: "#818cf8",
            dark: "#4f46e5",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#10b981",
            light: "#34d399",
            dark: "#059669",
            contrastText: "#ffffff",
          },
          error: { main: "#ef4444" },
          warning: { main: "#f59e0b" },
          success: { main: "#10b981" },
          info: { main: "#3b82f6" },
          background:
            mode === "light"
              ? { default: "#f8fafc", paper: "#ffffff" }
              : { default: "#0f172a", paper: "#1e293b" },
          text:
            mode === "light"
              ? { primary: "#0f172a", secondary: "#64748b" }
              : { primary: "#f1f5f9", secondary: "#94a3b8" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial"].join(","),
          h4: { fontWeight: 700, letterSpacing: "-0.02em" },
          h5: { fontWeight: 700, letterSpacing: "-0.01em" },
          h6: { fontWeight: 600 },
          overline: { fontWeight: 600, letterSpacing: "0.08em", fontSize: "0.7rem" },
        },
        shadows: [
          "none",
          mode === "light"
            ? "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)"
            : "0 1px 3px rgba(0,0,0,0.3)",
          mode === "light"
            ? "0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)"
            : "0 4px 6px rgba(0,0,0,0.3)",
          mode === "light"
            ? "0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.04)"
            : "0 10px 15px rgba(0,0,0,0.3)",
          ...Array(21).fill("none"),
        ] as Parameters<typeof createTheme>[0]["shadows"],
        components: {
          MuiCard: {
            defaultProps: { elevation: 1 },
            styleOverrides: {
              root: ({ theme }) => ({
                border: `1px solid ${
                  mode === "light"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha("#ffffff", 0.06)
                }`,
                backgroundImage: "none",
              }),
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
              root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
              containedPrimary: {
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderRadius: 8,
                margin: "2px 8px",
                width: "calc(100% - 16px)",
                "&.Mui-selected": {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  color: theme.palette.primary.main,
                  "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
                  },
                },
              }),
            },
          },
          MuiChip: {
            styleOverrides: {
              root: { fontWeight: 600, borderRadius: 6 },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: { fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                boxShadow:
                  mode === "light"
                    ? "0 1px 0 rgba(15,23,42,0.06)"
                    : "0 1px 0 rgba(255,255,255,0.06)",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
