"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { authApi } from "@/app/lib/api";
import { diaryEntries, storyMedia, timeCapsules } from "@/app/story-data";

const navigation = [
  ["Our Story", "/vault/story"],
  ["Memories", "/vault/memories"],
  ["Letters", "/vault/letters"],
  ["Voice", "/vault/voice"],
  ["Capsules", "/vault/capsules"],
  ["Map", "/vault/map"],
] as const;

export default function VaultHome() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!pageRef.current) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro
        .fromTo(
          ".home-header, .home-hero-kicker, .home-hero h1, .home-hero-copy, .home-hero-actions",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
        )
        .fromTo(
          ".home-section",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.35",
        );
    }, pageRef);

    return () => context.revert();
  }, []);

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <main ref={pageRef} className="vault-home">
      <header className="home-header">
        <a className="home-brand" href="/vault" aria-label="Memento home">
          Memento
        </a>
        <nav
          className={`home-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Private vault navigation"
        >
          {navigation.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="home-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>
        <button type="button" className="home-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-image" aria-hidden="true">
          <img src={storyMedia[0].src} alt="" />
        </div>
        <div className="home-hero-content">
          <p className="home-hero-kicker">Memento / private archive</p>
          <h1 id="home-title">
            a private little
            <br />
            space for everything
            <br />
            we keep.
          </h1>
          <p className="home-hero-copy">
            Some moments deserve more than a place in a camera roll.
          </p>
          <div className="home-hero-actions">
            <a className="home-primary-link" href="#moments">
              Explore the archive <span>↘</span>
            </a>
            <span className="home-hero-note">
              Est. 2019 / always in progress
            </span>
          </div>
        </div>
      </section>

      <section
        className="home-section home-story-feature"
        id="story"
        aria-labelledby="story-feature-title"
      >
        <div className="home-section-heading">
          <p className="home-eyebrow">01 / Our story</p>
          <h2 id="story-feature-title">
            Every friendship has a beginning. Ours has a thousand little
            moments.
          </h2>
        </div>
        <div className="home-story-grid">
          <div className="home-story-image">
            <img
              src={storyMedia[1].src}
              alt={storyMedia[1].description ?? "A quiet memory"}
            />
            <span>Chapter one / 2019</span>
          </div>
          <div className="home-story-copy">
            <p>
              Before the archive, there was simply us. The ordinary days, the
              stupid jokes, and all the moments we never thought we&apos;d
              remember.
            </p>
            <a className="home-arrow-link" href="/vault/story">
              Enter Our Story <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="home-section home-moments"
        id="moments"
        aria-labelledby="moments-title"
      >
        <div className="home-section-heading home-section-heading--split">
          <div>
            <p className="home-eyebrow">02 / The archive</p>
            <h2 id="moments-title">The moments we kept</h2>
          </div>
          <p>Small pieces of a life that became ours.</p>
        </div>
        <div className="home-memory-preview-grid">
          {storyMedia.slice(2, 5).map((memory, index) => (
            <a
              className={`home-memory-preview home-memory-preview--${index + 1}`}
              href={`/vault/memories/${memory.id}`}
              key={memory.id}
            >
              <div className="home-preview-image">
                <img
                  src={memory.src}
                  alt={memory.description ?? memory.title}
                />
              </div>
              <div className="home-preview-meta">
                <span>
                  {memory.date} / {memory.tags[0]}
                </span>
                <strong>{memory.title}</strong>
              </div>
            </a>
          ))}
        </div>
        <p className="home-empty-note">
          22 moments held close / more chapters waiting to be added
        </p>
      </section>

      <section
        className="home-section home-split-preview"
        aria-label="Letters and time capsules"
      >
        <article className="home-letter-preview" id="letters">
          <p className="home-eyebrow">03 / Words we kept</p>
          <h2>Some things are easier to write than to say.</h2>
          <p className="home-preview-quote">
            &ldquo;{diaryEntries[0].content}&rdquo;
          </p>
          <a className="home-arrow-link" href="/vault/letters">
            Read the letters <span>→</span>
          </a>
        </article>
        <article className="home-capsule-preview" id="capsules">
          <p className="home-eyebrow">04 / For another day</p>
          <div className="home-capsule-mark">01</div>
          <h2>Some memories are meant to wait.</h2>
          <p>{timeCapsules[0].status}</p>
          <a className="home-arrow-link" href="/vault/capsules">
            Open capsules <span>→</span>
          </a>
        </article>
      </section>

      <section
        className="home-section home-map-preview"
        id="map"
        aria-labelledby="map-title"
      >
        <div className="home-map-copy">
          <p className="home-eyebrow">05 / Where we were</p>
          <h2 id="map-title">A map of the places that made us.</h2>
          <a className="home-arrow-link" href="/vault/map">
            Visit the map <span>→</span>
          </a>
        </div>
        <div className="home-map-art" aria-hidden="true">
          <span className="map-line map-line--one" />
          <span className="map-line map-line--two" />
          <span className="map-line map-line--three" />
          <span className="map-pin map-pin--one" />
          <span className="map-pin map-pin--two" />
          <span className="map-pin map-pin--three" />
        </div>
      </section>

      <footer className="home-footer">
        <p className="home-eyebrow">Memento / private archive</p>
        <h2>More to remember.</h2>
        <p>Somewhere between all these moments, there is our story.</p>
        <a href="/vault/story">
          Our story continues <span>↗</span>
        </a>
      </footer>
    </main>
  );
}
