import { notFound } from "next/navigation";
import { MobileFrame } from "@/components/mobile-frame";
import { getProductById } from "@/lib/products-data";
import { ProductDetailClient } from "./product-detail";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <MobileFrame className="!pb-8">
      <ProductDetailClient product={product} />
    </MobileFrame>
  );
}
