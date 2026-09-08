import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import MemoryForm from "@/app/vault/memories/memory-form";
import { findMemory } from "@/app/lib/server/memories";

export default async function EditMemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVaultSession();
  const memory = await findMemory((await params).id);
  if (!memory) notFound();
  return (
    <main className="memory-editor-page">
      <header className="memory-editor-top">
        <Link href={`/vault/memories/${memory._id}`}>
          Memory / back to the moment
        </Link>
        <span>Editing a chapter</span>
      </header>
      <section className="memory-editor-heading">
        <p className="home-eyebrow">The archive / edit memory</p>
        <h1>Make a little room for more.</h1>
        <p>Some memories change shape as we keep them.</p>
      </section>
      <MemoryForm
        memoryId={memory._id}
        initial={{
          title: memory.title,
          story: memory.story,
          date: memory.date,
          perspective: memory.perspective ?? "ritika",
          media: memory.media,
        }}
      />
    </main>
  );
}
