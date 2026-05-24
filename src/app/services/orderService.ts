import { STORAGE_KEYS } from "./storage";
import type { Order, OrderStatus } from "../types/order";

const seedOrders: Order[] = [
  // January 2024
  { id: "o1",  number: "ORD-10001", customerId: "c1", customerName: "Acme Corp",         total: 129.90, status: "shipped",  createdAt: "2024-01-08" },
  { id: "o2",  number: "ORD-10002", customerId: "c2", customerName: "Globex Industries", total: 89.50,  status: "shipped",  createdAt: "2024-01-12" },
  { id: "o3",  number: "ORD-10003", customerId: "c3", customerName: "Initech LLC",       total: 240.00, status: "shipped",  createdAt: "2024-01-18" },
  { id: "o4",  number: "ORD-10004", customerId: "c4", customerName: "Umbrella Co",       total: 540.00, status: "shipped",  createdAt: "2024-01-25" },

  // February 2024
  { id: "o5",  number: "ORD-10005", customerId: "c5", customerName: "Stark Industries",  total: 1200.00, status: "shipped", createdAt: "2024-02-03" },
  { id: "o6",  number: "ORD-10006", customerId: "c1", customerName: "Acme Corp",         total: 380.50,  status: "shipped", createdAt: "2024-02-07" },
  { id: "o7",  number: "ORD-10007", customerId: "c6", customerName: "Wayne Enterprises", total: 760.00,  status: "shipped", createdAt: "2024-02-14" },
  { id: "o8",  number: "ORD-10008", customerId: "c7", customerName: "Dunder Mifflin",    total: 95.00,   status: "shipped", createdAt: "2024-02-20" },

  // March 2024
  { id: "o9",  number: "ORD-10009", customerId: "c2", customerName: "Globex Industries", total: 430.75,  status: "shipped", createdAt: "2024-03-02" },
  { id: "o10", number: "ORD-10010", customerId: "c8", customerName: "Pied Piper",        total: 220.00,  status: "shipped", createdAt: "2024-03-10" },
  { id: "o11", number: "ORD-10011", customerId: "c4", customerName: "Umbrella Co",       total: 990.00,  status: "shipped", createdAt: "2024-03-18" },
  { id: "o12", number: "ORD-10012", customerId: "c5", customerName: "Stark Industries",  total: 1580.00, status: "shipped", createdAt: "2024-03-25" },

  // April 2024
  { id: "o13", number: "ORD-10013", customerId: "c9", customerName: "Hooli Inc",         total: 310.00,  status: "shipped", createdAt: "2024-04-04" },
  { id: "o14", number: "ORD-10014", customerId: "c1", customerName: "Acme Corp",         total: 475.20,  status: "shipped", createdAt: "2024-04-11" },
  { id: "o15", number: "ORD-10015", customerId: "c3", customerName: "Initech LLC",       total: 160.00,  status: "shipped", createdAt: "2024-04-19" },

  // May 2024
  { id: "o16", number: "ORD-10016", customerId: "c6", customerName: "Wayne Enterprises", total: 920.00,  status: "shipped", createdAt: "2024-05-06" },
  { id: "o17", number: "ORD-10017", customerId: "c2", customerName: "Globex Industries", total: 640.00,  status: "shipped", createdAt: "2024-05-14" },
  { id: "o18", number: "ORD-10018", customerId: "c7", customerName: "Dunder Mifflin",    total: 112.50,  status: "paid",    createdAt: "2024-05-22" },

  // June 2024
  { id: "o19", number: "ORD-10019", customerId: "c5", customerName: "Stark Industries",  total: 2100.00, status: "paid",    createdAt: "2024-06-03" },
  { id: "o20", number: "ORD-10020", customerId: "c4", customerName: "Umbrella Co",       total: 880.00,  status: "paid",    createdAt: "2024-06-12" },
  { id: "o21", number: "ORD-10021", customerId: "c8", customerName: "Pied Piper",        total: 340.00,  status: "paid",    createdAt: "2024-06-18" },
  { id: "o22", number: "ORD-10022", customerId: "c9", customerName: "Hooli Inc",         total: 470.00,  status: "paid",    createdAt: "2024-06-25" },

  // July 2024 (recent – some pending)
  { id: "o23", number: "ORD-10023", customerId: "c1", customerName: "Acme Corp",         total: 590.00,  status: "pending", createdAt: "2024-07-02" },
  { id: "o24", number: "ORD-10024", customerId: "c6", customerName: "Wayne Enterprises", total: 1050.00, status: "pending", createdAt: "2024-07-08" },
  { id: "o25", number: "ORD-10025", customerId: "c2", customerName: "Globex Industries", total: 745.00,  status: "pending", createdAt: "2024-07-14" },
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
