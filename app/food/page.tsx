import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FoodSection from "@/app/components/FoodSection";
import { getCatalog, getCopy } from "@/app/lib/store";

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const [products, copy] = await Promise.all([getCatalog(), getCopy()]);
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <FoodSection
          products={products.filter((item) => item.category === "food")}
          copy={copy}
        />
      </div>
      <Footer />
    </main>
  );
}
