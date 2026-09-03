import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FoodSection from "@/app/components/FoodSection";

export default function FoodPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <FoodSection />
      </div>
      <Footer />
    </main>
  );
}
