import Image from "next/image";
import { Flag } from "./Flag";

const OPTIMIZABLE = /^(\/|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/)/;

/**
 * Scholarship cover: the photo when there is one (optimized by next/image for local
 * files and Blob uploads), otherwise the country flag under the brand gradient.
 */
export function Cover({
  src,
  country,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  country: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <span aria-hidden className={`absolute inset-0 overflow-hidden bg-midnight ${className}`}>
        <span className="absolute inset-0 scale-110 opacity-50">
          <Flag code={country} className="!h-full !w-full !rounded-none !shadow-none !ring-0" />
        </span>
        <span className="absolute inset-0 bg-linear-to-br from-midnight/90 via-midnight/60 to-navy/40" />
      </span>
    );
  }
  if (OPTIMIZABLE.test(src)) {
    return <Image src={src} alt="" fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element -- covers from other hosts are not in images.remotePatterns
  return <img src={src} alt="" loading={priority ? "eager" : "lazy"} className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
}
