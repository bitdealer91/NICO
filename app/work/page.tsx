import { Header } from "@/components/Header";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { WorkSection } from "@/components/WorkSection";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <main>
        <ScrollToTopOnLoad />
        <Header />
        <WorkSection />
      </main>
    </div>
  );
}

