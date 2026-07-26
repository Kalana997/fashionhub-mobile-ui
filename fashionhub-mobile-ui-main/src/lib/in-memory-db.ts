import type { CartItem, OrderRecord } from "@/types/models";

/** Simple in-memory carts keyed by session id (prototype / test assignment). */

const SESSION_CART = new Map<string, CartItem[]>();

const DELIVERY_STANDARD_CENTS = 1200;

const ORDERS: OrderRecord[] = [];

export const cartStore = {
  get(sessionId: string): CartItem[] {
    return SESSION_CART.get(sessionId) ?? [];
  },

  set(sessionId: string, items: CartItem[]) {
    SESSION_CART.set(sessionId, items);
  },

  clear(sessionId: string) {
    SESSION_CART.delete(sessionId);
  },
};

export const orderStore = {
  list(): OrderRecord[] {
    return ORDERS;
  },

  add(order: OrderRecord) {
    ORDERS.unshift(order);
  },

  deliveryCents(): number {
    return DELIVERY_STANDARD_CENTS;
  },

  summarizeItems(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const delivery = items.length === 0 ? 0 : DELIVERY_STANDARD_CENTS;
    const total = subtotal + delivery;
    return { subtotalCents: subtotal, deliveryCents: delivery, totalCents: total };
  },
};
