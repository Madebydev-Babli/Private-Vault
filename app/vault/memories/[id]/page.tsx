import { notFound } from "next/navigation";
import { requireVaultSession } from "@/app/vault/vault-access";
import MemoryDetail from "@/app/vault/memories/memory-detail";
import { findMemory, serializeMemory } from "@/app/lib/server/memories";

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVaultSession();
  const memory = await findMemory((await params).id);
  if (!memory) notFound();
  return <MemoryDetail memory={serializeMemory(memory)} />;
}
