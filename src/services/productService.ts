import type { Product, ProductCategory } from "@/types";
import { mockProducts } from "@/data/mock/products";
import { simulateLatency } from "./delay";

const KEY = "aa:products:v1";

const load = (): Product[] => {
  const stored = localStorage.getItem(KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch {
      /* restore demo data below */
    }
  }
  localStorage.setItem(KEY, JSON.stringify(mockProducts));
  return [...mockProducts];
};

const save = (products: Product[]) =>
  localStorage.setItem(KEY, JSON.stringify(products));

/**
 * Product data access.
 * Phase 2: replace the bodies with Supabase queries, e.g.
 *   supabase.from('products').select('*').eq('is_active', true)
 * Keep the function signatures and no component needs to change.
 */

export interface ListProductsOptions {
  category?: ProductCategory;
  includeInactive?: boolean;
}

export async function listProducts(
  options: ListProductsOptions = {},
): Promise<Product[]> {
  await simulateLatency();
  return load()
    .filter((p) => options.includeInactive || p.isActive)
    .filter((p) => !options.category || p.category === options.category)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getProduct(id: string): Promise<Product | null> {
  await simulateLatency();
  return load().find((p) => p.id === id && p.isActive) ?? null;
}

export async function getFeaturedProduct(): Promise<Product | null> {
  await simulateLatency();
  return load().find((p) => p.featured && p.isActive) ?? null;
}

export async function listAllProducts(): Promise<Product[]> {
  await simulateLatency();
  return load();
}

export async function saveProduct(product: Product): Promise<Product> {
  await simulateLatency(120);
  const products = load();
  const next = products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [product, ...products];
  save(next);
  return product;
}

export async function removeProduct(id: string): Promise<void> {
  await simulateLatency(120);
  save(load().filter((product) => product.id !== id));
}
