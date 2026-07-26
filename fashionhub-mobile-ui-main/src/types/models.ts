/** Domain models shared by API handlers and typed client logic. */

export type ProductColor = {
  id: string;
  label: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  sizes: string[];
  colors: ProductColor[];
  /** Default highlighted color swatch order */
  defaultColorId: string;
  /** Prefer first image fallback */
  previewImageSrc: string;
  /** keyed by color id when photography differs */
  imagesByColor: Partial<Record<string, string>>;
};

export type CartItem = {
  productId: string;
  productName: string;
  /** Display price × quantity cents */
  lineTotalCents: number;
  colorId: string;
  colorLabel: string;
  size: string;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  sessionId: string;
  items: CartItem[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  paid: boolean;
  createdAtIso: string;
};
