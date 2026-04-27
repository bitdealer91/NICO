import { Header } from "@/components/Header";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { ContactSection } from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--foreground)]">
      <main>
        <ScrollToTopOnLoad />
        <Header />
        <ContactSection />
      </main>
    </div>
  );
}

