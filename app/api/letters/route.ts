import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  createLetter,
  listLetters,
  parseLetterInput,
  serializeLetter,
} from "@/app/lib/server/letters";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const letters = await listLetters();
  return NextResponse.json({ letters: letters.map(serializeLetter) });
}

export async function POST(request: Request) {
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
  try {
    const letter = await createLetter(input);
    return NextResponse.json(
      { letter: serializeLetter(letter) },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE LETTER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to save this letter." },
      { status: 500 },
    );
  }
}
