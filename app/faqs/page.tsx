import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FAQSection from "@/components/FAQ/FAQSection";

export const metadata: Metadata = {
  title: "FAQs — Abhigna Constructions",
  description:
    "Answers to common questions about Abhigna Constructions, our homes, and our approach to building.",
};

export default function FAQsPage() {
  return (
    <>
      <Nav />
      <main>
        <FAQSection fullPage />
      </main>
    </>
  );
}
