import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Cursor from "@/components/ui/Cursor";
import SustainabilityStory from "@/components/Sustainability/SustainabilityStory";

export const metadata: Metadata = {
  title: "Sustainability — Abhigna Constructions",
  description:
    "How Abhigna Constructions makes lasting choices for land, people, and the families who live in our homes.",
};

export default function SustainabilityPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <SustainabilityStory />
    </>
  );
}
