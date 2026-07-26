"use client";

import Link from "next/link";
import { Home, LayoutGrid, Search, Settings, ShoppingBag, UserRound } from "lucide-react";
import { FH_ORANGE } from "@/lib/fh-theme";

export type BottomNavPath = "home" | "search" | "cart" | "settings";

function NavIcon({
  Icon,
  label,
  href,
  active,
  badge,
}: {
  Icon: typeof Home;
  label: string;
  href: string;
  active: boolean;
  badge?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch
      className="relative z-10 flex flex-1 flex-col items-center gap-1 text-[11px] font-semibold tracking-tight"
    >
      <span className="relative">
        <Icon className="h-6 w-6" strokeWidth={1.5} color={active ? FH_ORANGE : "#B3B3B3"} />
        {badge ? (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        ) : null}
      </span>
      <span style={{ color: active ? FH_ORANGE : "#B3B3B3" }}>{label}</span>
    </Link>
  );
}

export function BottomNav({
  path,
  variant = "fixed",
}: {
  path: BottomNavPath;
  variant?: "fixed" | "inline";
}) {
  const positionClass =
    variant === "fixed"
      ? "pointer-events-auto absolute bottom-0 left-0 right-0 z-30"
      : "relative z-20 mt-auto w-full shrink-0";

  return (
    <nav
      className={`${positionClass} rounded-t-3xl border-t border-black/[0.06] bg-white px-6 py-[14px] shadow-lg`}
    >
      <div className="flex items-center justify-between gap-2">
        <NavIcon href="/explore" label="Home" Icon={Home} active={path === "home"} />
        <NavIcon href="/explore?q=" label="Search" Icon={Search} active={path === "search"} />
        <NavIcon href="/cart" label="Cart" Icon={ShoppingBag} active={path === "cart"} badge />
        <NavIcon
          href="/explore?view=settings"
          label="Settings"
          Icon={Settings}
          active={path === "settings"}
        />
      </div>
    </nav>
  );
}

export function ExploreHeader() {
  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-[28px]">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-[18px] border border-black/[0.06] bg-white shadow-[0_8px_24px_rgba(15,15,15,0.08)]"
        aria-label="Menu"
      >
        <LayoutGrid className="h-[22px] w-[22px]" strokeWidth={1.55} />
      </button>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EFEFEF]" aria-hidden>
        <UserRound className="h-[22px] w-[22px] text-neutral-900" strokeWidth={1.4} />
      </span>
    </header>
  );
}
