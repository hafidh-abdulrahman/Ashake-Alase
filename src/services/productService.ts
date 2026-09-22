import type { Product, ProductCategory } from "@/types";
import { mockProducts } from "@/data/mock/products";
import { supabase } from "@/lib/supabase";

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image_url: string | null;
  category: string;
  stock_quantity: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

const PRODUCT_COLUMNS = "*";
const PRODUCT_READ_TIMEOUT_MS = 8000;

const mockListProducts = (options: ListProductsOptions = {}) =>
  mockProducts.filter(
    (product) =>
      product.isActive &&
      (!options.category || product.category === options.category),
  );

const withReadTimeout = async <T>(request: PromiseLike<T>): Promise<T> =>
  Promise.race([
    Promise.resolve(request),
    new Promise<T>((_, reject) =>
      window.setTimeout(
        () => reject(new Error("Product request timed out.")),
        PRODUCT_READ_TIMEOUT_MS,
      ),
    ),
  ]);

const client = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
};

const placeholderFor = (category: string): Product["placeholder"] => {
  if (category === "combo") return "plate";
  if (category === "event") return "tray";
  if (category === "catering") return "grill";
  return "box";
};

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  summary: row.description,
  description: row.description,
  price: Number(row.price),
  image: row.image_url ?? "",
  placeholder: placeholderFor(row.category),
  includes: [],
  availableQuantity: row.stock_quantity,
  maxPerOrder: 1,
  isActive: row.is_available,
  featured: false,
  category: row.category as ProductCategory,
});

const toRow = (product: Product) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  image_url: product.image || null,
  category: product.category,
  stock_quantity: product.availableQuantity,
  is_available: product.isActive,
});

export interface ListProductsOptions {
  category?: ProductCategory;
  includeInactive?: boolean;
}

export async function listProducts(
  options: ListProductsOptions = {},
): Promise<Product[]> {
  if (!supabase) {
    return mockListProducts(options);
  }

  let query = client()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });
  if (!options.includeInactive) query = query.eq("is_available", true);
  if (options.category) query = query.eq("category", options.category);
  const { data, error } = await withReadTimeout(query);
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!supabase) {
    return (
      mockProducts.find((product) => product.id === id && product.isActive) ??
      null
    );
  }

  try {
    const { data, error } = await withReadTimeout(
      client()
        .from("products")
        .select(PRODUCT_COLUMNS)
        .eq("id", id)
        .eq("is_available", true)
        .maybeSingle(),
    );
    if (error) throw error;
    return data ? toProduct(data as ProductRow) : null;
  } catch {
    return (
      mockProducts.find((product) => product.id === id && product.isActive) ??
      null
    );
  }
}

export async function getFeaturedProduct(): Promise<Product | null> {
  if (!supabase) {
    return (
      mockProducts.find((product) => product.featured && product.isActive) ??
      null
    );
  }

  try {
    const { data, error } = await withReadTimeout(
      client()
        .from("products")
        .select(PRODUCT_COLUMNS)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    );
    if (error) throw error;
    return data ? toProduct(data as ProductRow) : null;
  } catch {
    return (
      mockProducts.find((product) => product.featured && product.isActive) ??
      null
    );
  }
}

export async function listAllProducts(): Promise<Product[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await withReadTimeout(
    client()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("created_at", { ascending: false }),
  );
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function saveProduct(product: Product): Promise<Product> {
  const table = client().from("products");
  const query = product.id.startsWith("item-")
    ? table.insert(toRow(product)).select(PRODUCT_COLUMNS).single()
    : table
        .update(toRow(product))
        .eq("id", product.id)
        .select(PRODUCT_COLUMNS)
        .single();
  const { data, error } = await query;
  if (error) throw error;
  return toProduct(data as ProductRow);
}

export async function removeProduct(id: string): Promise<void> {
  const { error } = await client().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateProductAvailability(
  id: string,
  isAvailable: boolean,
): Promise<void> {
  const { error } = await client()
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", id);
  if (error) throw error;
}

export async function updateProductStock(
  id: string,
  stockQuantity: number | null,
): Promise<void> {
  const { error } = await client()
    .from("products")
    .update({ stock_quantity: stockQuantity })
    .eq("id", id);
  if (error) throw error;
}
