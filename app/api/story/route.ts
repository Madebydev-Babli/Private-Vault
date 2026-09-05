import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";

export async function GET() {
  const cookieStore = await cookies();
  if (!(await isSessionValid(cookieStore.get("vault_session")?.value)))
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  return NextResponse.json({ memories: [] });
}
