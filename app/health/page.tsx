import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import HealthSection from "@/app/components/HealthSection";

export default function HealthPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <HealthSection />
      </div>
      <Footer />
    </main>
  );
}
