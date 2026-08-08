"use client";

import { useState, type FormEvent } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

type FormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  projectType: "",
  message: "",
};

const PROJECT_TYPES = [
  "New Residence",
  "Renovation",
  "Hospitality",
  "Interior Design",
  "Master Planning",
  "Commercial",
  "Other",
];

export default function Footer() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (
    field: keyof FormState,
    value: string,
  ) => {
    setStatus("idle");
    setErrorMessage("");

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "Homepage Footer",
          name: form.name,
          email: form.email,
          projectType: form.projectType,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("sent");
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <footer
      id="contact"
      className="w-full bg-[#f5f2ec] text-[#1c1c1a]"
    >
      {/* Main footer area */}
      <div className="border-y border-[#c9c5bc]">
        <div
          className="
            mx-auto grid w-full
            max-w-[1600px]
            grid-cols-1
            md:grid-cols-[29%_43%_28%]
          "
        >
          {/* LEFT COLUMN */}
          <div
            className="
              flex min-h-[310px] flex-col
              justify-center
              border-b border-[#c9c5bc]
              px-8 py-14
              sm:px-12
              md:min-h-[365px]
              md:border-b-0
              md:border-r
              md:px-[7vw]
              md:py-12
              lg:px-[6.5vw]
            "
          >
            <div className="max-w-[245px]">
              <h2
                className="
                  font-display
                  text-[42px]
                  font-normal
                  leading-[0.96]
                  tracking-[-0.035em]
                  text-[#171715]
                  sm:text-[48px]
                  md:text-[44px]
                  lg:text-[52px]
                "
              >
                Let&rsquo;s build
                <br />
                something
                <br />
                exceptional.
              </h2>

              <div className="mt-5 h-px w-8 bg-[#77736a]" />

              <p
                className="
                  mt-4 max-w-[220px]
                  text-[12px]
                  leading-[1.7]
                  text-[#4f4d47]
                "
              >
                Tell us about your project and our team will
                be in touch.
              </p>
            </div>
          </div>

          {/* CENTRE COLUMN */}
          <div
            className="
              flex min-h-[365px]
              items-center
              border-b border-[#c9c5bc]
              px-8 py-12
              sm:px-12
              md:border-b-0
              md:border-r
              md:px-10
              lg:px-14
            "
          >
            <form
              onSubmit={handleSubmit}
              className="w-full"
              noValidate
            >
              <div className="grid grid-cols-1">
                <FormInput
                  id="footer-name"
                  label="Name"
                  value={form.name}
                  required
                  onChange={(value) =>
                    updateField("name", value)
                  }
                />

                <FormInput
                  id="footer-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  required
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />

                <ProjectSelect
                  id="footer-project-type"
                  value={form.projectType}
                  onChange={(value) =>
                    updateField("projectType", value)
                  }
                />

                <FormTextarea
                  id="footer-message"
                  value={form.message}
                  required
                  onChange={(value) =>
                    updateField("message", value)
                  }
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor="image"
                className="
                  mt-5 inline-flex
                  min-h-[48px] min-w-[185px]
                  items-center justify-between gap-8
                  bg-black
                  px-6
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-white
                  transition-colors
                  duration-300
                  hover:bg-[#292929]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-black
                "
              >
                <span>
                  {status === "sent"
                    ? "Inquiry sent"
                    : status === "sending"
                      ? "Sending..."
                      : status === "error"
                        ? "Try again"
                        : "Send inquiry"}
                </span>

                <FiArrowRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.4}
                />
              </button>

              <div
                aria-live="polite"
                className="
                  mt-2 min-h-4
                  text-[10px]
                  text-[#555149]
                "
              >
                {status === "sent"
                  ? "Thank you. Our team will contact you shortly."
                  : status === "error"
                    ? errorMessage
                  : ""}
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN */}
          <div
            className="
              flex min-h-[340px]
              items-center
              px-8 py-12
              sm:px-12
              md:min-h-[365px]
              md:px-9
              lg:px-12
            "
          >
            <div className="w-full">
              <a
                href="#hero"
                aria-label="Go to the top of the page"
                className="inline-flex flex-col items-start"
              >
                <img
                  src="/abhigna-logo.png"
                  alt="Abhigna Constructions"
                  className="block h-auto w-[96px] object-contain sm:w-[112px]"
                />
              </a>

              <div className="mt-6 h-px w-full bg-[#d1cdc4]" />

              <address className="mt-5 not-italic">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FiMapPin
                      aria-hidden="true"
                      className="
                        mt-[2px] shrink-0
                        text-[#5d5a53]
                      "
                      size={13}
                      strokeWidth={1.5}
                    />

                    <span
                      className="
                        text-[11px]
                        leading-[1.6]
                        text-[#373631]
                      "
                    >
                      Site 285, 13th Cross,
                      <br />
                      17th Main Rd, Sector 4, HSR Layout, Bengaluru 560102
                    </span>
                  </li>

                  <li className="flex items-center gap-3">
                    <FiMail
                      aria-hidden="true"
                      className="shrink-0 text-[#5d5a53]"
                      size={13}
                      strokeWidth={1.5}
                    />

                    <a
                      href="mailto:sales@abhignaconstructions.com"
                      className="
                        text-[11px]
                        text-[#373631]
                        transition-colors
                        hover:text-black
                      "
                    >
                      sales@abhignaconstructions.com
                    </a>
                  </li>

                  <li className="flex items-center gap-3">
                    <FiPhone
                      aria-hidden="true"
                      className="shrink-0 text-[#5d5a53]"
                      size={13}
                      strokeWidth={1.5}
                    />

                    <a
                      href="tel:+919663763333"
                      className="
                        text-[11px]
                        text-[#373631]
                        transition-colors
                        hover:text-black
                      "
                    >
                      +91 96637 63333
                    </a>
                  </li>
                </ul>
              </address>

              <nav
                aria-label="Social media"
                className="
                  mt-7 flex flex-wrap
                  items-center gap-x-3 gap-y-2
                "
              >
                <SocialLink
                  href="https://instagram.com"
                  label="Instagram"
                />

                <SocialDivider />

                <SocialLink
                  href="https://linkedin.com"
                  label="LinkedIn"
                />

                <SocialDivider />

                <SocialLink
                  href="https://pinterest.com"
                  label="Pinterest"
                />
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* BLACK BOTTOM BAR */}
      <div className="bg-black text-white">
        <div
          className="
            mx-auto flex min-h-[44px]
            w-full max-w-[1600px]
            flex-col items-start
            justify-between gap-3
            px-7 py-4
            sm:px-10
            md:flex-row
            md:items-center
            md:px-12
            md:py-0
            lg:px-16
          "
        >
          <p
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-white/75
            "
          >
            © 2026 Abhigna Constructions. All rights reserved.
          </p>

          <nav
            aria-label="Legal links"
            className="flex items-center gap-8"
          >
            <a
              href="/privacy"
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-white/75
                transition-colors
                hover:text-white
              "
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-white/75
                transition-colors
                hover:text-white
              "
            >
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

type FormInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  required?: boolean;
};

function FormInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: FormInputProps) {
  return (
    <div className="border-b border-[#aaa69d]">
      <label
        htmlFor={id}
        className="
          block pt-1
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[#34332f]
        "
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete={
          type === "email" ? "email" : "name"
        }
        required={required}
        className="
          block h-[34px] w-full
          border-0
          bg-transparent
          px-0
          text-[12px]
          text-[#171715]
          outline-none
          placeholder:text-[#8b877f]
          focus:ring-0
        "
      />
    </div>
  );
}

type ProjectSelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

function ProjectSelect({
  id,
  value,
  onChange,
}: ProjectSelectProps) {
  return (
    <div className="relative border-b border-[#aaa69d]">
      <label
        htmlFor={id}
        className="
          block pt-4
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[#34332f]
        "
      >
        Project type
      </label>

      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required
        className="
          block h-[34px] w-full
          cursor-pointer
          appearance-none
          border-0
          bg-transparent
          px-0 pr-8
          text-[11px]
          text-[#171715]
          outline-none
          focus:ring-0
        "
      >
        <option value="" disabled>
          Select project type
        </option>

        {PROJECT_TYPES.map((projectType) => (
          <option
            key={projectType}
            value={projectType}
          >
            {projectType}
          </option>
        ))}
      </select>

      <FiChevronDown
        aria-hidden="true"
        size={13}
        strokeWidth={1.3}
        className="
          pointer-events-none
          absolute bottom-[11px] right-0
          text-[#68645d]
        "
      />
    </div>
  );
}

type FormTextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function FormTextarea({
  id,
  value,
  onChange,
  required = false,
}: FormTextareaProps) {
  return (
    <div className="border-b border-[#aaa69d]">
      <label
        htmlFor={id}
        className="
          block pt-4
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[#34332f]
        "
      >
        Tell us about your project
      </label>

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={2}
        required={required}
        className="
          block min-h-[58px] w-full
          resize-none
          border-0
          bg-transparent
          px-0 py-2
          text-[12px]
          leading-relaxed
          text-[#171715]
          outline-none
          placeholder:text-[#8b877f]
          focus:ring-0
        "
      />
    </div>
  );
}

function SocialLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="image"
      className="
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.2em]
        text-[#34332f]
        transition-colors
        hover:text-black
      "
    >
      {label}
    </a>
  );
}

function SocialDivider() {
  return (
    <span
      aria-hidden="true"
      className="h-2.5 w-px bg-[#8f8b83]"
    />
  );
}
