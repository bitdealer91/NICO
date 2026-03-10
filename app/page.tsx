import { Header } from "@/components/Header";
import { HeroScroller } from "@/components/HeroScroller";
import { Sections } from "@/components/Sections";
import { WorkSection } from "@/components/WorkSection";
import { ContactSection } from "@/components/ContactSection";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      {/* Main content */}
      <main>
        <ScrollToTopOnLoad />
        <Header />
        <HeroScroller />
        <Sections />
        <WorkSection />
        <ContactSection />
      </main>
    </div>
  );
}
