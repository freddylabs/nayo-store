import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SetPinForm from "./SetPinForm";
import { readPinLinkToken } from "@/app/lib/customers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Set your PIN · Nayo" };

export default async function SetPinPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";
  const customer = value ? await readPinLinkToken(value) : null;

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-36 pb-24 px-5 max-w-md mx-auto">
        <div className="rounded-3xl border border-nayo-gold/25 bg-[#FBF9F4] p-6 sm:p-9 shadow-[0_30px_80px_-40px_rgba(26,65,46,0.5)]">
          <p className="text-nayo-gold text-[11px] tracking-[0.3em] uppercase font-semibold">
            My orders
          </p>
          {customer ? (
            <>
              <h1 className="text-display text-3xl font-bold text-nayo-black mt-2">
                {customer.pinHash ? "Choose a new PIN" : "Set your PIN"}
              </h1>
              <p className="mt-1.5 mb-6 text-sm text-nayo-black/55">
                Customer ID <strong className="text-nayo-green tracking-wider">{customer.id}</strong>.
                You will sign in with this ID or your email, plus the PIN you choose here.
              </p>
              <SetPinForm token={value} />
            </>
          ) : (
            <>
              <h1 className="text-display text-3xl font-bold text-nayo-black mt-2">
                This link has expired
              </h1>
              <p className="mt-2 text-sm text-nayo-black/55">
                PIN links work once and for 7 days. Request a fresh one and we will email it right
                away.
              </p>
              <Link
                href="/account"
                className="btn-gold mt-6 inline-flex w-full items-center justify-center py-3.5 text-xs tracking-widest uppercase"
              >
                Get a new link
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
