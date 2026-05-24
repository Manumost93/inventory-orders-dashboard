import { useAuth } from "./useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const role = user?.role ?? "viewer";
  const canWrite = role === "admin";

  return { role, canWrite };
}
