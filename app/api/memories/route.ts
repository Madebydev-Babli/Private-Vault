import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  deleteCloudinaryMedia,
  uploadMemoryImage,
} from "@/app/lib/server/cloudinary";
import {
  createMemory,
  getMemoryImage,
  listMemories,
  parseMemoryFields,
  serializeMemory,
} from "@/app/lib/server/memories";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  const memories = await listMemories();
  return NextResponse.json({ memories: memories.map(serializeMemory) });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  const formData = await request.formData().catch(() => null);
  if (!formData)
    return NextResponse.json(
      { error: "Invalid memory form." },
      { status: 400 },
    );
  const input = parseMemoryFields(formData);
  if (!input) {
    return NextResponse.json(
      { error: "Please complete the memory details." },
      { status: 400 },
    );
  }
  let uploadedMedia: Awaited<ReturnType<typeof uploadMemoryImage>> | undefined;
  try {
    const image = getMemoryImage(formData);
    uploadedMedia = image ? await uploadMemoryImage(image) : undefined;
    const memory = await createMemory({
      ...input,
      ...(uploadedMedia ? { media: uploadedMedia } : {}),
    });
    return NextResponse.json(
      { memory: serializeMemory(memory) },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedMedia) {
      try {
        await deleteCloudinaryMedia(uploadedMedia);
      } catch (cleanupError) {
        console.error(
          "Unable to clean up the uploaded memory image.",
          cleanupError,
        );
      }
    }
    if (error instanceof Error && error.message.startsWith("Please choose")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to save this memory." },
      { status: 500 },
    );
  }
}
