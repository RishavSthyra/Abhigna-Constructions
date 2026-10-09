import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Cursor from "@/components/ui/Cursor";
import ServicesGrid from "@/components/Services/ServicesGrid";

export const metadata: Metadata = {
  title: "Why Choose Us — Abhigna Constructions",
  description: "Discover why families choose Abhigna Constructions for thoughtfully engineered homes in Bengaluru.",
};

export default function WhyChooseUsPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <ServicesGrid />
      </main>
    </>
  );
}
