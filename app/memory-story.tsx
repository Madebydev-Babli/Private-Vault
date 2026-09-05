"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { authApi } from "./lib/api";
import {
  storyMedia,
  diaryEntries,
  timeCapsules,
  vaultStats,
  sectionNavigation,
} from "./story-data";
import type { Memory, DiaryEntry, TimeCapsule } from "./story-data";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface MediaProps extends React.HTMLAttributes<
  HTMLImageElement | HTMLVideoElement
> {
  src: string;
  type: "image" | "video";
  poster?: string;
  alt?: string;
  objectPosition?: string;
  className?: string;
  loading?: "eager" | "lazy";
  soundOn?: boolean;
  ref?: React.Ref<HTMLImageElement | HTMLVideoElement>;
}

const MediaRenderer = React.forwardRef<
  HTMLImageElement | HTMLVideoElement,
  Omit<MediaProps, "ref">
>(
  (
    {
      src,
      type,
      poster,
      alt,
      objectPosition,
      className,
      loading,
      soundOn,
      ...props
    },
    ref,
  ) => {
    if (type === "video") {
      return (
        <video
          ref={ref as React.Ref<HTMLVideoElement>}
          className={className}
          src={src}
          poster={poster}
          muted={!soundOn}
          loop
          playsInline
          preload={loading === "eager" ? "auto" : "metadata"}
          autoPlay
          aria-label={alt}
          {...props}
        />
      );
    }
    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        className={className}
        src={src}
        alt={alt || "Memory"}
        loading={loading || "lazy"}
        style={{ objectPosition: objectPosition || "center" }}
        {...props}
      />
    );
  },
);
MediaRenderer.displayName = "MediaRenderer";

function MemoryCard({ memory }: { memory: Memory }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const context = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "top 20%",
          once: true,
        },
      });
    }, cardRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={cardRef} className="memory-card">
      <div className="memory-card-visual">
        <MediaRenderer
          src={memory.src}
          type={memory.type}
          poster={memory.poster}
          alt={memory.title}
          objectPosition={memory.objectPosition}
          className="memory-media-item"
          loading="lazy"
        />
      </div>
      <div className="memory-card-copy">
        <p className="memory-card-meta">{memory.date}</p>
        <h3>{memory.title}</h3>
        <p>{memory.description}</p>
        {memory.tags && memory.tags.length > 0 && (
          <div className="memory-card-tags">
            {memory.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LetterEntryCard({
  entry,
  isOpen,
  onToggle,
}: {
  entry: DiaryEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="letter-entry"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    >
      <div className="letter-header">
        <div>
          <p className="letter-category">{entry.category}</p>
          <h3>{entry.title}</h3>
        </div>
        {entry.mood && <span className="letter-mood">{entry.mood}</span>}
      </div>
      <p className="letter-date">{entry.date}</p>
      {!isOpen && (
        <p className="letter-preview">{entry.content.substring(0, 120)}...</p>
      )}
      {isOpen && <p className="letter-full">{entry.content}</p>}
    </div>
  );
}

function TimeCapsuleCard({ capsule }: { capsule: TimeCapsule }) {
  return (
    <div className="capsule-card">
      <div className="capsule-topline">
        <span>Written</span>
        <span>{capsule.createdAt}</span>
      </div>
      <div className="capsule-created">Opens {capsule.unlockAt}</div>
      <div className="capsule-lock">🔒</div>
      <p className="capsule-text">{capsule.content}</p>
      <p className="capsule-status">{capsule.status}</p>
    </div>
  );
}

// SECTION COMPONENTS
// ============================================================================

// Section 01: Our Beginning
function Section01() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

  const memory = storyMedia[0];

  useEffect(() => {
    if (!sectionRef.current || !mediaRef.current || !memory) return;

    const context = gsap.context(() => {
      gsap.set(mediaRef.current, {
        scale: 1.12,
        transformOrigin: "center center",
      });
      gsap.set(".section-01-copy", { opacity: 0, y: 22 });

      const motion = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1.2,
        },
      });

      motion
        .to(mediaRef.current, {
          scale: 1,
          duration: 1,
          ease: "none",
        })
        .to(
          ".section-01-copy",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.08,
        );

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.set(mediaRef.current, { scale: 1 });
        gsap.set(".section-01-copy", { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => context.revert();
  }, [memory]);

  if (!memory) return null;

  return (
    <section
      ref={sectionRef}
      className="story-panel"
      aria-label="Our Beginning"
    >
      <div className="panel-media panel-media--full">
        <MediaRenderer
          src={memory.src}
          type={memory.type}
          poster={memory.poster}
          alt={memory.description}
          objectPosition={memory.objectPosition}
          className="memory-media"
          loading="eager"
        />
      </div>
      <div className="panel-copy">
        <p className="panel-label">01 / our beginning</p>
        <h2>{memory.title}</h2>
        <p className="panel-year">{memory.date}</p>
        <p className="panel-quote section-01-copy">{memory.description}</p>
      </div>
    </section>
  );
}

// Section 02: Thank You For Coming Into My Life
function Section02() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cutoutRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      // Background slow parallax
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 2,
          },
        });
      }

      // Cutout floats in with depth
      if (cutoutRef.current) {
        gsap.from(cutoutRef.current, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
        });

        // Subtle floating motion
        gsap.to(cutoutRef.current, {
          y: -12,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Text reveals line by line
      if (textRef.current) {
        gsap.from(textRef.current, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            once: true,
          },
        });
      }

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.set([cutoutRef.current, textRef.current], { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  // Use image 2 as background, cutout.png as the transparent overlay
  const bgImage = storyMedia[1];

  return (
    <section
      ref={sectionRef}
      className="story-panel"
      aria-label="Thank You For Coming Into My Life"
    >
      <div className="panel-media panel-media--background">
        <MediaRenderer
          ref={bgRef}
          src={bgImage.src}
          type={bgImage.type}
          poster={bgImage.poster}
          alt={bgImage.title}
          objectPosition={bgImage.objectPosition}
          className="memory-media"
          loading="lazy"
        />
      </div>

      <div className="panel-copy panel-copy--emotional">
        <p className="panel-label">02 / thank you</p>
        <h2>
          Thank You
          <br />
          For Coming
          <br />
          Into My Life
        </h2>
      </div>

      <div ref={textRef}>
        <p className="panel-quote panel-quote--small">
          I don't think I ever told you enough
          <br />
          how much your presence has meant to me.
          <br />
          <br />
          Somewhere between the ordinary days,
          <br />
          the stupid jokes and all the moments
          <br />
          we never thought we'd remember,
          <br />
          <br />
          you became part of my story.
        </p>
      </div>

      <img
        ref={cutoutRef}
        src="/cutout.png"
        alt="A moment of us"
        className="panel-cutout"
      />
    </section>
  );
}

// Section 03: Our Memories
function Section03() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      // Section heading reveals
      gsap.from(".section-03-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  // Use memories 3-12 for the grid (10 items for a nice gallery)
  const memoriesToShow = storyMedia.slice(2, 12);

  return (
    <section
      ref={sectionRef}
      className="memory-archive"
      aria-label="Our Memories"
    >
      <div className="section-03-heading">
        <div className="section-heading">
          <p className="panel-label">03 / our memories</p>
          <h2>Our Memories</h2>
          <p className="section-subtitle">
            A collection of moments that shaped us
          </p>
        </div>
      </div>

      <div className="memory-grid">
        {memoriesToShow.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </section>
  );
}

// Section 04: Our Chaos
function Section04() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".section-04-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  // Use memories 12-22 for chaos section (remaining images)
  const chaosMemories = storyMedia.slice(12, 22);

  return (
    <section ref={sectionRef} className="memory-archive" aria-label="Our Chaos">
      <div className="section-04-heading">
        <div className="section-heading">
          <p className="panel-label">04 / our chaos</p>
          <h2>Our Chaos</h2>
          <p className="section-subtitle">We were never particularly normal</p>
        </div>
      </div>

      <p
        className="section-subtitle"
        style={{ marginBottom: "2rem", marginTop: "-1rem" }}
      >
        And honestly, I wouldn't change a thing.
      </p>

      <div className="memory-grid">
        {chaosMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </section>
  );
}

// Section 05: Our Words
function Section05() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".section-05-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  const toggleEntry = (id: string) => {
    const newSet = new Set(expandedEntries);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedEntries(newSet);
  };

  return (
    <section
      ref={sectionRef}
      className="letters-section"
      aria-label="Our Words"
    >
      <div className="section-05-heading">
        <div className="section-heading">
          <p className="panel-label">05 / our words</p>
          <h2>Our Words</h2>
          <p className="section-subtitle">
            Some things are easier to write than to say
          </p>
        </div>
      </div>

      <div className="letter-stack">
        {diaryEntries.map((entry) => (
          <LetterEntryCard
            key={entry.id}
            entry={entry}
            isOpen={expandedEntries.has(entry.id)}
            onToggle={() => toggleEntry(entry.id)}
          />
        ))}
      </div>
    </section>
  );
}

// Section 06: Future Us
function Section06() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".section-06-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // Subtle floating capsules
      gsap.from(".capsule-card", {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="capsules-section"
      aria-label="Future Us"
    >
      <div className="section-06-heading">
        <div className="section-heading">
          <p className="panel-label">06 / future us</p>
          <h2>Future Us</h2>
          <p className="section-subtitle">
            Time capsules waiting for their moment
          </p>
        </div>
      </div>

      <div className="capsule-grid">
        {timeCapsules.map((capsule) => (
          <TimeCapsuleCard key={capsule.id} capsule={capsule} />
        ))}
      </div>
    </section>
  );
}

// Section 07: Still Growing
function Section07() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    story: "",
    type: "image",
    tags: "",
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".section-07-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Frontend-only for now - just show a confirmation
    alert("Memory ready to be added! (This will connect to the backend later)");
    setFormData({ title: "", date: "", story: "", type: "image", tags: "" });
    setShowForm(false);
  };

  return (
    <section
      ref={sectionRef}
      className="growth-section"
      aria-label="Still Growing"
    >
      <div className="section-07-heading">
        <div className="section-heading">
          <p className="panel-label">07 / still growing</p>
          <h2>Still Growing</h2>
          <p className="section-subtitle">
            Our story didn't end with the memories we already made
          </p>
        </div>
      </div>

      <button
        className="memory-add"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
      >
        <span>+ Add a new memory</span>
      </button>

      {showForm && (
        <form className="memory-form" onSubmit={handleSubmit}>
          <div className="memory-form-row">
            <label>
              Title
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </label>
          </div>

          <label>
            Story
            <textarea
              value={formData.story}
              onChange={(e) =>
                setFormData({ ...formData, story: e.target.value })
              }
              required
            />
          </label>

          <div className="memory-form-row">
            <label>
              Memory Type
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="image">Photo</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>
              Tags (comma-separated)
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </label>
          </div>

          <div className="memory-form-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Memory
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

// Section 08: Our Vault
function Section08() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".section-08-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
      });

      gsap.from(".vault-stats div", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          once: true,
        },
      });

      gsap.from(
        ".vault-final-message, .vault-birthday, .vault-person, .vault-signoff",
        {
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="vault-summary" aria-label="Our Vault">
      <div className="section-08-heading">
        <div className="section-heading">
          <p className="panel-label">08 / our vault</p>
          <h2>Our Vault</h2>
        </div>
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
        <br />
        Some are meant to be continued.
      </p>

      <p className="vault-birthday">Happy Birthday</p>
      <p className="vault-person">my favorite person.</p>

      <p className="vault-signoff">This little place will always be ours.</p>

      <button
        className="vault-cta"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Our Story Continues →
      </button>
    </section>
  );
}

// ============================================================================
// MAIN STORY COMPONENT
// ============================================================================

function Story() {
  const root = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(1);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    const context = gsap.context(() => {
      // Intro animation
      const intro = gsap.timeline({ delay: 0.45 });
      intro
        .from(".intro-kicker", {
          opacity: 0,
          y: 10,
          duration: 1.2,
          ease: "power2.out",
        })
        .from(
          ".intro-rule",
          { scaleX: 0, duration: 1.4, ease: "power3.inOut" },
          "-=0.65",
        )
        .from(".intro-subtitle", { opacity: 0, y: 12, duration: 1 }, "-=0.75")
        .to(".intro", {
          opacity: 0,
          duration: 1.5,
          delay: 1.8,
          ease: "power2.inOut",
        })
        .set(".intro", { display: "none" });
    }, root);

    const handleScroll = () => {
      // Determine current section based on scroll position
      const sections = root.current?.querySelectorAll("section");
      if (!sections) return;

      let currentIdx = 1;
      const scrollPos = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        if (scrollPos >= sectionTop) {
          currentIdx = index;
        }
      });

      setCurrentSection(Math.max(1, Math.min(currentIdx, 8)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      context.revert();
    };
  }, []);

  return (
    <main ref={root} className="vault-shell">
      <section className="intro" aria-label="Our story introduction">
        <div className="intro-center">
          <p className="intro-kicker">Private vault · 01</p>
          <h1>Our story</h1>
          <span className="intro-rule" />
          <p className="intro-subtitle">A friendship worth remembering</p>
        </div>
        <span className="intro-year">Est. 2019</span>
      </section>

      <nav className="vault-nav" aria-label="Story sections">
        <div className="vault-nav-inner">
          <span>{String(currentSection).padStart(2, "0")}</span>
          <div className="nav-rule" />
          <span>08</span>
        </div>
        <div className="vault-nav-list">
          <button
            className="nav-pill"
            onClick={() => setShowNav(!showNav)}
            aria-expanded={showNav}
          >
            Menu
          </button>
          <button
            className="nav-pill"
            onClick={async () => {
              try {
                await authApi.logout();
              } finally {
                window.location.href = "/login";
              }
            }}
          >
            Logout
          </button>
        </div>
        {showNav && (
          <div className="vault-nav-list">
            {sectionNavigation.map((section, idx) => (
              <button
                key={section.id}
                className="nav-pill"
                onClick={() => {
                  const element = document.querySelectorAll("section")[idx + 1];
                  element?.scrollIntoView({ behavior: "smooth" });
                  setShowNav(false);
                }}
              >
                <span>{section.label}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Section 01: Our Beginning */}
      <Section01 />

      {/* Section 02: Thank You For Coming Into My Life */}
      <Section02 />

      {/* Section 03: Our Memories */}
      <Section03 />

      {/* Section 04: Our Chaos */}
      <Section04 />

      {/* Section 05: Our Words */}
      <Section05 />

      {/* Section 06: Future Us */}
      <Section06 />

      {/* Section 07: Still Growing */}
      <Section07 />

      {/* Section 08: Our Vault */}
      <Section08 />
    </main>
  );
}

export default function MemoryStory() {
  return <Story />;
}
