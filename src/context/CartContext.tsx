import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CheckoutDraft, Product } from "@/types";
import { readJson, writeJson } from "@/lib/storage";
import { listProducts } from "@/services/productService";
import { ymdFromToday } from "@/lib/format";

const CART_KEY = "aa:cart:v1";
const DRAFT_KEY = "aa:checkout:v1";

export const emptyDraft: CheckoutDraft = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  preferredDate: ymdFromToday(2),
  notes: "",
};

export interface DetailedLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface CartValue {
  lines: DetailedLine[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  addItem: (productId: string, quantity: number) => boolean;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;

  draft: CheckoutDraft;
  updateDraft: (patch: Partial<CheckoutDraft>) => void;
  productsReady: boolean;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartValue | null>(null);

const clampQty = (product: Product, qty: number) => {
  const cap = Math.min(
    product.maxPerOrder ?? Infinity,
    product.availableQuantity ?? Infinity,
  );
  return Math.max(1, Math.min(qty, cap));
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() =>
    readJson<CartLine[]>(CART_KEY, []),
  );
  const [draft, setDraft] = useState<CheckoutDraft>(() => ({
    ...emptyDraft,
    ...readJson<Partial<CheckoutDraft>>(DRAFT_KEY, {}),
  }));
  const [products, setProducts] = useState<Product[]>([]);
  const [productsReady, setProductsReady] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProducts()
      .then((productsResult) => {
        if (cancelled) return;
        setProducts(productsResult);
        setProductsReady(true);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setProductsReady(true);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => writeJson(CART_KEY, raw), [raw]);
  useEffect(() => writeJson(DRAFT_KEY, draft), [draft]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const lines = useMemo<DetailedLine[]>(
    () =>
      raw.flatMap((l) => {
        const product = productById.get(l.productId);
        if (!product) return []; // product removed or deactivated
        const quantity = clampQty(product, l.quantity);
        return [{ product, quantity, lineTotal: product.price * quantity }];
      }),
    [raw, productById],
  );

  const addItem = useCallback(
    (productId: string, quantity: number) => {
      const product = productById.get(productId);
      if (!product) return false;
      setRaw((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: clampQty(product, l.quantity + quantity) }
              : l,
          );
        }
        return [...prev, { productId, quantity: clampQty(product, quantity) }];
      });
      return true;
    },
    [productById],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = productById.get(productId);
      if (!product) return;
      setRaw((prev) =>
        prev.map((l) =>
          l.productId === productId
            ? { ...l, quantity: clampQty(product, quantity) }
            : l,
        ),
      );
    },
    [productById],
  );

  const removeItem = useCallback(
    (productId: string) =>
      setRaw((prev) => prev.filter((l) => l.productId !== productId)),
    [],
  );

  const clear = useCallback(() => {
    setRaw([]);
    setDraft(emptyDraft);
  }, []);

  const updateDraft = useCallback(
    (patch: Partial<CheckoutDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const value: CartValue = {
    lines,
    itemCount,
    subtotal,
    ready,
    addItem,
    setQuantity,
    removeItem,
    clear,
    draft,
    updateDraft,
    productsReady,
    deliveryFee,
    total,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
