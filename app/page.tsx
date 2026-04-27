import { HeroScroller } from "@/components/HeroScroller";
import { Sections } from "@/components/Sections";
import { WorkSection } from "@/components/WorkSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] text-[#181818]">
      {/* Main content */}
      <main className="lg:snap-y lg:snap-proximity">
        <ScrollToTopOnLoad />
        <HeroScroller />
        <Sections />
        <WorkSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
