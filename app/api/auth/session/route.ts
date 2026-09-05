import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json({
    authenticated: await isSessionValid(
      cookieStore.get("vault_session")?.value,
    ),
  });
}
