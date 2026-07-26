import { MobileFrame } from "@/components/mobile-frame";
import { BottomNav, ExploreHeader } from "@/components/fashion-shell";
import { PRODUCTS } from "@/lib/products-data";
import { ExploreProducts } from "./explore-products";

const categories = ["All", "Men", "Women", "Kids", "Other"];

export default function ExplorePage() {
  return (
    <MobileFrame className="!pb-28">
      <ExploreHeader />

      <div className="px-5">
        <p className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#101010]">
          Explore
        </p>
        <p className="mt-2 pb-6 text-[15px] font-medium tracking-tight text-[#9A9A9A]">
          Best trendy collection!
        </p>

        <div className="-mx-5 mt-4 flex items-center gap-6 overflow-x-auto px-5 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((label) => {
            const selected = label === "All";
            return (
              <span
                key={label}
                className={`shrink-0 cursor-default rounded-full px-5 py-2 text-[14px] tracking-tight ${
                  selected
                    ? "bg-[#FF7A00] font-semibold text-white shadow-lg shadow-orange-200"
                    : "font-medium text-[#101010]"
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>

        <ExploreProducts products={PRODUCTS} />
      </div>

      <BottomNav path="home" variant="fixed" />
    </MobileFrame>
  );
}
