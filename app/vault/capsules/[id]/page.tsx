import { notFound } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import CapsuleReader from "@/app/vault/capsules/capsule-reader";
import { decryptCapsuleContent, findCapsule, isCapsuleUnlocked, serializeCapsule } from "@/app/lib/server/capsules";

export default async function CapsulePage({ params }: { params: Promise<{ id: string }> }) {
  await requireVaultSession();
  const capsule = await findCapsule((await params).id);
  if (!capsule) notFound();
  const metadata = serializeCapsule(capsule);
  return <CapsuleReader capsule={isCapsuleUnlocked(capsule) ? { ...metadata, content: decryptCapsuleContent(capsule) } : metadata} />;
}