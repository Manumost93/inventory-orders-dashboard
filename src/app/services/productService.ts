import { STORAGE_KEYS } from "./storage";
import type { Product } from "../types/product";

const seedProducts: Product[] = [
  { id: "p1",  name: "Classic Burger",        sku: "BURG-001", price: 8.50,  stock: 120, status: "active",   createdAt: "2024-01-10" },
  { id: "p2",  name: "Cheese Burger",          sku: "BURG-002", price: 9.50,  stock: 95,  status: "active",   createdAt: "2024-01-12" },
  { id: "p3",  name: "Vegan Burger",           sku: "BURG-003", price: 10.00, stock: 45,  status: "active",   createdAt: "2024-01-20" },
  { id: "p4",  name: "BBQ Bacon Burger",       sku: "BURG-004", price: 11.50, stock: 60,  status: "active",   createdAt: "2024-02-01" },
  { id: "p5",  name: "Mushroom Swiss Burger",  sku: "BURG-005", price: 10.75, stock: 30,  status: "active",   createdAt: "2024-02-10" },
  { id: "p6",  name: "Spicy Jalapeño Burger",  sku: "BURG-006", price: 9.75,  stock: 8,   status: "active",   createdAt: "2024-02-15" },
  { id: "p7",  name: "Double Smash Burger",    sku: "BURG-007", price: 13.00, stock: 50,  status: "active",   createdAt: "2024-03-01" },
  { id: "p8",  name: "Chicken Crispy Burger",  sku: "CHKN-001", price: 9.00,  stock: 75,  status: "active",   createdAt: "2024-03-05" },
  { id: "p9",  name: "Fish Fillet Burger",     sku: "FISH-001", price: 8.25,  stock: 6,   status: "active",   createdAt: "2024-03-10" },
  { id: "p10", name: "Truffle Burger",         sku: "PREM-001", price: 16.00, stock: 20,  status: "active",   createdAt: "2024-03-15" },
  { id: "p11", name: "Classic Hot Dog",        sku: "HOTD-001", price: 5.50,  stock: 200, status: "active",   createdAt: "2024-01-05" },
  { id: "p12", name: "Loaded Hot Dog",         sku: "HOTD-002", price: 7.00,  stock: 3,   status: "active",   createdAt: "2024-01-08" },
  { id: "p13", name: "French Fries (L)",       sku: "SIDE-001", price: 3.50,  stock: 300, status: "active",   createdAt: "2024-01-01" },
  { id: "p14", name: "Onion Rings",            sku: "SIDE-002", price: 4.00,  stock: 150, status: "active",   createdAt: "2024-01-01" },
  { id: "p15", name: "Veggie Wrap",            sku: "WRAP-001", price: 7.50,  stock: 0,   status: "inactive", createdAt: "2024-02-20" },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function readProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.products);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function ensureSeeded() {
  const current = readProducts();
  if (current.length === 0) writeProducts(seedProducts);
}

export async function getProducts(): Promise<Product[]> {
  ensureSeeded();
  await sleep(400);
  return readProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  ensureSeeded();
  await sleep(250);
  return readProducts().find((p) => p.id === id) ?? null;
}

export type CreateProductInput = { name: string; price: number };

export async function createProduct(input: CreateProductInput): Promise<Product> {
  ensureSeeded();
  await sleep(300);

  const products = readProducts();
  const newProduct: Product = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    name: input.name.trim(),
    sku: `SKU-${Date.now()}`,
    price: input.price,
    stock: 0,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };

  writeProducts([...products, newProduct]);
  return newProduct;
}

export type UpdateProductInput = Partial<Pick<Product, "name" | "price" | "stock" | "status">>;

export async function updateProduct(id: string, patch: UpdateProductInput): Promise<Product> {
  ensureSeeded();
  await sleep(300);

  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");

  const updated: Product = { ...products[idx], ...patch };
  const next = [...products];
  next[idx] = updated;
  writeProducts(next);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  ensureSeeded();
  await sleep(300);

  const products = readProducts();
  writeProducts(products.filter((p) => p.id !== id));
}
