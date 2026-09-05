"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Capsule = { _id: string; title: string; unlockAt: string; createdAt: string; locked: boolean; content?: string };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function CapsuleReader({ capsule }: { capsule: Capsule }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  async function remove() {
    setDeleting(true);
    const response = await fetch(`/api/capsules/${capsule._id}`, { method: "DELETE", credentials: "include" });
    if (response.ok) { router.push("/vault/capsules"); router.refresh(); } else { setDeleting(false); setConfirming(false); }
  }
  return <main className={`capsule-reader-page ${capsule.locked ? "is-locked" : "is-open"}`}>
    <header className="capsule-reader-top"><Link href="/vault/capsules">Capsules / back to the archive</Link><span>{capsule.locked ? "Sealed memory" : "Opened memory"}</span></header>
    <article className="capsule-reader-paper"><div className="capsule-reader-icon">{capsule.locked ? "🔒" : "✦"}</div><p className="home-eyebrow">{capsule.locked ? "Not yet / waiting for its moment" : `Opened / ${formatDate(capsule.unlockAt)}`}</p><h1>{capsule.title}</h1>{capsule.locked ? <><div className="capsule-reader-rule" /><p className="capsule-locked-message">Some words are meant to wait.</p><p className="capsule-unlock-date">This capsule opens on<br /><strong>{formatDate(capsule.unlockAt)}</strong></p><Link className="capsule-reader-back" href="/vault/capsules">Return to the archive <span>↗</span></Link></> : <><div className="capsule-reader-rule" /><p className="capsule-written-date">Written {formatDate(capsule.createdAt)}</p><div className="capsule-reader-content">{capsule.content?.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><p className="capsule-reader-signoff">kept for the right day.</p></>}<div className="capsule-reader-actions">{capsule.locked && <Link href={`/vault/capsules/${capsule._id}/edit`}>Edit capsule <span>↗</span></Link>}<button type="button" onClick={() => setConfirming(true)}>Delete capsule</button></div></article>
    {confirming && <div className="capsule-confirm" role="dialog" aria-modal="true" aria-labelledby="capsule-confirm-title"><div><p className="home-eyebrow">A small goodbye</p><h2 id="capsule-confirm-title">Let this capsule go?</h2><p>It will leave the archive, unopened or not.</p><div><button type="button" onClick={() => setConfirming(false)}>Keep it</button><button type="button" disabled={deleting} onClick={remove}>{deleting ? "Letting go..." : "Delete"}</button></div></div></div>}
  </main>;
}
