import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MemoryStory from "@/app/memory-story";
import { isSessionValid } from "@/app/lib/server/auth";

export default async function StoryPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("vault_session")?.value;

  if (!(await isSessionValid(rawToken))) {
    redirect("/login");
  }

  return <MemoryStory />;
}
