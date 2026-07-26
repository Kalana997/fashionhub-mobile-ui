import { NextResponse, type NextRequest } from "next/server";
import {
  sessionCookieName,
  sessionCookieOptions,
  sessionTrustHeader,
} from "@/lib/cookie-names";

export function middleware(request: NextRequest) {
  const name = sessionCookieName();
  const headerKey = sessionTrustHeader();
  const existing = request.cookies.get(name)?.value;
  const sessionValue = existing ?? crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(headerKey);
  requestHeaders.set(headerKey, sessionValue);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!existing) {
    response.cookies.set(name, sessionValue, sessionCookieOptions());
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
