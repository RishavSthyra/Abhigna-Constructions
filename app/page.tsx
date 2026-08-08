import Landing_Hero from "@/components/Home/Landing_Hero";
import Nav from "@/components/Nav";
import ExperienceExcellence from "@/components/Home/ExperienceExcellence";
import CurvedGallery from "@/components/Home/CurvedGallery";
import DreamHomeListings from "@/components/Home/DreamHomeListings";
import StatsBand from "@/components/Home/StatsBand";
import WhyUs from "@/components/Home/WhyUs";
import ArchitecturalScrollPath from "@/components/Home/ArchitecturalScrollPath";
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
        <ExperienceExcellence />
        <CurvedGallery />
        <DreamHomeListings />
        <StatsBand />
        <WhyUs />
      </main>
    </>
  );
}
