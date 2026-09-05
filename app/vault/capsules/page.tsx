import { requireVaultSession } from "@/app/vault/vault-access";
import CapsuleArchive from "@/app/vault/capsules/capsule-archive";
import { listCapsules, serializeCapsule } from "@/app/lib/server/capsules";

export default async function CapsulesPage() {
  await requireVaultSession();
  const capsules = await listCapsules();
  return <CapsuleArchive capsules={capsules.map((capsule) => serializeCapsule(capsule))} />;
}
