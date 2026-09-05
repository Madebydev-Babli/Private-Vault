"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Memory = {
  _id: string;
  title: string;
  story: string;
  date: string;
  mood: string;
  location?: string;
  media?: string | { url: string };
};

function mediaUrl(media: Memory["media"]) {
  return typeof media === "string" ? media : media?.url;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function MemoryArchive({ memories }: { memories: Memory[] }) {
  const archiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!archiveRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".memory-archive-heading, .memory-archive-card, .memory-empty",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power2.out",
        },
      );
    }, archiveRef);
    return () => context.revert();
  }, []);

  return (
    <main ref={archiveRef} className="memory-archive-page">
      <header className="memory-archive-top">
        <Link href="/vault">Memento / private archive</Link>
        <Link className="memory-archive-home" href="/vault">
          Back to home <span>↗</span>
        </Link>
      </header>
      <section className="memory-archive-heading">
        <p className="home-eyebrow">02 / The archive</p>
        <h1>Memories</h1>
        <p>the moments we decided to keep.</p>
        <Link className="memory-new-link" href="/vault/memories/new">
          + New memory
        </Link>
      </section>
      {memories.length === 0 ? (
        <section className="memory-empty" aria-label="Empty memories archive">
          <span>01</span>
          <h2>Nothing here yet.</h2>
          <p>Every story begins with a moment.</p>
          <Link className="memory-new-link" href="/vault/memories/new">
            Add the first memory <span>↗</span>
          </Link>
        </section>
      ) : (
        <section className="memory-timeline" aria-label="Memory timeline">
          {memories.map((memory, index) => (
            <article
              className={`memory-archive-card memory-archive-card--${index % 2 ? "right" : "left"}`}
              key={memory._id}
            >
              <div className="memory-archive-card-date">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {formatDate(memory.date)}
              </div>
              {mediaUrl(memory.media) ? (
                <img src={mediaUrl(memory.media)} alt="" />
              ) : (
                <div className="memory-no-photo" aria-hidden="true">
                  A story without a photograph
                  <br />
                  is still a story.
                </div>
              )}
              <div className="memory-archive-card-copy">
                <p className="home-eyebrow">
                  {memory.mood}
                  {memory.location ? ` / ${memory.location}` : ""}
                </p>
                <h2>{memory.title}</h2>
                <p>{memory.story}</p>
                <Link
                  className="memory-view-link"
                  href={`/vault/memories/${memory._id}`}
                >
                  View memory <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
