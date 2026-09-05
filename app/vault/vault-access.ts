import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSessionValid } from "@/app/lib/server/auth";

export async function requireVaultSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("vault_session")?.value;

  if (!(await isSessionValid(rawToken))) {
    redirect("/login");
  }
}
