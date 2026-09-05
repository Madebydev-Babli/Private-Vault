import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/server/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vault_session")?.value;

  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.json({ authenticated: false });
  response.cookies.set("vault_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return response;
}
