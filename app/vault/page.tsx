import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VaultHome from "@/app/vault/vault-home";
import { isSessionValid } from "@/app/lib/server/auth";

export default async function VaultPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("vault_session")?.value;

  if (!(await isSessionValid(rawToken))) {
    redirect("/login");
  }

  return <VaultHome />;
}
