import Link from "next/link";
import { requireVaultSession } from "@/app/vault/vault-access";
import MemoryForm from "@/app/vault/memories/memory-form";

export default async function NewMemoryPage() {
  await requireVaultSession();
  return (
    <main className="memory-editor-page">
      <header className="memory-editor-top">
        <Link href="/vault/memories">Memories / back to the archive</Link>
        <span>A new chapter</span>
      </header>
      <section className="memory-editor-heading">
        <p className="home-eyebrow">The archive / new memory</p>
        <h1>Keep this one.</h1>
        <p>Every story begins with a moment.</p>
      </section>
      <MemoryForm />
    </main>
  );
}
