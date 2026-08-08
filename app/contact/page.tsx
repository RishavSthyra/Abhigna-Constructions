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
          imageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80"
          imageAlt="Architectural office interior with drafting tables"
        />
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}      