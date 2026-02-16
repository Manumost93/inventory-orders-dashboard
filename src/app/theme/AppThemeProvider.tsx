import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useColorMode } from "./useColorMode";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial"].join(","),
        },
        components: {
          MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                border: mode === "light" ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.10)",
              },
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
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
