import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import { healthProducts } from "@/app/data/products";

export default function HealthPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="max-w-[1400px] mx-auto section-padding">
          <h1 className="text-display text-4xl sm:text-5xl font-bold text-nayo-black mb-3">
            Nayo <span className="gold-text">Health</span>
          </h1>
          <p className="text-nayo-black/60 max-w-xl mb-12">
            Clinical clothing and accessories built for long shifts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
