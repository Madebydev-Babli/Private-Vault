import { notFound } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import LetterReader from "@/app/vault/letters/letter-reader";
import {
  decryptLetterContent,
  findLetter,
  serializeLetter,
} from "@/app/lib/server/letters";

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVaultSession();
  const letter = await findLetter((await params).id);
  if (!letter) notFound();
  return (
    <LetterReader
      letter={{
        ...serializeLetter(letter),
        content: decryptLetterContent(letter),
      }}
    />
  );
}
