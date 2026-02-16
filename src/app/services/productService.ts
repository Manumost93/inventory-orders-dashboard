import { STORAGE_KEYS } from "./storage";
import type { Product } from "../types/product";

const seedProducts: Product[] = [
  {
    id: "1",
    name: "Classic Burger",
    sku: "BURG-001",
    price: 8.5,
    stock: 120,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Cheese Burger",
    sku: "BURG-002",
    price: 9.5,
    stock: 80,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Vegan Burger",
    sku: "BURG-003",
    price: 10,
    stock: 45,
    status: "inactive",
    createdAt: "2024-01-20",
  },
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

/** Inicializa dataset si está vacío */
function ensureSeeded() {
  const current = readProducts();
  if (current.length === 0) {
    writeProducts(seedProducts);
  }
}

export async function getProducts(): Promise<Product[]> {
  ensureSeeded();
  await sleep(500);
  return readProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  ensureSeeded();
  await sleep(300);
  return readProducts().find((p) => p.id === id) ?? null;
}

export type CreateProductInput = {
  name: string;
  price: number;
};

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

  const next = [...products, newProduct];
  writeProducts(next);

  return newProduct;
}

export type UpdateProductInput = Partial<
  Pick<Product, "name" | "price" | "stock" | "status">
>;

export async function updateProduct(
  id: string,
  patch: UpdateProductInput
): Promise<Product> {
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
  const next = products.filter((p) => p.id !== id);
  writeProducts(next);
}
