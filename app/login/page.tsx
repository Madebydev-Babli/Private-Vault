import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSessionValid } from "@/app/lib/server/auth";
import LoginForm from "@/app/login/login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("vault_session")?.value;

  if (await isSessionValid(rawToken)) {
    redirect("/vault");
  }

  return <LoginForm />;
}
