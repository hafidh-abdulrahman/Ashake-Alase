import type { DeliveryArea } from "@/types";
import { mockDeliveryAreas } from "@/data/mock/deliveryAreas";
import { simulateLatency } from "./delay";

const KEY = "aa:delivery-areas:v1";
const load = (): DeliveryArea[] => {
  const stored = localStorage.getItem(KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as DeliveryArea[];
    } catch {
      /* restore demo data below */
    }
  }
  localStorage.setItem(KEY, JSON.stringify(mockDeliveryAreas));
  return [...mockDeliveryAreas];
};
const save = (areas: DeliveryArea[]) =>
  localStorage.setItem(KEY, JSON.stringify(areas));

/** Phase 2: supabase.from('delivery_areas').select('*').eq('is_active', true) */
export async function listDeliveryAreas(): Promise<DeliveryArea[]> {
  await simulateLatency(150);
  return load().filter((a) => a.isActive);
}

export async function listAllDeliveryAreas(): Promise<DeliveryArea[]> {
  await simulateLatency(100);
  return load();
}

export async function saveDeliveryArea(area: DeliveryArea): Promise<void> {
  await simulateLatency(100);
  const areas = load();
  save(
    areas.some((item) => item.id === area.id)
      ? areas.map((item) => (item.id === area.id ? area : item))
      : [area, ...areas],
  );
}

export async function removeDeliveryArea(id: string): Promise<void> {
  await simulateLatency(100);
  save(load().filter((area) => area.id !== id));
}
