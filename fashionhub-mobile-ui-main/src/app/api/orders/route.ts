import { type NextRequest, NextResponse } from "next/server";
import { cartStore, orderStore } from "@/lib/in-memory-db";
import { guardedJson } from "@/lib/session-guard";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return guardedJson(request, (sessionId) => {
    const items = cartStore.get(sessionId);
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 422 });
    }

    const summary = orderStore.summarizeItems(items);
    const orderId = `FH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    orderStore.add({
      id: orderId,
      sessionId,
      items: structuredClone(items),
      subtotalCents: summary.subtotalCents,
      deliveryCents: summary.deliveryCents,
      totalCents: summary.totalCents,
      paid: true,
      createdAtIso: new Date().toISOString(),
    });
    cartStore.clear(sessionId);

    return {
      ok: true,
      orderId,
      paid: true,
      totalCents: summary.totalCents,
    };
  });
}
