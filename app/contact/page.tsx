import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import ScrollMotion from "@/components/ui/ScrollMotion";
import SecondaryHero from "@/components/ui/SecondaryHero";
import ContactForm from "@/components/Contact/ContactForm";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <ScrollMotion />
      <main id="contact" className="relative isolate bg-brand-bg">
        <SecondaryHero
          eyebrow="— Contact Us"
          headline="Tell us about your project."
          paragraph="Send us a few lines about the site, the brief, and the timeline you have in mind. We'll come back to you within one working day."
          imageSrc="https://cdn.sthyra.com/MISTY_WOODS_IMAGES/WhatsApp%20Image%202026-08-10%20at%2012.22.50%20PM%20(1).jpg"
          imageAlt="Architectural office interior with drafting tables"
        />
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}      