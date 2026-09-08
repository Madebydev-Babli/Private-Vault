"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Letter = {
  _id: string;
  title: string;
  content: string;
  date: string;
  author?: "ritika" | "riya";
  recipient?: "ritika" | "riya";
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function LetterReader({ letter }: { letter: Letter }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const author = letter.author ?? "ritika";
  const recipient = letter.recipient ?? "riya";

  async function removeLetter() {
    setDeleting(true);
    const response = await fetch(`/api/letters/${letter._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      router.push("/vault/letters");
      router.refresh();
    } else {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <main className="letter-reader-page">
      <header className="letter-reader-top">
        <Link href="/vault/letters">Letters / back to the archive</Link>
        <span>Private correspondence</span>
      </header>
      <article className="letter-reader-paper">
        <p className="home-eyebrow">
          {formatDate(letter.date)} / from{" "}
          {author === "ritika" ? "ritika" : "riya"}
        </p>
        <div className="letter-reader-meta">
          From {author === "ritika" ? "ritika" : "riya"} → To{" "}
          {recipient === "ritika" ? "ritika" : "riya"}
        </div>
        <h1>{letter.title}</h1>
        <div className="letter-reader-rule" />
        <div className="letter-reader-content">
          {letter.content.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="letter-reader-signoff">kept here, quietly.</p>
        <div className="letter-reader-actions">
          <Link href={`/vault/letters/${letter._id}/edit`}>
            Edit letter <span>↗</span>
          </Link>
          <button type="button" onClick={() => setConfirming(true)}>
            Delete letter
          </button>
        </div>
      </article>
      {confirming && (
        <div
          className="letter-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-confirm-title"
        >
          <div>
            <p className="home-eyebrow">A small goodbye</p>
            <h2 id="letter-confirm-title">Let this letter go?</h2>
            <p>Its words will leave the archive.</p>
            <div>
              <button type="button" onClick={() => setConfirming(false)}>
                Keep it
              </button>
              <button type="button" disabled={deleting} onClick={removeLetter}>
                {deleting ? "Letting go..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
