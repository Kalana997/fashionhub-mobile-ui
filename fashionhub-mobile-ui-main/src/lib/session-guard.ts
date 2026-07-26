import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sessionCookieName, sessionCookieOptions, sessionTrustHeader } from "@/lib/cookie-names";

function parseCookieHeader(raw: string | null | undefined, name: string): string | undefined {
  if (!raw) return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = raw.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`));
  if (!m?.[1]) return undefined;
  try {
    return decodeURIComponent(m[1].trim());
  } catch {
    return m[1].trim();
  }
}

/** Resolves visitor id from the inbound Request plus `next/headers` fallbacks — always returns a UUID. */

export async function resolveSessionId(request: NextRequest): Promise<string> {
  const name = sessionCookieName();

  let id =
    request.cookies.get(name)?.value ??
    parseCookieHeader(request.headers.get("cookie"), name);

  const hk = sessionTrustHeader();
  id ??= request.headers.get(hk) ?? request.headers.get(hk.toLowerCase()) ?? undefined;

  if (!id) {
    try {
      id =
        (await cookies()).get(name)?.value ??
        parseCookieHeader((await headers()).get("cookie"), name);
      id ??= (await headers()).get(hk) ?? undefined;
    } catch {
      /* next/headers may be unavailable outside a request */
    }
  }

  if (!id) {
    id = crypto.randomUUID();
  }

  return id;
}

/** If the browser omitted `fh_sid`, mirror the active session onto the outgoing response. */

function attachSessionCookieIfMissing(
  response: NextResponse,
  request: NextRequest,
  sessionId: string,
) {
  const name = sessionCookieName();
  const already =
    request.cookies.get(name)?.value ?? parseCookieHeader(request.headers.get("cookie"), name);
  if (already) return;
  response.cookies.set(name, sessionId, sessionCookieOptions());
}

/**
 * API routes: resolves session, runs the handler, and guarantees Set-Cookie on first contact
 * (fixes intermittent 401 “Session required” when middleware headers do not reach the handler).
 */

export async function guardedJson(
  request: NextRequest,
  runner: (sessionId: string) => unknown | Promise<unknown>,
): Promise<Response> {
  const sessionId = await resolveSessionId(request);
  const result = await Promise.resolve(runner(sessionId));

  if (result instanceof NextResponse) {
    attachSessionCookieIfMissing(result, request, sessionId);
    return result;
  }

  const res = NextResponse.json(result);
  attachSessionCookieIfMissing(res, request, sessionId);
  return res;
}
