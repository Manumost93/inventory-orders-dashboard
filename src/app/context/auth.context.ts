import * as React from "react";
import type { StoredAuth } from "../services/storage";

export type Role = "admin" | "viewer";

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

export type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

// (Opcional) type guard si lo necesitas: StoredAuth se mantiene compatible
export type StoredUser = NonNullable<StoredAuth["user"]>;
