import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import FashionSection from "@/app/components/FashionSection";

export default function FashionPage() {
  return (
    <main className="relative bg-nayo-black min-h-screen">
      <Navbar />
      <div className="pt-24">
        <FashionSection />
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
