import type { DeliveryArea } from '@/types'

/**
 * PLACEHOLDER DELIVERY AREAS AND FEES.
 * Replace with the client's real areas. In Phase 2 this becomes a Supabase `delivery_areas` table.
 */
export const mockDeliveryAreas: DeliveryArea[] = [
  { id: 'zone-1', name: 'Zone 1: Nearby', fee: 1500, isActive: true },
  { id: 'zone-2', name: 'Zone 2: Mid-range', fee: 2500, isActive: true },
  { id: 'zone-3', name: 'Zone 3: Extended', fee: 4000, isActive: true },
  { id: 'zone-4', name: 'Zone 4: Not yet available', fee: 0, isActive: false },
]
