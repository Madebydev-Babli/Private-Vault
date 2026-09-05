import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  decryptCapsuleContent,
  deleteCapsule,
  findCapsule,
  isCapsuleUnlocked,
  parseCapsuleUpdate,
  serializeCapsule,
  updateCapsule,
} from "@/app/lib/server/capsules";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

async function getId(context: { params: Promise<{ id: string }> }) {
  return (await context.params).id;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const capsule = await findCapsule(await getId(context));
  if (!capsule) return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
  const metadata = serializeCapsule(capsule);
  if (metadata.locked) return NextResponse.json({ capsule: metadata });
  return NextResponse.json({ capsule: { ...metadata, content: decryptCapsuleContent(capsule) } });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const id = await getId(context);
  const existing = await findCapsule(id);
  if (!existing) return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
  if (isCapsuleUnlocked(existing)) return NextResponse.json({ error: "Unlocked capsules are sealed permanently." }, { status: 409 });

  const input = parseCapsuleUpdate(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Choose a future unlock date and complete the capsule." }, { status: 400 });
  try {
    const capsule = await updateCapsule(id, input);
    if (!capsule) return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
    return NextResponse.json({ capsule: serializeCapsule(capsule) });
  } catch {
    return NextResponse.json({ error: "Unable to update this capsule." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const result = await deleteCapsule(await getId(context));
  if (!result.deletedCount) return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
