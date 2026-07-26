"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/models";
import { formatUsd } from "@/lib/format";

export function ExploreProducts({ products }: { products: Product[] }) {
  const router = useRouter();

  async function quickAdd(
    event: React.MouseEvent,
    product: Product,
  ) {
    event.preventDefault();
    event.stopPropagation();
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId: product.id,
        colorId: product.defaultColorId,
        size: "L",
        quantity: 1,
      }),
    });
    router.refresh();
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-5 pb-32">
      {products.map((product) => {
        const thumbnail =
          product.imagesByColor[product.defaultColorId] ?? product.previewImageSrc;
        return (
          <div key={product.id}>
            <div className="relative">
              <Link
                href={`/products/${product.id}`}
                className="relative block overflow-hidden rounded-3xl bg-[#F4F6FA] shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
                aria-label={`View ${product.name}`}
              >
                <Image
                  src={thumbnail}
                  alt=""
                  width={220}
                  height={170}
                  sizes="(max-width: 430px) 45vw, 200px"
                  className="h-[170px] w-full rounded-3xl object-cover"
                />
              </Link>
              <button
                type="button"
                aria-label={`Add ${product.name} to cart`}
                onClick={(e) => void quickAdd(e, product)}
                className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
              >
                <ShoppingBag size={16} strokeWidth={2.2} className="text-white" aria-hidden />
              </button>
            </div>
            <Link href={`/products/${product.id}`} className="mt-2 block">
              <p className="text-lg font-semibold tracking-tight text-black">{formatUsd(product.priceCents)}</p>
              <p className="line-clamp-2 pt-1 text-sm leading-snug text-gray-400">{product.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
