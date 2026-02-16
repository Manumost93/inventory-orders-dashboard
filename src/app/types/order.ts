export type OrderStatus = "pending" | "paid" | "shipped";

export interface Order {
  id: string;
  number: string;
  customerId: string;     // 🔥 NUEVO
  customerName: string;   // lo dejamos para mostrar en tabla
  total: number;
  status: OrderStatus;
  createdAt: string;
}
