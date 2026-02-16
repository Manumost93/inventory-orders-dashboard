import * as React from "react";

export type ColorMode = "light" | "dark";

export type ColorModeContextValue = {
  mode: ColorMode;
  toggle: () => void;
  setMode: (mode: ColorMode) => void;
};

export const ColorModeContext =
  React.createContext<ColorModeContextValue | undefined>(undefined);
