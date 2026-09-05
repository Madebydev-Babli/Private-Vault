import VaultPlaceholder from "@/app/vault/vault-placeholder";
import { requireVaultSession } from "@/app/vault/vault-access";

export default async function MapPage() {
  await requireVaultSession();
  return (
    <VaultPlaceholder
      eyebrow="Where we were"
      title="Our map"
      description="The places that hold a little more meaning because we were there together."
    />
  );
}
