import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import ScrollMotion from "@/components/ui/ScrollMotion";
import SecondaryHero from "@/components/ui/SecondaryHero";
import AboutStory from "@/components/About/AboutStory";
import SiteFooter from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <ScrollMotion />
      <main id="about" className="relative isolate bg-brand-bg">
        <SecondaryHero
          eyebrow="— About Us"
          headline="Building communities with purpose."
          headlineLines={["Building communities", "with purpose."]}
          paragraph="Established in 2007, Abhigna Constructions is one of Bangalore's leading real estate developers, creating residential projects that combine engineering, financial, and design strength with a community-first vision."
          imageSrc="https://cdn.sthyra.com/AADHYA%20SERENE/images/HighresScreenshot00034.png"
          imageAlt="Modern architectural facade with strong horizontals"
        />
        <AboutStory />
      </main>
      <SiteFooter />
    </>
  );
}
