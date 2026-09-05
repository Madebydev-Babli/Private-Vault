import { NextResponse } from "next/server";
import {
  createSession,
  sessionMaxAge,
  verifyCredentials,
} from "@/app/lib/server/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 10;

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const current = attempts.get(address);
  const record =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

  if (record.count >= maxAttempts) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  record.count += 1;
  attempts.set(address, record);

  try {
    const body = await request.json();
    const email = body?.email;
    const password = body?.password;

    const hasPassword =
      typeof password === "string" &&
      password.length >= 1 &&
      password.length <= 256;

    const isAuthenticated =
      hasPassword &&
      isValidEmail(email) &&
      (await verifyCredentials(email, password));

    if (!hasPassword || !isAuthenticated) {
      return NextResponse.json(
        { error: "That doesn't look right. Please try again." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("vault_session", await createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionMaxAge,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "That doesn't look right. Please try again." },
      { status: 401 },
    );
  }
}
