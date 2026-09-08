"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Letter = {
  _id: string;
  title: string;
  date: string;
  author?: "ritika" | "riya";
  recipient?: "ritika" | "riya";
  createdAt: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function LetterArchive({ letters }: { letters: Letter[] }) {
  const archiveRef = useRef<HTMLElement | null>(null);
  const [filter, setFilter] = useState<"ritika" | "riya">("ritika");
  const visibleLetters = letters.filter(
    (letter) => (letter.author ?? "ritika") === filter,
  );
  useEffect(() => {
    if (!archiveRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".letter-archive-heading, .letter-archive-card, .letter-empty",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
      );
    }, archiveRef);
    return () => context.revert();
  }, []);

  return (
    <main ref={archiveRef} className="letter-archive-page">
      <header className="letter-archive-top">
        <Link href="/vault">Memento / private archive</Link>
        <Link href="/vault">
          Back to home <span>↗</span>
        </Link>
      </header>
      <section className="letter-archive-heading">
        <p className="home-eyebrow">03 / Words we kept</p>
        <h1>Letters</h1>
        <p>Some things are easier to write than to say.</p>
        <Link className="letter-new-link" href="/vault/letters/new">
          + Write a letter
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
      {visibleLetters.length === 0 ? (
        <section className="letter-empty">
          <span>01</span>
          <h2>Nothing here yet.</h2>
          <p>The words are waiting for you.</p>
          <Link className="letter-new-link" href="/vault/letters/new">
            Write the first letter <span>↗</span>
          </Link>
        </section>
      ) : (
        <section className="letter-archive-list" aria-label="Letters archive">
          {visibleLetters.map((letter, index) => (
            <article
              className={`letter-archive-card letter-archive-card--${index % 2 ? "right" : "left"}`}
              key={letter._id}
            >
              <div className="letter-archive-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="letter-archive-card-paper">
                <p className="home-eyebrow">
                  {formatDate(letter.date)} /{" "}
                  {letter.author === "ritika" ? "from ritika" : "from riya"}
                </p>
                <h2>{letter.title}</h2>
                <p className="letter-archive-excerpt">
                  💌 From {letter.author === "ritika" ? "ritika" : "riya"} →{" "}
                  {letter.recipient === "ritika" ? "ritika" : "riya"}
                </p>
                <div>
                  <Link href={`/vault/letters/${letter._id}`}>
                    Open letter <span>→</span>
                  </Link>
                  <Link href={`/vault/letters/${letter._id}/edit`}>Edit</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
