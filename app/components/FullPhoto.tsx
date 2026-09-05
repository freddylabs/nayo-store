import Image from "next/image";

export default function FullPhoto({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#F3F4F6] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        className="object-contain object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
