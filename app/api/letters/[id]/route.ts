import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  decryptLetterContent,
  deleteLetter,
  findLetter,
  parseLetterInput,
  serializeLetter,
  updateLetter,
} from "@/app/lib/server/letters";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

async function getId(context: { params: Promise<{ id: string }> }) {
  return (await context.params).id;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated()))
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const letter = await findLetter(await getId(context));
  if (!letter)
    return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  return NextResponse.json({
    letter: {
      ...serializeLetter(letter),
      content: decryptLetterContent(letter),
    },
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated()))
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const input = parseLetterInput(await request.json().catch(() => null));
  if (!input)
    return NextResponse.json(
      { error: "Please complete the letter details." },
      { status: 400 },
    );
  const id = await getId(context);
  const existing = await findLetter(id);
  if (!existing)
    return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  try {
    const changedContent = input.content !== decryptLetterContent(existing);
    const letter = await updateLetter(id, input, changedContent);
    if (!letter)
      return NextResponse.json({ error: "Letter not found." }, { status: 404 });
    return NextResponse.json({ letter: serializeLetter(letter) });
  } catch {
    return NextResponse.json(
      { error: "Unable to update this letter." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated()))
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const result = await deleteLetter(await getId(context));
  if (!result.deletedCount)
    return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
