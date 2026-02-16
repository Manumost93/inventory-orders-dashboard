import { STORAGE_KEYS } from "./storage";
import type { Customer } from "../types/customer";

const seedCustomers: Customer[] = [
  { id: "c1", name: "Acme Corp", email: "ops@acme.com", segment: "enterprise", createdAt: "2024-02-01" },
  { id: "c2", name: "Globex", email: "admin@globex.com", segment: "mid", createdAt: "2024-02-03" },
  { id: "c3", name: "Initech", email: "hello@initech.com", segment: "smb", createdAt: "2024-02-05" },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function readCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.customers);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Customer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
}

function ensureSeeded() {
  const current = readCustomers();
  if (current.length === 0) writeCustomers(seedCustomers);
}

export async function getCustomers(): Promise<Customer[]> {
  ensureSeeded();
  await sleep(350);
  return readCustomers();
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  ensureSeeded();
  await sleep(200);
  return readCustomers().find((c) => c.id === id) ?? null;
}

export async function createCustomer(input: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
  ensureSeeded();
  await sleep(250);

  const customers = readCustomers();
  const created: Customer = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString().slice(0, 10),
    ...input,
  };

  writeCustomers([...customers, created]);
  return created;
}

export async function updateCustomer(id: string, patch: Partial<Omit<Customer, "id" | "createdAt">>): Promise<Customer> {
  ensureSeeded();
  await sleep(250);

  const customers = readCustomers();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Customer not found");

  const updated: Customer = { ...customers[idx], ...patch };
  const next = [...customers];
  next[idx] = updated;
  writeCustomers(next);

  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  ensureSeeded();
  await sleep(200);

  const customers = readCustomers();
  writeCustomers(customers.filter((c) => c.id !== id));
}
