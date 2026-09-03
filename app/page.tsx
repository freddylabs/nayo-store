import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import CategoryShowcase from "@/app/components/CategoryShowcase";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import DivisionsSection from "@/app/components/DivisionsSection";
import Testimonials from "@/app/components/Testimonials";
import Newsletter from "@/app/components/Newsletter";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import VideoLoader from "@/app/components/VideoLoader";

export default function Home() {
  return (
    <main className="relative">
      <VideoLoader />
      <Navbar />
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <DivisionsSection />
      <Testimonials />
      <Newsletter />
      <Footer />
      <CartDrawer />
    </main>
  );
}
