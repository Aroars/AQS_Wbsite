"use client";

import { useRevealOnce } from "@/components/ui/animated-section";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/* Word-by-word rise-in. The words are plain spans in the HTML, so the
   headline is always present for crawlers and no-JS readers; the motion
   is CSS (.reveal-word in globals.css) and only runs when allowed. */
export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
  as: Tag = "span",
}: SplitTextProps) {
  const { ref, visible } = useRevealOnce<HTMLSpanElement>("0px");
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              className={`inline-block reveal-word ${visible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${delay + i * stagger}s` }}
            >
              {word}
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
