"use client";

import { useState } from "react";
import { FiArrowRight, FiPhone, FiMail } from "react-icons/fi";

export default function ContactCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-brand-bg px-6 py-32"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-zinc-950 px-8 py-20 text-white md:px-16 md:py-24">
        {/* BG ornament */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Schedule a viewing
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
            Let&apos;s find the
            <br />
            home you deserve.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
            Leave your email and one of our senior advisors will reach out
            within 24 hours with a tailored shortlist.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none sm:w-96"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 transition hover:bg-white/90"
            >
              {submitted ? "Thank you!" : "Get Started"}
              <FiArrowRight size={14} />
            </button>
          </form>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/70 sm:flex-row sm:gap-10">
            <a
              href="tel:+919663763333"
              className="flex items-center gap-2 hover:text-white"
            >
              <FiPhone size={14} /> +91 96637 63333
            </a>
            <a
              href="mailto:sales@abhignaconstructions.com"
              className="flex items-center gap-2 hover:text-white"
            >
              <FiMail size={14} /> sales@abhignaconstructions.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
