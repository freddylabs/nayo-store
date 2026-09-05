import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionClose({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-nayo-green">
      <div className="max-w-[800px] mx-auto px-6 py-16 sm:py-20 text-center">
        <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
          {eyebrow}
        </p>
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-white/75 text-sm sm:text-base leading-relaxed">
          {body}
        </p>
        <Link
          href={href}
          className="btn-gold inline-flex items-center gap-2 mt-8 px-6 py-3 text-xs tracking-widest uppercase font-bold"
        >
          {cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
