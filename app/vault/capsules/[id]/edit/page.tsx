import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import CapsuleForm from "@/app/vault/capsules/capsule-form";
import { findCapsule, isCapsuleUnlocked } from "@/app/lib/server/capsules";

export default async function EditCapsulePage({ params }: { params: Promise<{ id: string }> }) {
  await requireVaultSession();
  const capsule = await findCapsule((await params).id);
  if (!capsule) notFound();
  if (isCapsuleUnlocked(capsule)) redirect(`/vault/capsules/${capsule._id}`);
  return <main className="capsule-editor-page"><header className="capsule-editor-top"><Link href={`/vault/capsules/${capsule._id}`}>Capsule / back to the seal</Link><span>Editing a seal</span></header><section className="capsule-editor-heading"><p className="home-eyebrow">04 / Edit capsule</p><h1>Still time to add more.</h1><p>This capsule has not reached its day yet. Its sealed message stays private unless you replace it.</p></section><CapsuleForm capsuleId={capsule._id} initial={{ title: capsule.title, content: "", unlockAt: capsule.unlockAt.toISOString() }} /></main>;
}