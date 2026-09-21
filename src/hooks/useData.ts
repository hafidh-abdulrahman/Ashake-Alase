import type { ProductCategory } from "@/types";
import { useAsync } from "./useAsync";
import {
  getFeaturedProduct,
  getProduct,
  listAllProducts,
  listProducts,
} from "@/services/productService";
import {
  listAllDeliveryAreas,
  listDeliveryAreas,
} from "@/services/deliveryService";
import {
  getOrder,
  getOrderByNumber,
  getOrderForCustomer,
  listOrders,
} from "@/services/orderService";

export const useProducts = (category?: ProductCategory) =>
  useAsync(() => listProducts({ category }), [category]);
export const useProduct = (id: string | undefined) =>
  useAsync(() => (id ? getProduct(id) : Promise.resolve(null)), [id]);
export const useFeaturedProduct = () => useAsync(getFeaturedProduct, []);
export const useAllProducts = () => useAsync(listAllProducts, []);
export const useDeliveryAreas = () => useAsync(listDeliveryAreas, []);
export const useAllDeliveryAreas = () => useAsync(listAllDeliveryAreas, []);
export const useOrders = () => useAsync(listOrders, []);
export const useOrder = (id: string | undefined) =>
  useAsync(() => (id ? getOrder(id) : Promise.resolve(null)), [id]);
export const useOrderByNumber = (n: string | undefined) =>
  useAsync(() => (n ? getOrderByNumber(n) : Promise.resolve(null)), [n]);
export const useCustomerOrder = (
  orderNumber: string | undefined,
  phone: string | undefined,
) =>
  useAsync(
    () =>
      orderNumber && phone
        ? getOrderForCustomer(orderNumber, phone)
        : Promise.resolve(null),
    [orderNumber, phone],
  );
