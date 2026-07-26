import { NextResponse, type NextRequest } from "next/server";
import { getProductById } from "@/lib/products-data";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteCtx) {
  const { id } = await context.params;
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
