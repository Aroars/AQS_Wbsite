"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ImageRef } from "@/data/conveyors";

/**
 * Crossfades through a set of images on a timer. Every image is in the DOM
 * (stacked, absolute) so the swap is a pure opacity transition. Honors
 * prefers-reduced-motion by showing only the first image.
 */
export function ImageShuffle({ images, intervalMs = 4500, sizes, className = "" }: { images: ImageRef[]; intervalMs?: number; sizes?: string; className?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative ${className}`}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          sizes={sizes}
          priority={i === 0}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
