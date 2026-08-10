"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

/**
 * ContactForm — artevo.com-inspired contact section.
 *
 * Left column: heading "Leave A Comments" + full form (name, email,
 * phone, subject, message textarea, submit button).
 * Right column: "Contact Information" with email, phone, address,
 * social icons.
 *
 * Below: full-bleed map illustration.
 *
 * All copy is GSAP-revealed via data-reveal; the form has local state
 * for a clean "submit pending" → "submitted" transition.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "Contact Page",
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      form.reset();
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <>
      {/* Top — eyebrow + headline */}
      <div className="mx-auto max-w-[1400px] px-6 pt-28 md:px-12 md:pt-36 lg:px-16">
        <p
          data-reveal
          className="mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500"
        >
          <span aria-hidden className="block h-px w-10 bg-zinc-400" />
          Get In Touch
        </p>
        <h2
          data-split-text
          className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-light italic leading-[1.05] tracking-tight text-zinc-900"
        >
          Leave A Comment.
        </h2>
      </div>

      {/* Form + contact info */}
      <div className="mx-auto max-w-[1400px] px-6 pt-20 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-14 border-t border-zinc-200 pt-14 md:grid-cols-12 md:gap-16">
          {/* Left — form */}
          <form
            data-reveal
            onSubmit={handleSubmit}
            className="md:col-span-7"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <Field label="Full Name" name="name" required />
              <Field
                label="Email Address"
                name="email"
                type="email"
                required
              />
              <Field label="Phone Number" name="phone" type="tel" />
              <Field label="Subject" name="subject" />
            </div>

            <div className="mt-6 md:mt-8">
              <label className="block text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Tell us a little about the project
              </label>
              <textarea
                name="message"
                rows={6}
                required
                placeholder="Site location, plot size, brief, timeline…"
                className="mt-3 w-full resize-none border-b border-zinc-300 bg-transparent py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none md:text-[15px]"
              />
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="mt-10 inline-flex items-center justify-center bg-zinc-900 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "idle"
                ? "Post Comments"
                : status === "sending"
                  ? "Sending…"
                  : status === "sent"
                    ? "Thanks — we'll reply shortly"
                    : "Try again"}
            </button>
            <p
              aria-live="polite"
              className="mt-3 min-h-5 text-[11px] text-zinc-500"
            >
              {status === "sent"
                ? "Thank you. Our team will contact you shortly."
                : status === "error"
                  ? errorMessage
                  : ""}
            </p>
          </form>

          {/* Right — contact information */}
          <aside
            data-reveal
            className="md:col-span-4 md:col-start-9"
          >
            <p className="mb-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              <span aria-hidden className="block h-px w-10 bg-zinc-400" />
              Contact Information
            </p>

            <ul className="mt-6 space-y-7 text-sm text-zinc-700 md:text-[15px]">
              <li className="flex items-start gap-4">
                <span className="mt-1 text-zinc-400">
                  <FiMail size={16} strokeWidth={1.6} />
                </span>
                <a
                  href="mailto:sales@abhignaconstructions.com"
                  className="transition hover:text-zinc-900"
                >
                  sales@abhignaconstructions.com
                </a>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 text-zinc-400">
                  <FiPhone size={16} strokeWidth={1.6} />
                </span>
                <a
                  href="tel:+919663763333"
                  className="transition hover:text-zinc-900"
                >
                  +91 96637 63333
                </a>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 text-zinc-400">
                  <FiMapPin size={16} strokeWidth={1.6} />
                </span>
                <address className="not-italic">
                  Site 285, 13th Cross,
                  <br />
                  17th Main Rd, Sector 4, HSR Layout, Bengaluru 560102
                </address>
              </li>
            </ul>

            <div className="mt-10 flex items-center gap-5 text-zinc-500">
              <a
                href="https://www.facebook.com/profile.php?id=61591677686242"
                aria-label="Facebook"
                className="transition hover:text-zinc-900"
              >
                <FiFacebook size={16} strokeWidth={1.6} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="transition hover:text-zinc-900"
              >
                <FiInstagram size={16} strokeWidth={1.6} />
              </a>
              <a
                href="https://in.linkedin.com/company/abhigna-constructions-official"
                aria-label="LinkedIn"
                className="transition hover:text-zinc-900"
              >
                <FiLinkedin size={16} strokeWidth={1.6} />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Full-width map embed */}
      <div
        data-reveal
        className="relative mx-auto mt-28 h-[58vh] min-h-[420px] w-full overflow-hidden md:mt-36"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8831051481106!2d77.64027657507543!3d12.915233887394944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15003057c5bb%3A0x69f98b0e5a504ffd!2sAbhigna%20Capitol!5e0!3m2!1sen!2sin!4v1786181269147!5m2!1sen!2sin"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title="Abhigna Capitol location map"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-12 md:pb-14 lg:px-16">
            <div className="inline-flex items-center gap-3 bg-white/90 px-5 py-3 backdrop-blur">
              <span className="text-zinc-900">
                <FiMapPin size={14} strokeWidth={1.6} />
              </span>
              <span className="text-xs uppercase tracking-[0.28em] text-zinc-900">
                HSR Layout · Bengaluru
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-3 w-full border-b border-zinc-300 bg-transparent py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none md:text-[15px]"
      />
    </label>
  );
}
