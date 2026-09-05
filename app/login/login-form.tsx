"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { authApi } from "@/app/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!shellRef.current) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro
        .from(".login-kicker", { opacity: 0, y: 18, duration: 0.8 })
        .from(".login-title", { opacity: 0, y: 20, duration: 0.9 }, "-=0.5")
        .from(".login-subtitle", { opacity: 0, y: 12, duration: 0.7 }, "-=0.5")
        .fromTo(
          ".login-form",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.5",
        );
    }, shellRef);

    return () => context.revert();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("That doesn't look right. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new Error("Invalid email");
      }

      await authApi.login(email.trim(), password);
      router.push("/vault");
      router.refresh();
    } catch {
      setError("That doesn't look right. Please try again.");
      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      ref={shellRef}
      className="login-shell"
      aria-label="Private login page"
    >
      <div className="login-paper" aria-hidden="true" />
      <div className="login-card">
        <p className="login-kicker">MEMENTO</p>
        <h1 className="login-title">a private little space</h1>
        <p className="login-subtitle">for us</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email" className="login-label">
            Email
          </label>
          <div className="login-input-wrap">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(error)}
            />
          </div>

          <label
            htmlFor="login-password"
            className="login-label login-label--space"
          >
            Password
          </label>
          <div className="login-input-wrap login-input-wrap--password">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(error)}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting || !email.trim() || !password.trim()}
          >
            {isSubmitting ? "Entering..." : "Enter"}
          </button>

          <p className="login-message" role="alert" aria-live="polite">
            {error || "This is a private space."}
          </p>
        </form>
      </div>
    </main>
  );
}
