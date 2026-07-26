import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products-data";

export async function GET() {
  const list = PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    priceCents: product.priceCents,
    previewImageSrc:
      product.imagesByColor[product.defaultColorId] ?? product.previewImageSrc,
  }));
  return NextResponse.json(list);
}
