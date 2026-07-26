/** HttpOnly cookie name for mock-session identity. Matches README / env overrides. */

export function sessionCookieName(): string {
  return process.env.FH_SESSION_COOKIE_NAME ?? "fh_sid";
}

/** Populated in middleware — forwarded on the rewritten request when supported. */

export function sessionTrustHeader(): string {
  return process.env.FH_SESSION_HEADER_NAME ?? "x-fh-session-id";
}

/** Options shared by `middleware.ts` and API routes that finalize the cookie. */

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
