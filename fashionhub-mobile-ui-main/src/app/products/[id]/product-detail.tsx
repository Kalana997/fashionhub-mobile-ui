"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import type { Product } from "@/types/models";
import { formatUsd } from "@/lib/format";

type Props = { product: Product };

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const [colorId, setColorId] = useState(product.defaultColorId);
  const [size, setSize] = useState(
    () => (product.sizes.includes("L") ? "L" : (product.sizes[0] ?? "M")),
  );
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"ok" | "err">("ok");
  const [isPending, setIsPending] = useState(false);

  const imageSrc = useMemo(() => {
    return (
      product.imagesByColor[colorId] ??
      product.imagesByColor[product.defaultColorId] ??
      product.previewImageSrc
    );
  }, [colorId, product]);

  async function handleAddToCart() {
    setToast(null);
    setIsPending(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          colorId,
          size,
          quantity: 1,
        }),
      });

      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        data = { error: "Invalid response from server." };
      }

      if (!response.ok || !data?.ok) {
        setToastTone("err");
        setToast(data?.error ?? "Could not update cart.");
        return;
      }

      setToastTone("ok");
      setToast("Added to cart");
      window.setTimeout(() => {
        router.push("/cart");
      }, 450);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <Link
          href="/explore"
          prefetch
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:translate-y-[0.5px]"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        <p className="text-[17px] font-semibold text-black">Details</p>
        <button
          type="button"
          aria-label="Save item"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:bg-neutral-100"
        >
          <Bookmark size={18} strokeWidth={2} />
        </button>
      </header>

      <div className="px-4">
        <div className="relative h-[320px] w-full overflow-hidden rounded-3xl">
          <Image
            key={`${product.id}:${colorId}`}
            src={imageSrc}
            alt={product.name}
            fill
            priority
            className="object-cover transition-opacity duration-200"
            sizes="390px"
          />
        </div>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="max-w-[200px] text-xl font-semibold leading-tight tracking-tight text-black">{product.name}</h1>
          <div className="flex shrink-0 gap-2 pt-0.5">
            {product.colors.map((swap) => {
              const selected = swap.id === colorId;
              return (
                <button
                  key={swap.id}
                  type="button"
                  aria-label={swap.label}
                  aria-pressed={selected}
                  onClick={() => setColorId(swap.id)}
                  className={selected ? "rounded-full ring-2 ring-black ring-offset-2 ring-offset-white" : "rounded-full"}
                >
                  <span
                    className="block h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: swap.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm text-gray-500">Size</p>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((label) => {
              const chosen = label === size;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => setSize(label)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-[15px] font-semibold transition ${
                    chosen ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {toast ? (
          <p
            aria-live="polite"
            className={`mt-4 text-center text-sm font-medium ${toastTone === "ok" ? "text-emerald-700" : "text-red-600"}`}
          >
            {toast}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-2xl font-bold tracking-tight text-black">{formatUsd(product.priceCents)}</p>
          <button
            type="button"
            disabled={isPending}
            onClick={handleAddToCart}
            className="shrink-0 rounded-full bg-[#FF7A00] px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-orange-200 transition active:opacity-95 disabled:opacity-50"
          >
            {isPending ? "Adding…" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
