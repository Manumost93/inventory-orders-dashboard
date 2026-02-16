import { STORAGE_KEYS } from "./storage";
import type { Order, OrderStatus } from "../types/order";

const seedOrders: Order[] = [
  {
    id: "o1",
    number: "ORD-10001",
    customerId: "c1",
    customerName: "Acme Corp",
    total: 129.9,
    status: "pending",
    createdAt: "2024-02-01",
  },
  {
    id: "o2",
    number: "ORD-10002",
    customerId: "c2",
    customerName: "Globex",
    total: 89.5,
    status: "paid",
    createdAt: "2024-02-03",
  },
  {
    id: "o3",
    number: "ORD-10003",
    customerId: "c3",
    customerName: "Initech",
    total: 240,
    status: "shipped",
    createdAt: "2024-02-05",
  },
];


function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.orders);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function ensureSeeded() {
  const current = readOrders();
  if (current.length === 0) writeOrders(seedOrders);
}

export async function getOrders(): Promise<Order[]> {
  ensureSeeded();
  await sleep(400);
  return readOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  ensureSeeded();
  await sleep(250);
  return readOrders().find((o) => o.id === id) ?? null;
}

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  ensureSeeded();
  await sleep(250);
  return readOrders().filter((o) => o.customerId === customerId);
}



export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  ensureSeeded();
  await sleep(250);

  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");

  const updated: Order = { ...orders[idx], status };
  const next = [...orders];
  next[idx] = updated;
  writeOrders(next);

  return updated;
}
