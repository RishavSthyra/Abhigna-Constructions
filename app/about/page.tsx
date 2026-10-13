import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutStory from "@/components/About/AboutStory";

export const metadata: Metadata = {
  title: "About — Abhigna Constructions",
  description:
    "Engineering-led homes since 2007. Learn about Abhigna Constructions, founded by civil engineer Bhaskar Reddy in Bengaluru.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <AboutStory />
    </>
  );
}
