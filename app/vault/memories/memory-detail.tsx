"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Media = {
  url: string;
  publicId?: string;
  resourceType?: "image" | "video" | string;
};
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

export default function MemoryDetail({ memory }: { memory: Memory }) {
  const router = useRouter();
  const media = mediaList(memory.media);
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const current = media[selected];
  const perspective = memory.perspective ?? "ritika";
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
          {current ? (
            current.resourceType === "video" ? (
              <video src={current.url} controls playsInline />
            ) : (
              <button
                className="memory-detail-image-button"
                type="button"
                onClick={() => setLightbox(true)}
              >
                <img src={current.url} alt={memory.title} />
              </button>
            )
          ) : (
            <div className="memory-detail-no-photo">
              A photograph
              <br />
              will live here.
            </div>
          )}
          {media.length > 1 && (
            <div className="memory-detail-thumbnails">
              {media.map((item, index) => (
                <button
                  type="button"
                  key={item.publicId ?? item.url}
                  className={index === selected ? "is-selected" : ""}
                  onClick={() => setSelected(index)}
                >
                  {item.resourceType === "video" ? (
                    <video src={item.url} muted preload="metadata" />
                  ) : (
                    <img src={item.url} alt="" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="memory-detail-copy">
          <p className="home-eyebrow">{formatDate(memory.date)}</p>
          <div className="memory-perspective-badge">
            {perspective === "ritika" ? "ritika's side" : "riya's side"}
          </div>
          <h1>{memory.title}</h1>
          <div className="memory-detail-side-label">
            {perspective === "ritika" ? "ritika's side" : "riya's side"}
          </div>
          <div className="memory-detail-story">
            {memory.story.split("\n").map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
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
      {lightbox && current && current.resourceType !== "video" && (
        <div
          className="memory-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded memory photo"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Close expanded photo"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
          <img
            src={current.url}
            alt={memory.title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
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
