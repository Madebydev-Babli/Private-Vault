"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const memoryMoods = [
  "Tender",
  "Joyful",
  "Quiet",
  "Adventurous",
  "Nostalgic",
] as const;

type MemoryValue = {
  title: string;
  story: string;
  date: string;
  mood: string;
  location: string;
  media?: string | { url: string };
};

type MemoryFormProps = {
  initial?: MemoryValue;
  memoryId?: string;
};

const emptyValue: MemoryValue = {
  title: "",
  story: "",
  date: "",
  mood: "Tender",
  location: "",
};

export default function MemoryForm({
  initial = emptyValue,
  memoryId,
}: MemoryFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [value, setValue] = useState(initial);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState(
    typeof initial.media === "string" ? initial.media : initial.media?.url,
  );
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

  function update(field: keyof MemoryValue, next: string) {
    setValue((current) => ({ ...current, [field]: next }));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      file.size > 5_000_000
    ) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!value.title.trim() || !value.story.trim() || !value.date) {
      setError("A title, date, and story are needed.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("title", value.title);
      formData.set("story", value.story);
      formData.set("date", value.date);
      formData.set("mood", value.mood);
      formData.set("location", value.location);
      if (mediaFile) formData.set("media", mediaFile);

      const response = await fetch(
        memoryId ? `/api/memories/${memoryId}` : "/api/memories",
        {
          method: memoryId ? "PATCH" : "POST",
          credentials: "include",
          body: formData,
        },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error ?? "Unable to save this memory.");
      router.push(`/vault/memories/${body.memory._id}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save this memory.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} className="memory-editor" onSubmit={handleSubmit}>
      <div className="memory-editor-field memory-editor-field--wide">
        <label htmlFor="memory-title">Title</label>
        <input
          id="memory-title"
          value={value.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="A day worth keeping"
          maxLength={140}
          required
        />
      </div>
      <div className="memory-editor-row">
        <div className="memory-editor-field">
          <label htmlFor="memory-date">Date</label>
          <input
            id="memory-date"
            type="date"
            value={value.date}
            onChange={(event) => update("date", event.target.value)}
            required
          />
        </div>
        <div className="memory-editor-field">
          <label htmlFor="memory-mood">Mood</label>
          <select
            id="memory-mood"
            value={value.mood}
            onChange={(event) => update("mood", event.target.value)}
          >
            {memoryMoods.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="memory-editor-field">
        <label htmlFor="memory-story">Story</label>
        <textarea
          id="memory-story"
          value={value.story}
          onChange={(event) => update("story", event.target.value)}
          placeholder="What do you want to remember about it?"
          maxLength={5000}
          required
        />
      </div>
      <div className="memory-editor-row">
        <div className="memory-editor-field">
          <label htmlFor="memory-location">
            Location <span>Optional</span>
          </label>
          <input
            id="memory-location"
            value={value.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Somewhere familiar"
            maxLength={140}
          />
        </div>
        <div className="memory-editor-field">
          <label htmlFor="memory-photo">
            Photo <span>Optional / 5 MB max</span>
          </label>
          <input
            id="memory-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhoto}
          />
        </div>
      </div>
      {mediaPreview && (
        <img
          className="memory-editor-preview"
          src={mediaPreview}
          alt="Selected memory preview"
        />
      )}
      <div className="memory-editor-footer">
        <p role="alert">{error}</p>
        <button className="memory-submit" type="submit" disabled={saving}>
          {saving ? "Keeping..." : "Save memory"} <span>↗</span>
        </button>
      </div>
    </form>
  );
}
