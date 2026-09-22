import type { Order } from "@/types";

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600 * 1000).toISOString();
const daysFromNow = (d: number) => {
  const x = new Date();
  x.setDate(x.getDate() + d);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
};

/** SAMPLE ORDERS so the admin dashboard has something to show. Removed in Phase 2. */
export const mockOrders: Order[] = [
  {
    id: "seed-1",
    orderNumber: "AA-DEMO-2K4M",
    customer: { fullName: "Adaeze Okonkwo", phone: "08012345678" },
    delivery: {
      areaId: "zone-1",
      areaName: "Zone 1: Nearby",
      address: "12 Sample Street, Sample Estate",
      preferredDate: daysFromNow(2),
      notes: "Please call when close to the gate.",
    },
    items: [
      {
        productId: "october-1st-special",
        name: "October 1st Special",
        unitPrice: 18500,
        quantity: 2,
      },
    ],
    subtotal: 37000,
    deliveryFee: 1500,
    total: 38500,
    status: "awaiting_verification",
    payment: {
      method: "bank_transfer",
      status: "awaiting_verification",
      amount: 38500,
    },
    createdAt: hoursAgo(1),
  },
  {
    id: "seed-2",
    orderNumber: "AA-DEMO-7H2P",
    customer: { fullName: "Tunde Bakare", phone: "08098765432" },
    delivery: {
      areaId: "zone-2",
      areaName: "Zone 2: Mid-range",
      address: "4 Example Close, Demo Layout",
      preferredDate: daysFromNow(3),
      notes: "",
    },
    items: [
      {
        productId: "small-chops-platter",
        name: "Small Chops Platter",
        unitPrice: 25000,
        quantity: 1,
      },
    ],
    subtotal: 25000,
    deliveryFee: 2500,
    total: 27500,
    status: "awaiting_verification",
    payment: {
      method: "bank_transfer",
      status: "awaiting_verification",
      amount: 27500,
    },
    createdAt: hoursAgo(4),
  },
  {
    id: "seed-3",
    orderNumber: "AA-DEMO-9C6R",
    customer: { fullName: "Ngozi Eze", phone: "07033221100" },
    delivery: {
      areaId: "zone-1",
      areaName: "Zone 1: Nearby",
      address: "27 Placeholder Avenue",
      preferredDate: daysFromNow(1),
      notes: "Leave with the security.",
    },
    items: [
      {
        productId: "october-1st-special",
        name: "October 1st Special",
        unitPrice: 18500,
        quantity: 3,
      },
      {
        productId: "jollof-chicken-box",
        name: "Jollof & Chicken Box",
        unitPrice: 6500,
        quantity: 2,
      },
    ],
    subtotal: 68500,
    deliveryFee: 1500,
    total: 70000,
    status: "confirmed",
    payment: {
      method: "bank_transfer",
      status: "verified",
      amount: 70000,
      verifiedAt: hoursAgo(20),
    },
    createdAt: hoursAgo(26),
  },
  {
    id: "seed-4",
    orderNumber: "AA-DEMO-3B8W",
    customer: { fullName: "Ibrahim Musa", phone: "08155501234" },
    delivery: {
      areaId: "zone-3",
      areaName: "Zone 3: Extended",
      address: "9 Test Road, Sample District",
      preferredDate: daysFromNow(1),
      notes: "",
    },
    items: [
      {
        productId: "party-rice-tray",
        name: "Party Rice Tray",
        unitPrice: 45000,
        quantity: 1,
      },
    ],
    subtotal: 45000,
    deliveryFee: 4000,
    total: 49000,
    status: "preparing",
    payment: {
      method: "bank_transfer",
      status: "verified",
      amount: 49000,
      verifiedAt: hoursAgo(30),
    },
    createdAt: hoursAgo(34),
  },
  {
    id: "seed-5",
    orderNumber: "AA-DEMO-5D1T",
    customer: { fullName: "Folake Adeyemi", phone: "09011223344" },
    delivery: {
      areaId: "zone-2",
      areaName: "Zone 2: Mid-range",
      address: "15 Mock Crescent",
      preferredDate: daysFromNow(0),
      notes: "Office delivery, ask for reception.",
    },
    items: [
      {
        productId: "jollof-chicken-box",
        name: "Jollof & Chicken Box",
        unitPrice: 6500,
        quantity: 6,
      },
    ],
    subtotal: 39000,
    deliveryFee: 2500,
    total: 41500,
    status: "out_for_delivery",
    payment: {
      method: "bank_transfer",
      status: "verified",
      amount: 41500,
      verifiedAt: hoursAgo(50),
    },
    createdAt: hoursAgo(52),
  },
  {
    id: "seed-6",
    orderNumber: "AA-DEMO-8F3N",
    customer: { fullName: "Chidi Nwosu", phone: "08122334455" },
    delivery: {
      areaId: "zone-1",
      areaName: "Zone 1: Nearby",
      address: "3 Demo Lane",
      preferredDate: daysFromNow(-1),
      notes: "",
    },
    items: [
      {
        productId: "october-1st-special",
        name: "October 1st Special",
        unitPrice: 18500,
        quantity: 1,
      },
    ],
    subtotal: 18500,
    deliveryFee: 1500,
    total: 20000,
    status: "delivered",
    payment: {
      method: "bank_transfer",
      status: "verified",
      amount: 20000,
      verifiedAt: hoursAgo(80),
    },
    createdAt: hoursAgo(84),
  },
];
