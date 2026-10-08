import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Cursor from "@/components/ui/Cursor";
import ServicesGrid from "@/components/Services/ServicesGrid";

export const metadata: Metadata = {
  title: "Our Services — Abhigna Constructions",
  description: "Explore what makes Abhigna Constructions a thoughtful choice for residential development in Bengaluru.",
};

export default function ServicesPage() {
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
