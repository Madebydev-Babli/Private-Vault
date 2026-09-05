import { requireVaultSession } from "@/app/vault/vault-access";
import LetterArchive from "@/app/vault/letters/letter-archive";
import { listLetters, serializeLetter } from "@/app/lib/server/letters";

export default async function LettersPage() {
  await requireVaultSession();
  const letters = await listLetters();
  return <LetterArchive letters={letters.map(serializeLetter)} />;
}
