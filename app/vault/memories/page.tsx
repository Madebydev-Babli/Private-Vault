import { requireVaultSession } from "@/app/vault/vault-access";
import MemoryArchive from "@/app/vault/memories/memory-archive";
import { listMemories, serializeMemory } from "@/app/lib/server/memories";

export default async function MemoriesPage() {
  await requireVaultSession();
  const memories = await listMemories();
  return <MemoryArchive memories={memories.map(serializeMemory)} />;
}
