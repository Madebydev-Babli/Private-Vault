"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Media = { url: string; resourceType?: "image" | "video" | string };
type Memory = {
  _id: string;
  title: string;
  story: string;
  date: string;
  perspective?: "ritika" | "riya";
  media?: string | Media | Media[];
};

function mediaList(value: Memory["media"]): Media[] {
  if (!value) return [];
  if (typeof value === "string") return [{ url: value }];
  return Array.isArray(value) ? value : [value];
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
  const [filter, setFilter] = useState<"ritika" | "riya">("ritika");
  const visibleMemories = memories.filter(
    (memory) => (memory.perspective ?? "ritika") === filter,
  );
  useEffect(() => {
    if (!archiveRef.current) return;
    const context = gsap.context(
      () =>
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
        ),
      archiveRef,
    );
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
      <div className="two-sides-filter">
        <p className="two-sides-filter-label">Two sides</p>
        <div className="two-sides-filter-row">
          {(["ritika", "riya"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`two-sides-filter-pill ${filter === option ? "two-sides-filter-pill--active" : ""}`}
              onClick={() => setFilter(option)}
            >
              {option === "ritika" ? "ritika" : "riya"}
            </button>
          ))}
        </div>
      </div>
      {visibleMemories.length === 0 ? (
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
          {visibleMemories.map((memory, index) => {
            const media = mediaList(memory.media);
            const first = media[0];
            return (
              <article
                className={`memory-archive-card memory-archive-card--${index % 2 ? "right" : "left"}`}
                key={memory._id}
              >
                <div className="memory-archive-card-date">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {formatDate(memory.date)}
                </div>
                {first ? (
                  first.resourceType === "video" ? (
                    <video
                      src={first.url}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img src={first.url} alt="" />
                  )
                ) : (
                  <div className="memory-no-photo">
                    A story without a photograph
                    <br />
                    is still a story.
                  </div>
                )}
                <div className="memory-archive-card-copy">
                  <p className="home-eyebrow">
                    {memory.perspective === "riya"
                      ? "riya's side"
                      : "ritika's side"}
                  </p>
                  {media.length > 1 && (
                    <div className="memory-media-count">
                      {media.length} moments
                    </div>
                  )}
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
            );
          })}
        </section>
      )}
    </main>
  );
}
