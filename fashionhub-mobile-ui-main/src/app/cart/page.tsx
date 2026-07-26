"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { MobileFrame } from "@/components/mobile-frame";
import { BottomNav } from "@/components/fashion-shell";
import { formatUsd } from "@/lib/format";
import { FH_ORANGE } from "@/lib/fh-theme";
import { getProductById } from "@/lib/products-data";
import type { CartItem } from "@/types/models";

type CartResponse = {
  items: CartItem[];
  summary: {
    subtotalCents: number;
    deliveryCents: number;
    totalCents: number;
  };
};

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/cart", { credentials: "include" });
    if (!response.ok) {
      setError("Unable to load cart.");
      return;
    }
    const data = (await response.json()) as CartResponse;
    setCart(data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchLine(item: CartItem, quantity: number) {
    const key = `${item.productId}|${item.colorId}|${item.size}`;
    setBusyKey(key);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: item.productId,
          colorId: item.colorId,
          size: item.size,
          quantity,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Could not update line.");
        return;
      }
      setCart({
        items: data.items as CartItem[],
        summary: data.summary as CartResponse["summary"],
      });
    } finally {
      setBusyKey(null);
    }
  }

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  return (
    <MobileFrame className="flex h-[min(844px,100dvh)] max-h-[min(844px,100dvh)] min-h-0 flex-col overflow-hidden !pb-0">
      <header className="shrink-0 px-5 pb-3 pt-[30px]">
        <div className="flex items-center justify-between">
          <Link
            href="/explore"
            prefetch
            aria-label="Back"
            className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-black/[0.06] bg-white shadow-[0_6px_20px_rgba(15,15,15,0.08)]"
          >
            <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={1.45} />
          </Link>
          <p className="text-[17px] font-semibold tracking-tight text-black">Cart</p>
          <span className="inline-block h-11 w-11 rounded-full opacity-0" aria-hidden />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4">
        <p className="pb-5 text-[31px] font-bold tracking-tight text-[#0A0A0A]">My Orders</p>

        {!cart && !error ? <p className="text-sm text-[#7B7F88]">Loading cart…</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const thumbnail =
              getProductById(item.productId)?.previewImageSrc ?? "/images/cart-fallback.jpg";
            const colorHex =
              getProductById(item.productId)?.colors.find((c) => c.id === item.colorId)?.hex ??
              "#C89B6B";
            const key = `${item.productId}|${item.colorId}|${item.size}`;
            const busy = busyKey === key;

            return (
              <div key={`${key}-${index}`} className="relative rounded-2xl bg-white p-4">
                <button
                  type="button"
                  aria-label="Remove item"
                  disabled={busy}
                  onClick={() => void patchLine(item, 0)}
                  className="absolute right-3 top-3 z-10 text-gray-400 transition hover:text-gray-600 disabled:opacity-40"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>

                <div className="flex gap-3 pr-10">
                  <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-[14px] bg-[#F3F6FA]">
                    <Image src={thumbnail} alt="" fill className="object-cover" sizes="104px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="truncate pr-1 text-[16px] font-bold text-[#111]">{item.productName}</p>
                    <p className="text-sm text-gray-400">Size : {item.size}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Color</span>
                      <span
                        className="inline-block h-[18px] w-[18px] rounded-full border border-gray-300"
                        style={{ backgroundColor: colorHex }}
                        title={item.colorLabel}
                      />
                    </div>
                    <div className="mt-1 flex items-end justify-between gap-3 pt-1">
                      <p className="text-[17px] font-bold text-black">{formatUsd(item.lineTotalCents)}</p>
                      <p className="text-lg font-medium text-black">{item.quantity}x</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && cart ? (
            <div className="rounded-[20px] border border-dashed border-[#D6DADF] px-6 py-8 text-center text-[15px] text-[#959BA5]">
              Your cart is empty.
              <div className="pt-4">
                <Link
                  prefetch
                  href="/explore"
                  className="text-[15px] font-semibold"
                  style={{ color: FH_ORANGE }}
                >
                  Browse Explore
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-4 rounded-[22px] border border-black/[0.05] bg-[#FAFAFC] px-5 py-5">
          <div className="flex items-center justify-between text-[15px] font-semibold">
            <span className="text-[#9A9EA6]">Total Items ({items.length})</span>
            <span className="text-black">{formatUsd(summary?.subtotalCents ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between text-[15px] font-semibold">
            <span className="text-[#9A9EA6]">Shipping</span>
            <span className="text-black">{formatUsd(summary?.deliveryCents ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-black/[0.06] pt-4 text-[18px] font-bold text-black">
            <span>Total Payment</span>
            <span>{formatUsd(summary?.totalCents ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-black/[0.06] bg-white px-5 pb-4 pt-3">
        <Link
          href="/checkout"
          prefetch
          onClick={(event) => {
            if (items.length === 0) event.preventDefault();
          }}
          aria-disabled={items.length === 0}
          className={`relative z-10 flex w-full items-center justify-center rounded-[18px] py-[17px] text-[16px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_32px_rgba(255,102,0,0.28)] ${
            items.length === 0 ? "pointer-events-none cursor-not-allowed opacity-35" : "cursor-pointer"
          }`}
          style={{ backgroundColor: FH_ORANGE }}
        >
          Checkout Now
        </Link>
      </div>

      <BottomNav path="cart" variant="inline" />
    </MobileFrame>
  );
}
