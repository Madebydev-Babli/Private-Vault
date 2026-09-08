"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { storyChapters, storyEnding, storyIntro } from "./story-data";

export default function StoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll("[data-story-reveal]");

    if (!elements) return;

    elements.forEach((element, index) => {
      const el = element as HTMLElement;

      el.animate(
        [
          {
            opacity: 0,
            transform: "translateY(35px)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
          },
        ],
        {
          duration: 900,
          delay: index * 70,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );
    });
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#3d302b]"
    >
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-40">
        <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-[#ead5d0] blur-3xl" />
        <div className="absolute right-[5%] top-[45%] h-52 w-52 rounded-full bg-[#eadfd1] blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] h-48 w-48 rounded-full bg-[#e7d0c9] blur-3xl" />
      </div>

      {/* ================= HERO ================= */}

      <section className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <div className="absolute left-8 top-10 text-xs tracking-[0.35em] text-[#8d7168] sm:left-14">
          MEMENTO
        </div>

        <div className="absolute right-8 top-10 text-xs tracking-[0.25em] text-[#8d7168] sm:right-14">
          ritika × riya
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p
            data-story-reveal
            className="mb-8 text-[10px] font-medium uppercase tracking-[0.45em] text-[#a0786e] sm:text-xs"
          >
            A story worth remembering
          </p>

          <h1
            data-story-reveal
            className="font-serif text-[clamp(4.5rem,13vw,10rem)] font-normal leading-[0.8] tracking-[-0.055em] text-[#493933]"
          >
            Our
            <span className="block pl-[0.6em] italic text-[#936b61]">
              Story
            </span>
          </h1>

          <p
            data-story-reveal
            className="mx-auto mt-12 max-w-xl text-base leading-8 text-[#79645d] sm:text-lg"
          >
            Two lives. Countless moments.
            <br />
            One story that was never meant to be forgotten.
          </p>

          <div
            data-story-reveal
            className="mt-20 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#a58b83]">
              Scroll to remember
            </span>

            <div className="h-12 w-px bg-[#bca39b]" />
          </div>
        </div>

        {/* Decorative heart */}
        <div className="absolute bottom-16 left-[12%] rotate-[-15deg] text-3xl text-[#ad7c72] opacity-70">
          ♡
        </div>

        <div className="absolute right-[14%] top-[35%] rotate-[12deg] text-xl text-[#ad7c72] opacity-60">
          ✦
        </div>
      </section>

      {/* ================= INTRO ================= */}

      <section className="relative px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-3xl">
          <p
            data-story-reveal
            className="mb-7 text-[10px] uppercase tracking-[0.4em] text-[#a0786e]"
          >
            {storyIntro.eyebrow}
          </p>

          <h2
            data-story-reveal
            className="font-serif text-4xl font-normal leading-[1.15] tracking-[-0.025em] sm:text-6xl"
          >
            {storyIntro.title}
            <span className="block italic text-[#936b61]">
              {storyIntro.highlight}
            </span>
          </h2>

          <div data-story-reveal className="mt-12 h-px w-20 bg-[#a98a81]" />

          <p
            data-story-reveal
            className="mt-10 max-w-2xl text-base leading-8 text-[#705d56] sm:text-lg sm:leading-9"
          >
            {storyIntro.text}
          </p>
        </div>
      </section>

      {/* ================= STORY TIMELINE ================= */}

      <section className="relative px-6 pb-40 sm:pb-56">
        {/* Center timeline */}
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#d5c4bc] lg:block" />

        <div className="mx-auto max-w-6xl">
          {storyChapters.map((chapter, index) => {
            const isEven = index % 2 === 0;

            return (
              <article
                key={chapter.number}
                className={`relative mb-32 last:mb-0 lg:mb-48 ${
                  isEven ? "" : "lg:pt-20"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-8 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-4 border-[#f7f1e8] bg-[#9d766d] lg:block" />

                <div
                  className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-24 ${
                    !isEven ? "lg:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  {/* Chapter metadata */}
                  <div
                    data-story-reveal
                    className={`${
                      isEven
                        ? "lg:pr-16 lg:text-right"
                        : "lg:pl-16 lg:text-left"
                    }`}
                  >
                    <span className="font-serif text-6xl text-[#d2b9b0] sm:text-7xl">
                      {chapter.number}
                    </span>

                    <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-[#a0786e]">
                      {chapter.year}
                    </p>

                    <p className="mt-3 font-serif text-lg italic text-[#8c7168]">
                      {chapter.label}
                    </p>
                  </div>

                  {/* Story content */}
                  <div
                    data-story-reveal
                    className={`${isEven ? "lg:pl-16" : "lg:pr-16"}`}
                  >
                    <h3 className="max-w-xl font-serif text-3xl leading-[1.15] tracking-[-0.02em] text-[#493933] sm:text-5xl">
                      {chapter.title}
                    </h3>

                    <div className="mt-8 space-y-6">
                      {chapter.paragraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="max-w-xl text-base leading-8 text-[#705d56] sm:text-lg sm:leading-9"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {index !== storyChapters.length - 1 && (
                      <div className="mt-10 text-xl text-[#b48b81]">♡</div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= CLOSING ================= */}

      <section className="relative border-t border-[#dfd0c8] px-6 py-40 sm:py-56">
        <div className="mx-auto max-w-4xl text-center">
          <p
            data-story-reveal
            className="text-[10px] uppercase tracking-[0.4em] text-[#a0786e]"
          >
            {storyEnding.smallText}
          </p>

          <h2
            data-story-reveal
            className="mt-8 font-serif text-5xl leading-[1] tracking-[-0.04em] sm:text-7xl lg:text-8xl"
          >
            {storyEnding.title}
          </h2>

          <p
            data-story-reveal
            className="mx-auto mt-10 max-w-2xl text-base leading-8 text-[#705d56] sm:text-lg sm:leading-9"
          >
            {storyEnding.text}
          </p>

          <div data-story-reveal className="mt-14 flex justify-center">
            <span className="text-3xl text-[#a97970]">♡</span>
          </div>

          <p
            data-story-reveal
            className="mt-6 font-serif text-2xl italic text-[#8b6b62]"
          >
            ritika & riya
          </p>

          {/* CTA */}
          <div
            data-story-reveal
            className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/vault/memories"
              className="rounded-full bg-[#493933] px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-[#f7f1e8] transition-transform duration-300 hover:-translate-y-1"
            >
              Enter the Memories
            </Link>

            <Link
              href="/vault"
              className="rounded-full border border-[#bca49b] px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-[#6f5952] transition-colors duration-300 hover:bg-[#eee3da]"
            >
              Back to Vault
            </Link>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.5em] text-[#c1aaa2]">
          MEMENTO
        </div>
      </section>
    </main>
  );
}
