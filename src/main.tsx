// Inventory & Orders Dashboard
// Author: Manuel Honrado
// Year: 2026


import * as React from "react";
import * as ReactDOM from "react-dom/client";
import AppRouter from "./app/routes/AppRouter";
import AppThemeProvider from "./app/theme/AppThemeProvider";
import { ColorModeProvider } from "./app/theme/ColorModeProvider";
import { AuthProvider } from "./app/context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeProvider>
      <AppThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </AppThemeProvider>
    </ColorModeProvider>
  </React.StrictMode>
);
