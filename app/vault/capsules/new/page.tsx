import Link from "next/link";
import { requireVaultSession } from "@/app/vault/vault-access";
import CapsuleForm from "@/app/vault/capsules/capsule-form";

export default async function NewCapsulePage() {
  await requireVaultSession();
  return <main className="capsule-editor-page"><header className="capsule-editor-top"><Link href="/vault/capsules">Capsules / back to the archive</Link><span>A sealed page</span></header><section className="capsule-editor-heading"><p className="home-eyebrow">04 / For another day</p><h1>Write for later.</h1><p>Some words are meant to wait.</p></section><CapsuleForm /></main>;
}