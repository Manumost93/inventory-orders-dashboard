export const STORAGE_KEYS = {
  auth: "auth_v1",
  products: "products_v1",
  orders: "orders_v1",
  customers: "customers_v1",
} as const;

// =====================
// Types
// =====================
export type Role = "admin" | "viewer";

export type StoredUser = {
  name: string;
  email: string;
  role: Role;
};

export type StoredAuth = {
  isAuthenticated: boolean;
  user: StoredUser | null;
};

// =====================
// Auth storage helpers
// =====================
export function readAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.auth);
    if (!raw) return { isAuthenticated: false, user: null };

    const parsed = JSON.parse(raw) as Partial<StoredAuth>;

    return {
      isAuthenticated: Boolean(parsed.isAuthenticated),
      user: (parsed.user ?? null) as StoredUser | null,
    };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

export function writeAuth(auth: StoredAuth) {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.auth);
}

// =====================
// Generic helpers (optional)
// =====================
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string) {
  localStorage.removeItem(key);
}
