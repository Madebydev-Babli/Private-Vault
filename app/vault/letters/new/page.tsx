import Link from "next/link";
import { requireVaultSession } from "@/app/vault/vault-access";
import LetterForm from "@/app/vault/letters/letter-form";

export default async function NewLetterPage() {
  await requireVaultSession();
  return (
    <main className="letter-editor-page">
      <header className="letter-editor-top">
        <Link href="/vault/letters">Letters / back to the archive</Link>
        <span>A new page</span>
      </header>
      <section className="letter-editor-heading">
        <p className="home-eyebrow">03 / Words we kept</p>
        <h1>Write it down.</h1>
        <p>Some things are easier to write than to say.</p>
      </section>
      <LetterForm />
    </main>
  );
}
