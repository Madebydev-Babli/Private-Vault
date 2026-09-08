"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type Media = {
  url: string;
  publicId?: string;
  resourceType?: "image" | "video" | string;
};
type MemoryValue = {
  title: string;
  story: string;
  date: string;
  perspective?: "ritika" | "riya";
  media?: string | Media | Media[];
};
type NewMedia = { file: File; preview: string };
type MemoryFormProps = { initial?: MemoryValue; memoryId?: string };

const emptyValue: MemoryValue = {
  title: "",
  story: "",
  date: "",
  perspective: "ritika",
};
const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function initialMedia(value?: MemoryValue["media"]): Media[] {
  if (!value) return [];
  if (typeof value === "string") return [{ url: value }];
  return Array.isArray(value) ? value : [value];
}

function isVideo(media: Media | NewMedia) {
  return "file" in media
    ? media.file.type.startsWith("video/")
    : media.resourceType === "video";
}

export default function MemoryForm({
  initial = emptyValue,
  memoryId,
}: MemoryFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<MemoryValue>({
    ...emptyValue,
    ...initial,
    perspective: initial.perspective ?? "ritika",
  });
  const [existingMedia, setExistingMedia] = useState<Media[]>(
    initialMedia(initial.media),
  );
  const [newMedia, setNewMedia] = useState<NewMedia[]>([]);
  const [removedMedia, setRemovedMedia] = useState<Media[]>([]);
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
    setValue((current) => ({
      ...current,
      [field]:
        field === "perspective" ? (next as MemoryValue["perspective"]) : next,
    }));
  }

  function handleMedia(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const invalid = files.find(
      (file) => !acceptedTypes.includes(file.type) || file.size > 50_000_000,
    );
    if (invalid) {
      setError(
        "Choose JPG, PNG, WebP, MP4, WebM, or MOV files under 50 MB each.",
      );
      return;
    }
    setError("");
    setNewMedia((current) => [
      ...current,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    event.target.value = "";
  }

  function removeExisting(media: Media) {
    setExistingMedia((current) => current.filter((item) => item !== media));
    if (media.publicId) setRemovedMedia((current) => [...current, media]);
  }

  function removeNew(media: NewMedia) {
    URL.revokeObjectURL(media.preview);
    setNewMedia((current) => current.filter((item) => item !== media));
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
      formData.set("perspective", value.perspective ?? "ritika");
      newMedia.forEach((media) => formData.append("media", media.file));
      if (memoryId)
        formData.set(
          "removedMedia",
          JSON.stringify(
            removedMedia.map(({ publicId, resourceType }) => ({
              publicId,
              resourceType,
            })),
          ),
        );
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
        <div className="two-sides-picker">
          <p className="two-sides-picker-label">Whose memory is this?</p>
          <div className="two-sides-picker-grid">
            {(["ritika", "riya"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`two-sides-option ${value.perspective === option ? "two-sides-option--active" : ""}`}
                onClick={() => update("perspective", option)}
              >
                <span>{option === "ritika" ? "ritika" : "riya"}</span>
                <small>her side</small>
              </button>
            ))}
          </div>
        </div>
      </div>
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
        <label htmlFor="memory-story">Tell the story...</label>
        <textarea
          id="memory-story"
          value={value.story}
          onChange={(event) => update("story", event.target.value)}
          placeholder="Some moments are impossible to explain in a photo..."
          maxLength={5000}
          required
        />
      </div>
      <div className="memory-media-upload">
        <div>
          <label htmlFor="memory-media">Add Photos &amp; Videos</label>
          <p>Choose several now, or add more later.</p>
        </div>
        <input
          ref={fileInputRef}
          id="memory-media"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          multiple
          onChange={handleMedia}
        />
        <button
          type="button"
          className="memory-add-media"
          onClick={() => fileInputRef.current?.click()}
        >
          + Add more
        </button>
        {(existingMedia.length > 0 || newMedia.length > 0) && (
          <div className="memory-media-previews">
            {existingMedia.map((media) => (
              <div
                className="memory-media-preview"
                key={media.publicId ?? media.url}
              >
                <MediaPreview media={media} />
                <button
                  type="button"
                  aria-label="Remove existing media"
                  onClick={() => removeExisting(media)}
                >
                  ×
                </button>
              </div>
            ))}
            {newMedia.map((media) => (
              <div className="memory-media-preview" key={media.preview}>
                <MediaPreview media={media} />
                <button
                  type="button"
                  aria-label="Remove selected media"
                  onClick={() => removeNew(media)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="memory-editor-footer">
        <p role="alert">{error}</p>
        <button className="memory-submit" type="submit" disabled={saving}>
          {saving ? "Uploading memories..." : "Save memory"} <span>↗</span>
        </button>
      </div>
    </form>
  );
}

function MediaPreview({ media }: { media: Media | NewMedia }) {
  return isVideo(media) ? (
    <video
      src={"file" in media ? media.preview : media.url}
      controls
      preload="metadata"
    />
  ) : (
    <img
      src={"file" in media ? media.preview : media.url}
      alt="Memory preview"
    />
  );
}
