import * as React from "react";
import { ColorModeContext, type ColorMode } from "./colorMode.context";

const STORAGE_KEY = "ui_color_mode_v1";

function getSystemMode(): ColorMode {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredMode(): ColorMode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
    return null;
  } catch {
    return null;
  }
}

function writeStoredMode(mode: ColorMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore write errors
  }
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ColorMode>(() => {
    const stored = readStoredMode();
    if (stored) return stored;
    return getSystemMode();
  });

  const setMode = React.useCallback((next: ColorMode) => {
    setModeState(next);
    writeStoredMode(next);
  }, []);

  const toggle = React.useCallback(() => {
    setModeState((prev) => {
      const next: ColorMode = prev === "light" ? "dark" : "light";
      writeStoredMode(next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const stored = readStoredMode();
    if (stored) return;

    if (!window.matchMedia) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      setModeState(e.matches ? "dark" : "light");
    };

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  const value = React.useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}
