import VaultPlaceholder from "@/app/vault/vault-placeholder";
import { requireVaultSession } from "@/app/vault/vault-access";

export default async function VoicePage() {
  await requireVaultSession();
  return (
    <VaultPlaceholder
      eyebrow="The archive / voice"
      title="Voices we remember"
      description="A quiet place for the sounds and sentences we never want to lose."
    />
  );
}
