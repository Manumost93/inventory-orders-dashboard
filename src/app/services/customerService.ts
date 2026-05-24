import { STORAGE_KEYS } from "./storage";
import type { Customer } from "../types/customer";

const seedCustomers: Customer[] = [
  { id: "c1", name: "Acme Corp",        email: "ops@acme.com",         segment: "enterprise", createdAt: "2024-01-05" },
  { id: "c2", name: "Globex Industries", email: "admin@globex.com",    segment: "enterprise", createdAt: "2024-01-08" },
  { id: "c3", name: "Initech LLC",       email: "hello@initech.com",   segment: "mid",        createdAt: "2024-01-15" },
  { id: "c4", name: "Umbrella Co",       email: "orders@umbrella.com", segment: "enterprise", createdAt: "2024-02-01" },
  { id: "c5", name: "Stark Industries",  email: "tony@starkinc.com",   segment: "enterprise", createdAt: "2024-02-10" },
  { id: "c6", name: "Wayne Enterprises", email: "ops@wayne.com",       segment: "mid",        createdAt: "2024-02-20" },
  { id: "c7", name: "Dunder Mifflin",    email: "michael@dunder.com",  segment: "smb",        createdAt: "2024-03-01" },
  { id: "c8", name: "Pied Piper",        email: "richard@piedpiper.io", segment: "smb",       createdAt: "2024-03-10" },
  { id: "c9", name: "Hooli Inc",         email: "gavin@hooli.com",     segment: "mid",        createdAt: "2024-03-20" },
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
