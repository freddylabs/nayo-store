import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import ShopCollections from "@/app/components/ShopCollections";
import Footer from "@/app/components/Footer";
import VideoLoader from "@/app/components/VideoLoader";

export default function Home() {
  return (
    <main className="relative">
      <VideoLoader />
      <Navbar />
      <Hero />
      <ShopCollections />
      <Footer />
    </main>
  );
}
