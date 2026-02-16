export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: "smb" | "mid" | "enterprise";
  createdAt: string; // yyyy-mm-dd
}