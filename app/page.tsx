import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import LegacySection from "@/app/components/LegacySection";
import DivisionsSection from "@/app/components/DivisionsSection";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import VideoLoader from "@/app/components/VideoLoader";

export default function Home() {
  return (
    <main className="relative">
      <VideoLoader />
      <Navbar />
      <Hero />
      <LegacySection />
      <DivisionsSection />
      <Testimonials />
      <Footer />
      <CartDrawer />
    </main>
  );
}
