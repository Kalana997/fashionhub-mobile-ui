import { NextResponse, type NextRequest } from "next/server";
import { cartStore, orderStore } from "@/lib/in-memory-db";
import { cartLineKey } from "@/lib/cart-line-key";
import { getProductById } from "@/lib/products-data";
import type { CartItem } from "@/types/models";
import { guardedJson } from "@/lib/session-guard";

export const dynamic = "force-dynamic";

type AddBody = {
  productId: string;
  colorId?: string;
  size: string;
  quantity?: number;
};

type PatchBody = {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
};

function normalizeItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of items) {
    const key = cartLineKey(item);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...item });
      continue;
    }
    const quantity = existing.quantity + item.quantity;
    const unit = existing.lineTotalCents / existing.quantity;
    map.set(key, {
      ...existing,
      quantity,
      lineTotalCents: Math.round(unit * quantity),
    });
  }
  return Array.from(map.values());
}

function resolveColor(product: NonNullable<ReturnType<typeof getProductById>>, colorId?: string) {
  if (typeof colorId === "string") {
    const match = product.colors.find((color) => color.id === colorId);
    if (match) return match;
  }
  const fallback =
    product.colors.find((color) => color.id === product.defaultColorId) ?? product.colors[0];
  return fallback!;
}

export async function GET(request: NextRequest) {
  return guardedJson(request, (sessionId) => {
    const items = cartStore.get(sessionId);
    const summary = orderStore.summarizeItems(items);
    return { items, summary };
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AddBody;
  const quantity =
    typeof body.quantity === "number" && Number.isFinite(body.quantity)
      ? Math.max(1, Math.floor(body.quantity))
      : 1;

  if (!body.productId || typeof body.productId !== "string") {
    return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });
  }
  if (!body.size || typeof body.size !== "string") {
    return NextResponse.json({ ok: false, error: "size required" }, { status: 400 });
  }

  const product = getProductById(body.productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: "Unknown product" }, { status: 404 });
  }

  return guardedJson(request, (sessionId) => {
    const color = resolveColor(product, body.colorId);
    const lineTotalCents = Math.round(product.priceCents * quantity);
    const nextItem: CartItem = {
      productId: product.id,
      productName: product.name,
      colorId: color.id,
      colorLabel: color.label,
      size: body.size,
      quantity,
      lineTotalCents,
    };

    const merged = normalizeItems([...cartStore.get(sessionId), nextItem]);
    cartStore.set(sessionId, merged);
    const summary = orderStore.summarizeItems(merged);
    return { ok: true, items: merged, summary };
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as PatchBody;
  if (!body.productId || !body.colorId || !body.size) {
    return NextResponse.json({ ok: false, error: "productId, colorId, size required" }, { status: 400 });
  }
  const product = getProductById(body.productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: "Unknown product" }, { status: 404 });
  }

  return guardedJson(request, (sessionId) => {
    let items = [...cartStore.get(sessionId)];
    const idx = items.findIndex((i) => cartLineKey(i) === cartLineKey(body));
    if (idx === -1) {
      return NextResponse.json({ ok: false, error: "Line not found" }, { status: 404 });
    }

    const q = Math.floor(body.quantity);
    if (q <= 0) {
      items.splice(idx, 1);
    } else {
      const color = resolveColor(product, body.colorId);
      items[idx] = {
        ...items[idx],
        quantity: q,
        lineTotalCents: product.priceCents * q,
        colorId: color.id,
        colorLabel: color.label,
      };
    }

    cartStore.set(sessionId, items);
    const summary = orderStore.summarizeItems(items);
    return { ok: true, items, summary };
  });
}
