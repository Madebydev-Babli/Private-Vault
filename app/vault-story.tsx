"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  diaryEntries,
  sectionNavigation,
  storyMedia,
  timeCapsules,
  vaultStats,
} from "./story-data";

gsap.registerPlugin(ScrollTrigger);

type MemoryCardProps = {
  id: string;
  title: string;
  description?: string;
  src: string;
  type: "image" | "video";
  poster?: string;
  date: string;
  tags: string[];
  objectPosition?: string;
  align?: "left" | "center" | "right";
  index: number;
};

function MemoryMedia({
  type,
  src,
  poster,
  title,
  description,
  objectPosition,
  index,
}: {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  description?: string;
  objectPosition?: string;
  index: number;
}) {
  if (type === "video") {
    return (
      <video
        className="memory-media-item"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={index === 0 ? "metadata" : "none"}
        aria-label={description ?? title}
      />
    );
  }

  return (
    <img
      className="memory-media-item"
      src={src}
      alt={description ?? title}
      loading={index < 3 ? "eager" : "lazy"}
      style={{ objectPosition: objectPosition ?? "center" }}
    />
  );
}

function MemoryCard({
  id,
  title,
  description,
  src,
  type,
  poster,
  date,
  tags,
  objectPosition,
  align,
  index,
}: MemoryCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const context = gsap.context(() => {
      const element = ref.current;
      if (!element) return;

      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 40, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 0.8,
          },
        },
      );
    }, ref);

    return () => context.revert();
  }, [index]);

  return (
    <article
      ref={ref}
      className={`memory-card memory-card--${align ?? "left"}`}
      data-memory-id={id}
    >
      <div className="memory-card-visual">
        <MemoryMedia
          type={type}
          src={src}
          poster={poster}
          title={title}
          description={description}
          objectPosition={objectPosition}
          index={index}
        />
      </div>
      <div className="memory-card-copy">
        <p className="memory-card-meta">Memory {id}</p>
        <p className="memory-card-date">{date}</p>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <div className="memory-card-tags" aria-label={`${title} tags`}>
          {tags.map((tag) => (
            <span key={`${id}-${tag}`}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function StoryExperience() {
  const root = useRef<HTMLDivElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [addingMemory, setAddingMemory] = useState(false);

  const activeSectionIds = useMemo(
    () => sectionNavigation.map((section) => section.id),
    [],
  );

  useEffect(() => {
    if (!root.current) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay: 0.35 });
      intro
        .from(".intro-kicker", {
          opacity: 0,
          y: 16,
          duration: 1.2,
          ease: "power2.out",
        })
        .from(
          ".intro-rule",
          { scaleX: 0, duration: 1.4, ease: "power3.inOut" },
          "-=0.8",
        )
        .from(".intro-subtitle", { opacity: 0, y: 18, duration: 1 }, "-=0.7")
        .to(".intro", {
          opacity: 0,
          duration: 1.5,
          delay: 1.6,
          ease: "power2.inOut",
        })
        .set(".intro", { display: "none" });

      gsap.utils
        .toArray<HTMLElement>(".story-panel")
        .forEach((panel, index) => {
          const media = panel.querySelector(".panel-media");
          const copy = panel.querySelector(".panel-copy");

          if (!media || !copy) return;

          gsap.set(media, { scale: 1.14, filter: "blur(0px)" });
          gsap.set(copy, { autoAlpha: 0, y: 28 });

          ScrollTrigger.create({
            trigger: panel,
            start: "top 65%",
            end: "bottom 35%",
            scrub: 1.2,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(media, {
                scale: 1.14 - progress * 0.14,
                duration: 0.2,
                ease: "none",
              });
              gsap.to(copy, {
                autoAlpha: 0.2 + progress,
                y: 28 - progress * 28,
                duration: 0.2,
                ease: "none",
              });
            },
          });

          if (index === 0) {
            gsap.to(media, { scale: 1, duration: 1.8, ease: "power2.out" });
          }
        });

      gsap.utils.toArray<HTMLElement>(".memory-card").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
            },
          },
        );
      });

      const navLabels = gsap.utils.toArray<HTMLElement>(".nav-pill");
      navLabels.forEach((label, index) => {
        gsap.to(label, {
          opacity: 0.4 + (index === 0 ? 0.6 : 0),
          duration: 0.4,
          scrollTrigger: {
            trigger: ".story-panel",
            start: `top 15%`,
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      return () => {
        intro.kill();
      };
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main ref={root} className="vault-shell">
      <aside className="vault-nav" aria-label="Story chapters">
        <div className="vault-nav-inner">
          <span className="nav-number">01</span>
          <div className="nav-rule" aria-hidden="true" />
          <span className="nav-number">08</span>
        </div>
        <div className="vault-nav-list" aria-label="Story navigation">
          {sectionNavigation.map((section) => (
            <button
              key={section.id}
              type="button"
              className="nav-pill"
              aria-label={`Go to ${section.title}`}
            >
              <span>{section.id}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <button
        type="button"
        className="sound-toggle"
        onClick={() => setSoundOn(!soundOn)}
        aria-label="Toggle sound"
      >
        Sound <span>{soundOn ? "on" : "off"}</span>
      </button>

      <section className="intro" aria-label="Our story introduction">
        <div className="intro-center">
          <p className="intro-kicker">Private vault · 01</p>
          <h1>Our story</h1>
          <span className="intro-rule" />
          <p className="intro-subtitle">A friendship worth remembering</p>
        </div>
        <span className="intro-year">Est. 2019</span>
      </section>

      <div
        className="story-panel story-panel--intro"
        aria-label="Section 01, Our Beginning"
      >
        <div className="panel-media panel-media--full">
          <img
            src={storyMedia[0].src}
            alt={storyMedia[0].description ?? "A memory of our beginning"}
            loading="eager"
            style={{ objectPosition: storyMedia[0].objectPosition ?? "center" }}
          />
        </div>
        <div className="panel-copy panel-copy--overlay">
          <p className="panel-label">01 / OUR BEGINNING</p>
          <h2>OUR STORY</h2>
          <p className="panel-year">2019</p>
          <p className="panel-kicker">Where it all began.</p>
        </div>
      </div>

      <div
        className="story-panel story-panel--thank-you"
        aria-label="Section 02, Thank You"
      >
        <div className="panel-media panel-media--background">
          <img
            src={storyMedia[1].src}
            alt="A quiet memory"
            loading="lazy"
            style={{ objectPosition: storyMedia[1].objectPosition ?? "center" }}
          />
        </div>
        <div className="panel-cutout" aria-hidden="true">
          <img src="/cutout.png" alt="" />
        </div>
        <div className="panel-copy panel-copy--emotional">
          <p className="panel-label">02</p>
          <h2>
            THANK YOU
            <br />
            FOR COMING
            <br />
            INTO MY LIFE
          </h2>
          <p className="panel-quote">
            "I don&apos;t think I ever told you enough how much your presence
            has meant to me.
            <br />
            <br />
            Somewhere between the ordinary days, the stupid jokes, and all the
            moments we never thought we&apos;d remember, you became part of my
            story."
          </p>
        </div>
      </div>

      <section className="memory-archive" aria-label="Section 03, Our Memories">
        <div className="section-heading">
          <p className="panel-label">03 / OUR MEMORIES</p>
          <h2>OUR MEMORIES</h2>
        </div>
        <div className="memory-grid">
          {storyMedia.slice(2, 22).map((memory, index) => (
            <MemoryCard key={memory.id} {...memory} index={index} />
          ))}
        </div>
      </section>

      <div
        className="story-panel story-panel--chaos"
        aria-label="Section 04, Our Chaos"
      >
        <div className="panel-media panel-media--background">
          <img
            src="/16.mp4"
            alt="A playful moment"
            style={{ display: "none" }}
          />
          <video
            src="/16.mp4"
            muted
            loop
            playsInline
            autoPlay
            aria-label="A lively memory video"
          />
        </div>
        <div className="panel-copy panel-copy--chaos">
          <p className="panel-label">04</p>
          <h2>OUR CHAOS</h2>
          <p className="panel-quote">"We were never particularly normal."</p>
          <p className="panel-quote panel-quote--small">
            And honestly, I wouldn&apos;t change a thing.
          </p>
          <div className="tag-row">
            <span>😂 Funny</span>
            <span>🫶 Favorite</span>
            <span>🎂 Birthday</span>
            <span>✈️ Travel</span>
          </div>
        </div>
      </div>

      <section className="letters-section" aria-label="Section 05, Our Words">
        <div className="section-heading">
          <p className="panel-label">05 / OUR WORDS</p>
          <h2>OUR WORDS</h2>
          <p className="section-subtitle">
            Some things are easier to write than to say.
          </p>
        </div>
        <div className="letter-stack">
          {diaryEntries.map((entry) => (
            <article
              key={entry.id}
              className={`letter-entry ${expandedEntry === entry.id ? "is-open" : ""}`}
              onClick={() =>
                setExpandedEntry((current) =>
                  current === entry.id ? null : entry.id,
                )
              }
            >
              <div className="letter-header">
                <div>
                  <p className="letter-category">{entry.category}</p>
                  <h3>{entry.title}</h3>
                </div>
                <span className="letter-mood">{entry.mood ?? "Tender"}</span>
              </div>
              <p className="letter-date">{entry.date}</p>
              <p className="letter-preview">{entry.content}</p>
              {expandedEntry === entry.id && (
                <p className="letter-full">{entry.content}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="capsules-section" aria-label="Section 06, Future Us">
        <div className="section-heading">
          <p className="panel-label">06 / FUTURE US</p>
          <h2>FUTURE US</h2>
        </div>
        <div className="capsule-grid">
          {timeCapsules.map((capsule) => (
            <article key={capsule.id} className="capsule-card">
              <div className="capsule-topline">
                <span>LOCKED MEMORY</span>
                <span>{capsule.status}</span>
              </div>
              <p className="capsule-created">Written: {capsule.createdAt}</p>
              <p className="capsule-opens">Opens: {capsule.unlockAt}</p>
              <div className="capsule-lock" aria-label="Locked memory">
                <span>🔒</span>
              </div>
              <p className="capsule-text">{capsule.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="growth-section"
        aria-label="Section 07, Still Growing"
      >
        <div className="section-heading">
          <p className="panel-label">07 / STILL GROWING</p>
          <h2>STILL GROWING</h2>
          <p className="section-subtitle">
            Our story didn&apos;t end with the memories we already made.
          </p>
        </div>
        <button
          type="button"
          className="memory-add"
          onClick={() => setAddingMemory((current) => !current)}
        >
          + ADD A NEW MEMORY
        </button>
        {addingMemory && (
          <div
            className="memory-form"
            role="dialog"
            aria-modal="true"
            aria-label="Add a new memory form"
          >
            <div className="memory-form-row">
              <label>
                Title
                <input type="text" defaultValue="New memory" />
              </label>
              <label>
                Date
                <input type="text" defaultValue="Today" />
              </label>
            </div>
            <label>
              Story
              <textarea defaultValue="A new chapter worth keeping." />
            </label>
            <div className="memory-form-row">
              <label>
                Memory type
                <select defaultValue="Photo">
                  <option>Photo</option>
                  <option>Video</option>
                </select>
              </label>
              <label>
                Tags
                <input type="text" defaultValue="new, favorite" />
              </label>
            </div>
            <div className="memory-form-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setAddingMemory(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => setAddingMemory(false)}
              >
                Save memory
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="vault-summary" aria-label="Section 08, Our Vault">
        <div className="section-heading section-heading--summary">
          <p className="panel-label">08 / OUR VAULT</p>
          <h2>OUR VAULT</h2>
        </div>
        <div className="vault-stats">
          <div>
            <span>Memories</span>
            <strong>{vaultStats.memories}</strong>
          </div>
          <div>
            <span>Letters</span>
            <strong>{vaultStats.letters}</strong>
          </div>
          <div>
            <span>Time Capsules</span>
            <strong>{vaultStats.timeCapsules}</strong>
          </div>
          <div>
            <span>Videos</span>
            <strong>{vaultStats.videos}</strong>
          </div>
        </div>
        <p className="vault-final-message">
          Some stories are meant to be remembered.
          <br />
          Some are meant to be continued.
        </p>
        <p className="vault-birthday">HAPPY BIRTHDAY</p>
        <p className="vault-person">MY FAVORITE PERSON.</p>
        <p className="vault-signoff">This little place will always be ours.</p>
        <button type="button" className="vault-cta">
          OUR STORY CONTINUES →
        </button>
      </section>
    </main>
  );
}

export default function MemoryStory() {
  return <StoryExperience />;
}
