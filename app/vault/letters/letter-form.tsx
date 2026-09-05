"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type LetterFormProps = {
  letterId?: string;
  initial?: { title: string; content: string; date: string };
};

export default function LetterForm({
  letterId,
  initial = { title: "", content: "", date: "" },
}: LetterFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
      );
    }, formRef);
    return () => context.revert();
  }, []);

  function update(field: keyof typeof value, next: string) {
    setValue((current) => ({ ...current, [field]: next }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!value.title.trim() || !value.content.trim() || !value.date) {
      setError("A title, date, and something to say are needed.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        letterId ? `/api/letters/${letterId}` : "/api/letters",
        {
          method: letterId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(value),
        },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error ?? "Unable to save this letter.");
      router.push(`/vault/letters/${body.letter._id}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save this letter.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} className="letter-editor" onSubmit={handleSubmit}>
      <label className="letter-editor-field">
        Title
        <input
          value={value.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="A letter for later"
          maxLength={140}
          required
        />
      </label>
      <label className="letter-editor-field">
        Date
        <input
          type="date"
          value={value.date}
          onChange={(event) => update("date", event.target.value)}
          required
        />
      </label>
      <label className="letter-editor-field letter-editor-field--content">
        Your words
        <textarea
          value={value.content}
          onChange={(event) => update("content", event.target.value)}
          placeholder="Begin anywhere..."
          maxLength={20000}
          required
        />
      </label>
      <div className="letter-editor-footer">
        <p role="alert">{error}</p>
        <button type="submit" disabled={saving}>
          {saving ? "Keeping..." : "Keep this letter"} <span>↗</span>
        </button>
      </div>
    </form>
  );
}
