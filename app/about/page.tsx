import type { Metadata } from "next";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import AboutStory from "@/components/About/AboutStory";

export const metadata: Metadata = {
  title: "Our Story — Abhigna Constructions",
  description:
    "The story of Abhigna Constructions, founded by civil engineers and built around a lasting commitment to homes and families.",
};

export default function AboutPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <AboutStory />
    </>
  );
}
