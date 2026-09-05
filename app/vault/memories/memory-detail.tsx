"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function MemoryDetail({ memory }: { memory: Memory }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function removeMemory() {
    setDeleting(true);
    await fetch(`/api/memories/${memory._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.push("/vault/memories");
    router.refresh();
  }

  return (
    <main className="memory-detail-page">
      <header className="memory-detail-top">
        <Link href="/vault/memories">Memories / back to the archive</Link>
        <span>Private memory {memory._id.slice(0, 5)}</span>
      </header>
      <article className="memory-detail-content">
        <div className="memory-detail-media">
          {mediaUrl(memory.media) ? (
            <img src={mediaUrl(memory.media)} alt={memory.title} />
          ) : (
            <div className="memory-detail-no-photo">
              A photograph
              <br />
              will live here.
            </div>
          )}
        </div>
        <div className="memory-detail-copy">
          <p className="home-eyebrow">
            {formatDate(memory.date)} / {memory.mood}
          </p>
          <h1>{memory.title}</h1>
          {memory.location && (
            <p className="memory-detail-location">{memory.location}</p>
          )}
          <div className="memory-detail-story">
            {memory.story.split("\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="memory-detail-actions">
            <Link href={`/vault/memories/${memory._id}/edit`}>
              Edit memory <span>↗</span>
            </Link>
            <button type="button" onClick={() => setConfirming(true)}>
              Delete memory
            </button>
          </div>
        </div>
      </article>
      {confirming && (
        <div
          className="memory-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-confirm-title"
        >
          <div className="memory-confirm-box">
            <p className="home-eyebrow">A small goodbye</p>
            <h2 id="memory-confirm-title">Let this memory go?</h2>
            <p>It will leave the archive, but not the story.</p>
            <div>
              <button type="button" onClick={() => setConfirming(false)}>
                Keep it
              </button>
              <button type="button" onClick={removeMemory} disabled={deleting}>
                {deleting ? "Letting go..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
