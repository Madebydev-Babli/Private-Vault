"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Capsule = { _id: string; title: string; unlockAt: string; createdAt: string; locked: boolean };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function CapsuleArchive({ capsules }: { capsules: Capsule[] }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const context = gsap.context(() => gsap.fromTo(".capsule-archive-heading, .capsule-card-new, .capsule-empty", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .1, ease: "power2.out" }), ref);
    return () => context.revert();
  }, []);
  return <main ref={ref} className="capsule-archive-page">
    <header className="capsule-archive-top"><Link href="/vault">Memento / private archive</Link><Link href="/vault">Back to home <span>↗</span></Link></header>
    <section className="capsule-archive-heading"><p className="home-eyebrow">04 / For another day</p><h1>Time capsules</h1><p>Written today. Meant for another day.</p><Link className="capsule-new-link" href="/vault/capsules/new">+ Seal a capsule</Link></section>
    {capsules.length === 0 ? <section className="capsule-empty"><span>01</span><h2>Nothing is waiting yet.</h2><p>Some words are meant to wait.</p><Link className="capsule-new-link" href="/vault/capsules/new">Create the first capsule <span>↗</span></Link></section> : <section className="capsule-archive-grid" aria-label="Time capsule archive">{capsules.map((capsule, index) => <article className={`capsule-card-new capsule-card-new--${index % 2 ? "rose" : "paper"}`} key={capsule._id}><div className="capsule-card-icon">{capsule.locked ? "🔒" : "✦"}</div><p className="home-eyebrow">{capsule.locked ? "Waiting for its moment" : "Your moment has arrived"}</p><h2>{capsule.title}</h2><dl><div><dt>Written</dt><dd>{formatDate(capsule.createdAt)}</dd></div><div><dt>{capsule.locked ? "Opens" : "Opened"}</dt><dd>{formatDate(capsule.unlockAt)}</dd></div></dl><Link href={`/vault/capsules/${capsule._id}`}>{capsule.locked ? "Open sealed capsule" : "Read capsule"} <span>→</span></Link></article>)}</section>}
  </main>;
}
