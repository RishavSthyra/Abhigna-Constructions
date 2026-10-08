import Landing_Hero from "@/components/Home/Landing_Hero";
import Nav from "@/components/Nav";
import AboutIntro from "@/components/Home/AboutIntro";
import CurvedGallery from "@/components/Home/CurvedGallery";
import DreamHomeListings from "@/components/Home/DreamHomeListings";
import StatsBand from "@/components/Home/StatsBand";
import ServicesGrid from "@/components/Services/ServicesGrid";
import SustainabilityFeature from "@/components/Home/SustainabilityFeature";
import FAQSection from "@/components/FAQ/FAQSection";
import Cursor from "@/components/ui/Cursor";
import ScrollMotion from "@/components/ui/ScrollMotion";

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <ScrollMotion />
      <main
        id="hero"
        className="relative isolate"
      >
        <Landing_Hero />
        {/* <ArchitecturalScrollPath mainId="hero" /> */}
        <AboutIntro />
        <CurvedGallery />
        <DreamHomeListings />
        <StatsBand />
        <ServicesGrid headingLevel="h2" />
        <SustainabilityFeature />
        <FAQSection />
      </main>
    </>
  );
}
