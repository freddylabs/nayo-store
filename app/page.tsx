import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import ShopCollections from "@/app/components/ShopCollections";
import SectionClose from "@/app/components/SectionClose";
import Footer from "@/app/components/Footer";
import VideoLoader from "@/app/components/VideoLoader";
import { getCatalog, getCopy } from "@/app/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, copy] = await Promise.all([getCatalog(), getCopy()]);

  return (
    <main className="relative">
      <VideoLoader />
      <div className="nayo-home">
        <Navbar />
        <Hero copy={copy} />
        <ShopCollections products={products} copy={copy} />
        <SectionClose
          eyebrow={copy.landingCloseEyebrow}
          title={copy.landingCloseTitle}
          body={copy.landingCloseBody}
          href="/contact"
          cta={copy.landingCloseCta}
        />
        <Footer />
      </div>
    </main>
  );
}
