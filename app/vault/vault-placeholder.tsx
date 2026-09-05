import Link from "next/link";

type VaultPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function VaultPlaceholder({
  eyebrow,
  title,
  description,
}: VaultPlaceholderProps) {
  return (
    <main className="vault-placeholder">
      <Link className="placeholder-back" href="/vault">
        Memento / back to the archive
      </Link>
      <div className="placeholder-copy">
        <p className="home-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Coming to this little corner soon.</span>
      </div>
    </main>
  );
}
