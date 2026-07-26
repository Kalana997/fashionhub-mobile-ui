"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import {
  SiAmericanexpress,
  SiApplepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";
import { MobileFrame } from "@/components/mobile-frame";
import { FH_ORANGE } from "@/lib/fh-theme";
import { formatUsd } from "@/lib/format";
import type { CartItem } from "@/types/models";

const mapPreview = "/images/map-thumb.jpg";

type CartResponse = {
  items: CartItem[];
  summary: {
    subtotalCents: number;
    deliveryCents: number;
    totalCents: number;
  };
};

const DESIGN_ORDER_REF = "154619";

type PaymentBrandId = "visa" | "amex" | "mastercard" | "paypal" | "applepay";

type PaymentChip = {
  id: PaymentBrandId;
  label: string;
  Icon: typeof SiVisa;
};

/** Brand marks via Simple Icons; one option can be chosen (gateway not wired yet). */
const PAYMENT_BRANDS: PaymentChip[] = [
  { id: "visa", label: "Visa", Icon: SiVisa },
  { id: "amex", label: "American Express", Icon: SiAmericanexpress },
  { id: "mastercard", label: "Mastercard", Icon: SiMastercard },
  { id: "paypal", label: "PayPal", Icon: SiPaypal },
  { id: "applepay", label: "Apple Pay", Icon: SiApplepay },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [paymentBrandId, setPaymentBrandId] = useState<PaymentBrandId>("visa");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/cart", { credentials: "include" });
      if (!response.ok) {
        setError("Unable to load checkout.");
        return;
      }
      const data = (await response.json()) as CartResponse;
      setCart(data);
    })();
  }, []);

  const items = cart?.items ?? [];
  const summary = cart?.summary;
  const noteId = orderId
    ? orderId.replace(/-/g, "").slice(0, 6).toUpperCase()
    : DESIGN_ORDER_REF;

  async function payNow() {
    setError(null);
    setIsPending(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Payment could not be simulated.");
        return;
      }
      setOrderId(data.orderId as string);
      const refreshed = (await fetch("/api/cart", { credentials: "include" }).then((res) =>
        res.json(),
      )) as CartResponse;
      setCart(refreshed);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <MobileFrame className="flex h-[min(844px,100dvh)] max-h-[min(844px,100dvh)] min-h-0 flex-col overflow-hidden !pb-0">
      <header className="shrink-0 border-b border-gray-100/80 bg-white px-5 pb-4 pt-[26px]">
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            prefetch
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-800 transition hover:bg-gray-50 active:bg-gray-100"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
          </Link>
          <p className="text-[18px] font-semibold tracking-tight text-black">Checkout</p>
          <span className="h-10 w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin]">
        <div className="mx-auto max-w-[390px] space-y-8 px-5 pb-10 pt-5">
          <section>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              Delivery Address
            </p>
            <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex gap-4">
                <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image src={mapPreview} alt="" fill className="object-cover" sizes="76px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-bold leading-snug text-zinc-900">
                      25/3 Housing Estate, Sylhet
                    </p>
                    <button
                      type="button"
                      className="mt-px shrink-0 text-[13px] font-medium leading-none text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={1.5} />
                    Delivered in next 7 days
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              Payment Method
            </p>
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="flex flex-wrap gap-3"
            >
              {PAYMENT_BRANDS.map(({ id, label, Icon }) => {
                const selected = paymentBrandId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={label}
                    onClick={() => setPaymentBrandId(id)}
                    className={`inline-flex shrink-0 min-h-[42px] items-center justify-center rounded-xl border px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 ${
                      selected
                        ? "border-[#FF7A00] bg-[#FF7A00]/[0.06] shadow-[0_0_0_1px_rgba(255,122,0,0.28)]"
                        : "border-gray-200 bg-white active:scale-[0.98]"
                    }`}
                  >
                    <Icon className="h-[22px] w-auto max-w-[72px]" aria-hidden />
                  </button>
                );
              })}
            </div>
          </section>

          <div>
            <button
              type="button"
              className="w-full rounded-xl bg-gray-100 py-3 text-center text-gray-400"
            >
              Add Voucher
            </button>
          </div>

          <aside className="rounded-xl bg-gray-100 p-3 text-sm text-gray-500">
            <p className="leading-relaxed">
              <span className="font-semibold">Note:</span> Use order ID <span className="font-semibold">#{noteId}</span>{" "}
              when paying. Without it we can&apos;t confirm your payment.
            </p>
          </aside>

          <div className="space-y-3.5 rounded-2xl border border-black/[0.04] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-normal text-zinc-700">Total Items ({items.length})</span>
              <span className="font-bold text-zinc-900">{formatUsd(summary?.subtotalCents ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-normal text-zinc-700">Standard Delivery</span>
              <span className="font-bold text-zinc-900">{formatUsd(summary?.deliveryCents ?? 0)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-[16px] font-bold text-black">
              <span>Total Payment</span>
              <span>{formatUsd(summary?.totalCents ?? 0)}</span>
            </div>
          </div>

          {items.length === 0 && cart ? (
            <p className="text-center text-sm text-gray-500">
              Your cart is empty —{" "}
              <Link prefetch href="/explore" className="font-semibold" style={{ color: FH_ORANGE }}>
                continue shopping
              </Link>
              .
            </p>
          ) : null}

          {orderId ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
              Payment successful. Order ID: {orderId}
            </div>
          ) : null}

          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          {!cart && !error ? <p className="text-sm text-gray-500">Preparing checkout…</p> : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <button
          type="button"
          disabled={items.length === 0 || !!orderId || isPending || !cart}
          onClick={payNow}
          className="flex w-full max-w-[390px] mx-auto items-center justify-center rounded-full bg-[#FF7A00] py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(255,122,0,0.26)] transition disabled:cursor-not-allowed disabled:opacity-45 active:opacity-95"
        >
          {isPending ? "Processing…" : "Pay Now"}
        </button>
      </div>
    </MobileFrame>
  );
}
