export type ProductStatus = "active" | "inactive";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
};
