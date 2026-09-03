import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FashionSection from "@/app/components/FashionSection";

export default function FashionPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <FashionSection />
      </div>
      <Footer />
    </main>
  );
}
