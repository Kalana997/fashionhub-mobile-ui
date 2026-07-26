import Link from "next/link";
import { MobileFrame } from "@/components/mobile-frame";
import { FH_ORANGE } from "@/lib/fh-theme";

export default function NotFound() {
  return (
    <MobileFrame>
      <div className="flex flex-1 flex-col items-center gap-6 px-8 py-16 text-center">
        <p className="text-[32px] font-bold text-[#161616]">We could not find this look.</p>
        <p className="text-[16px] leading-relaxed text-[#8B8F98]">
          The product may have been archived. Head back to the product list to keep shopping.
        </p>
        <Link
          href="/explore"
          className="rounded-full px-8 py-4 text-[15px] font-semibold uppercase tracking-[0.26em] text-white shadow-[0_20px_40px_rgba(255,102,0,0.35)]"
          style={{ backgroundColor: FH_ORANGE }}
        >
          Back to Products
        </Link>
      </div>
    </MobileFrame>
  );
}
