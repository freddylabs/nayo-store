import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import FoodSection from "@/app/components/FoodSection";

export default function FoodPage() {
  return (
    <main className="relative bg-nayo-black min-h-screen">
      <Navbar />
      <div className="pt-24">
        <FoodSection />
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
