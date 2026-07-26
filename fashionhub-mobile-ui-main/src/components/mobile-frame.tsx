/** Centers the mock on wide viewports, or edge-to-edge when `variant="fullscreen"`. */

import type { ReactNode } from "react";
import { FH_ORANGE_STROKE, FH_SHELL_GRAY } from "@/lib/fh-theme";

/** iPhone 13 / 14 logical layout (CSS `pt`) — canonical device frame size */
export const IPHONE_13_LAYOUT = { width: 390, height: 844 } as const;

export function MobileFrame({
  children,
  className = "",
  outerClassName = "",
  variant = "phone",
}: {
  children: ReactNode;
  className?: string;
  outerClassName?: string;
  variant?: "phone" | "fullscreen";
}) {
  if (variant === "fullscreen") {
    return (
      <div
        className={`flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-x-hidden border-x-0 border-t-2 border-b-2 border-solid bg-transparent shadow-none ring-0 ${outerClassName} ${className}`}
        style={{ borderTopColor: FH_ORANGE_STROKE, borderBottomColor: FH_ORANGE_STROKE }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100svh] w-full pb-6 pt-8 ${outerClassName}`}
      style={{ backgroundColor: FH_SHELL_GRAY }}
    >
      <div
        className={`relative mx-auto box-border flex w-full max-w-[390px] min-h-[min(844px,100dvh)] flex-col overflow-x-hidden border-x-0 border-t-2 border-b-2 border-solid bg-white pb-28 shadow-xl ring-1 ring-black/[0.04] md:rounded-[42px] ${className}`}
        style={{ borderTopColor: FH_ORANGE_STROKE, borderBottomColor: FH_ORANGE_STROKE }}
      >
        {children}
      </div>
    </div>
  );
}
