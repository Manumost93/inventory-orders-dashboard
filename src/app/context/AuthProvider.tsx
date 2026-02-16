import * as React from "react";
import { clearAuth, readAuth, writeAuth } from "../services/storage";
import { AuthContext, type AuthContextValue, type AuthUser } from "./auth.context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    const stored = readAuth();
    setIsAuthenticated(stored.isAuthenticated);
    setUser(stored.user);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.includes("@") || password.length < 4) {
      throw new Error("Invalid credentials");
    }

    // Demo roles:
    // - viewer@company.com -> viewer
    // - cualquier otro -> admin
    const role: AuthUser["role"] =
      cleanEmail === "viewer@company.com" ? "viewer" : "admin";

    const nextUser: AuthUser = { name: "Demo User", email: cleanEmail, role };

    setIsAuthenticated(true);
    setUser(nextUser);
    writeAuth({ isAuthenticated: true, user: nextUser });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAuth();
  };

  const value: AuthContextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
