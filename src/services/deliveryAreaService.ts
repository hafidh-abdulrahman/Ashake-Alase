import type { DeliveryArea } from "@/types";
import { supabase } from "@/lib/supabase";

interface DeliveryAreaRow {
  id: string;
  area_name: string;
  delivery_fee: number | string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAreaInput {
  name: string;
  fee: number;
  isActive: boolean;
}

const toDeliveryArea = (row: DeliveryAreaRow): DeliveryArea => ({
  id: row.id,
  name: row.area_name,
  fee: Number(row.delivery_fee),
  isActive: row.is_available,
});

const getClient = () => {
  if (!supabase) {
    throw new Error("Delivery areas are not configured yet.");
  }
  return supabase;
};

const DELIVERY_AREA_TIMEOUT_MS = 8000;

const withTimeout = async <T>(request: PromiseLike<T>): Promise<T> =>
  Promise.race([
    Promise.resolve(request),
    new Promise<T>((_, reject) =>
      window.setTimeout(
        () => reject(new Error("Delivery area request timed out.")),
        DELIVERY_AREA_TIMEOUT_MS,
      ),
    ),
  ]);

export async function getDeliveryAreas(): Promise<DeliveryArea[]> {
  const { data, error } = await withTimeout(
    getClient()
      .from("delivery_areas")
      .select(
        "id, area_name, delivery_fee, is_available, created_at, updated_at",
      )
      .order("created_at", { ascending: false }),
  );
  if (error) throw error;
  return (data as DeliveryAreaRow[]).map(toDeliveryArea);
}

export async function getAvailableDeliveryAreas(): Promise<DeliveryArea[]> {
  const { data, error } = await withTimeout(
    getClient()
      .from("delivery_areas")
      .select(
        "id, area_name, delivery_fee, is_available, created_at, updated_at",
      )
      .eq("is_available", true)
      .order("area_name", { ascending: true }),
  );
  if (error) throw error;
  return (data as DeliveryAreaRow[]).map(toDeliveryArea);
}

export async function createDeliveryArea(
  input: DeliveryAreaInput,
): Promise<DeliveryArea> {
  const { data, error } = await withTimeout(
    getClient()
      .from("delivery_areas")
      .insert({
        area_name: input.name.trim(),
        delivery_fee: input.fee,
        is_available: input.isActive,
      })
      .select(
        "id, area_name, delivery_fee, is_available, created_at, updated_at",
      )
      .single(),
  );
  if (error) throw error;
  return toDeliveryArea(data as DeliveryAreaRow);
}

export async function updateDeliveryArea(
  id: string,
  input: DeliveryAreaInput,
): Promise<DeliveryArea> {
  const { data, error } = await withTimeout(
    getClient()
      .from("delivery_areas")
      .update({
        area_name: input.name.trim(),
        delivery_fee: input.fee,
        is_available: input.isActive,
      })
      .eq("id", id)
      .select(
        "id, area_name, delivery_fee, is_available, created_at, updated_at",
      )
      .single(),
  );
  if (error) throw error;
  return toDeliveryArea(data as DeliveryAreaRow);
}

export async function deleteDeliveryArea(id: string): Promise<void> {
  const { error } = await withTimeout(
    getClient().from("delivery_areas").delete().eq("id", id),
  );
  if (error) throw error;
}
