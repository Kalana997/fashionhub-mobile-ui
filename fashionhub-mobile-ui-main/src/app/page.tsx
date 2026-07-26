import Image from "next/image";
import Link from "next/link";
import { FH_ORANGE, FH_ORANGE_STROKE } from "@/lib/fh-theme";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-transparent pb-6 pt-8">
      {/* Second style layer: soft dot field + warm corner wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(rgba(20,20,24,0.07)_1px,transparent_1px)] bg-[length:22px_22px] opacity-[0.85]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-[#FF7A00]/14 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-32 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl"
        aria-hidden
      />

      <div
        className="relative mx-auto flex min-h-screen max-w-[390px] flex-col justify-between rounded-[32px] border-x-0 border-t-2 border-b-2 border-solid bg-white/95 px-5 pb-8 pt-7 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.18)] ring-1 ring-neutral-200/60 backdrop-blur-[2px]"
        style={{ borderTopColor: FH_ORANGE_STROKE, borderBottomColor: FH_ORANGE_STROKE }}
      >
        <div>
          <div className="relative">
            {/* Brand wash + depth behind single Home asset */}
            <div
              className="pointer-events-none absolute left-4 right-4 top-6 z-0 h-[88%] rounded-[32px] bg-gradient-to-br from-[#FF7A00]/30 via-[#FF7A00]/08 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative z-10 translate-x-[-2px] -rotate-[1deg] pt-2">
              <div className="rounded-[26px] bg-white p-1 shadow-[0_22px_50px_-18px_rgba(26,26,26,0.35)] ring-1 ring-neutral-900/[0.05]">
                <div className="relative overflow-hidden rounded-[21px]">
                  <div className="relative aspect-[4/5] w-full bg-neutral-100">
                    <Image
                      src="/images/Home.jpg"
                      alt="FashionHub home collection spotlight"
                      fill
                      sizes="360px"
                      className="object-cover object-[center_22%]"
                      priority
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-sm font-semibold tracking-tight text-white drop-shadow-md">
                    Your style, one tap away
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -right-1 top-2 z-20 rotate-3 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7A00] shadow-lg backdrop-blur-sm">
              Home
            </div>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" aria-hidden />
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF7A00]">
              New in
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" aria-hidden />
          </div>

          <h1 className="mt-6 text-[2rem] font-extrabold leading-[1.2] tracking-tight text-neutral-900">
            Find The <br />
            <span className="bg-gradient-to-r from-[#FF7A00] via-[#ff8f3a] to-[#ff6a00] bg-clip-text text-transparent">
              Best Collections
            </span>
          </h1>

          <p className="mt-5 flex gap-3 rounded-2xl border border-neutral-100 bg-gradient-to-br from-neutral-50/90 to-white px-4 py-3.5 text-[15px] leading-relaxed text-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <span className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#FF7A00]" aria-hidden />
            <span>
              Get your dream item easily with FashionHub and get other interesting offer
            </span>
          </p>
        </div>

        <div className="pb-[max(0px,env(safe-area-inset-bottom))] pt-4">
          <div className="mt-6 flex gap-3">
            <Link
              href="/explore"
              prefetch
              scroll
              className="flex-1 rounded-full border-2 border-neutral-900 py-3.5 text-center text-[15px] font-semibold text-neutral-900 shadow-sm transition active:scale-[0.98] active:bg-neutral-50"
            >
              Sign Up
            </Link>
            <Link
              href="/explore"
              prefetch
              scroll
              className="flex-1 rounded-full bg-[#FF7A00] py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_14px_34px_-8px_rgba(255,122,0,0.55)] ring-2 ring-[#FF7A00]/35 transition active:scale-[0.98] active:opacity-95"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-center text-[11px] font-medium tracking-wide text-neutral-400">
            © 2026 FashionHub
          </p>
        </div>
      </div>
    </div>
  );
}
