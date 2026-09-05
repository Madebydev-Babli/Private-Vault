"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type CapsuleFormProps = {
  capsuleId?: string;
  initial?: { title: string; content: string; unlockAt: string };
};

function toInputDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function CapsuleForm({ capsuleId, initial }: CapsuleFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [value, setValue] = useState({ title: initial?.title ?? "", content: initial?.content ?? "", unlockAt: toInputDate(initial?.unlockAt) });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;
    const context = gsap.context(() => gsap.fromTo(formRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }), formRef);
    return () => context.revert();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!value.title.trim() || (!capsuleId && !value.content.trim()) || !value.unlockAt || new Date(value.unlockAt).getTime() <= Date.now()) {
      setError("A title, message, and future unlock date are needed.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(capsuleId ? `/api/capsules/${capsuleId}` : "/api/capsules", { method: capsuleId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(value) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to save this capsule.");
      router.push(`/vault/capsules/${body.capsule._id}`);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to save this capsule.");
    } finally {
      setSaving(false);
    }
  }

  return <form ref={formRef} className="capsule-editor" onSubmit={submit}>
    <label>Title<input value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} placeholder="For another day" maxLength={140} required /></label>
    <label>Unlock date and time<input type="datetime-local" value={value.unlockAt} onChange={(event) => setValue({ ...value, unlockAt: event.target.value })} required /></label>
    <label className="capsule-editor-content">{capsuleId ? "Replace message (optional)" : "Your message"}<textarea value={value.content} onChange={(event) => setValue({ ...value, content: event.target.value })} placeholder={capsuleId ? "Leave blank to keep the sealed message unchanged." : "Write something for the future..."} maxLength={20000} required={!capsuleId} /></label>
    <div className="capsule-editor-footer"><p role="alert">{error}</p><button type="submit" disabled={saving}>{saving ? "Sealing..." : "Seal this capsule"} <span>↗</span></button></div>
  </form>;
}
