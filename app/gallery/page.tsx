import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import ScrollMotion from "@/components/ui/ScrollMotion";
import SecondaryHero from "@/components/ui/SecondaryHero";
import CurvedGallery from "@/components/Home/CurvedGallery";
import SiteFooter from "@/components/SiteFooter";

export default function GalleryPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <ScrollMotion />
      <main id="gallery" className="relative isolate bg-brand-bg">
        <SecondaryHero
          eyebrow="— Gallery"
          headline="A house, seen from every angle."
          paragraph="Frames from completed and ongoing projects — materials, light, landscape, and the small details that decide how a building lives."
          imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80"
          imageAlt="Modern residential exterior at dusk"
        />
        <CurvedGallery />
      </main>
      <SiteFooter />
    </>
  );
}