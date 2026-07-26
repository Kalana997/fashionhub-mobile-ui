import type { CartItem } from "@/types/models";

export function cartLineKey(item: Pick<CartItem, "productId" | "colorId" | "size">): string {
  return `${item.productId}|${item.colorId}|${item.size}`;
}
