import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePrefixes = [
  "/vault",
  "/memories",
  "/letters",
  "/gallery",
  "/capsules",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privatePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (!request.cookies.get("vault_session")?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vault/:path*",
    "/memories/:path*",
    "/letters/:path*",
    "/gallery/:path*",
    "/capsules/:path*",
  ],
};
