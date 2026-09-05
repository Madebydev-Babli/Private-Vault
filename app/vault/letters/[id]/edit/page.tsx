import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import LetterForm from "@/app/vault/letters/letter-form";
import { decryptLetterContent, findLetter } from "@/app/lib/server/letters";

export default async function EditLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVaultSession();
  const letter = await findLetter((await params).id);
  if (!letter) notFound();
  return (
    <main className="letter-editor-page">
      <header className="letter-editor-top">
        <Link href={`/vault/letters/${letter._id}`}>
          Letter / back to the page
        </Link>
        <span>Editing a page</span>
      </header>
      <section className="letter-editor-heading">
        <p className="home-eyebrow">03 / Edit letter</p>
        <h1>Say it another way.</h1>
        <p>The words can change shape as we keep them.</p>
      </section>
      <LetterForm
        letterId={letter._id}
        initial={{
          title: letter.title,
          date: letter.date,
          content: decryptLetterContent(letter),
        }}
      />
    </main>
  );
}
