import Image from "next/image";
import type { ImageRef } from "@/data/conveyors";

/**
 * A CAD render on the dark theme: white-background renders get a light card
 * and `object-contain` so the model is not cropped, plus a small "Engineering
 * render" tag so nobody mistakes it for an install photo. Photos should use
 * the usual fill + object-cover pattern instead.
 */
export function RenderFigure({
  image,
  priority = false,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: {
  image: ImageRef;
  priority?: boolean;
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className={`relative ${aspect} rounded-xl overflow-hidden border border-white/[0.08] bg-[#f3f5f7]`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          className="object-contain p-3"
          sizes={sizes}
        />
        <span className="absolute bottom-2 right-2 font-mono text-[0.52rem] tracking-[0.12em] uppercase text-[#1a1d2b]/60 bg-white/80 rounded px-1.5 py-0.5">
          Engineering render
        </span>
      </div>
      {image.caption && (
        <figcaption className="font-sans text-[0.76rem] text-text-dim mt-2 leading-[1.5]">{image.caption}</figcaption>
      )}
    </figure>
  );
}
