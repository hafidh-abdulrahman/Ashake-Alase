import type { DeliveryArea } from "@/types";
import {
  createDeliveryArea,
  deleteDeliveryArea,
  getAvailableDeliveryAreas,
  getDeliveryAreas,
  updateDeliveryArea,
  type DeliveryAreaInput,
} from "./deliveryAreaService";

export const listDeliveryAreas = getAvailableDeliveryAreas;
export const listAllDeliveryAreas = getDeliveryAreas;

export async function saveDeliveryArea(area: DeliveryArea): Promise<void> {
  const input: DeliveryAreaInput = {
    name: area.name,
    fee: area.fee,
    isActive: area.isActive,
  };
  if (area.id.startsWith("zone-")) {
    await createDeliveryArea(input);
    return;
  }
  await updateDeliveryArea(area.id, input);
}

export const removeDeliveryArea = deleteDeliveryArea;
