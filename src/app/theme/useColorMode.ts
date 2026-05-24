import * as React from "react";
import { ColorModeContext } from "./colorMode.context";
import type { ColorModeContextValue } from "./colorMode.context";

export function useColorMode(): ColorModeContextValue {
  const ctx = React.useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within ColorModeProvider");
  return ctx;
}
