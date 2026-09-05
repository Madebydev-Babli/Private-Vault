import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  createCapsule,
  listCapsules,
  parseCapsuleInput,
  serializeCapsule,
} from "@/app/lib/server/capsules";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const capsules = await listCapsules();
  return NextResponse.json({ capsules: capsules.map((capsule) => serializeCapsule(capsule)) });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const input = parseCapsuleInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Choose a future unlock date and complete the capsule." }, { status: 400 });
  try {
    const capsule = await createCapsule(input);
    return NextResponse.json({ capsule: serializeCapsule(capsule) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save this capsule." }, { status: 500 });
  }
}
