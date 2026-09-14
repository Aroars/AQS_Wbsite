"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONVEYOR_ACCENT, spotlightHref, type ConveyorProject } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * One project card for the hub preview grid and the projects index. A project
 * with a spotlight body links to its page; a legacy card without one is a
 * plain card, so nothing ever links to a page that does not exist.
 */
export function ProjectCard({
  project,
  size = "full",
  href: hrefProp,
}: {
  project: ConveyorProject;
  size?: "preview" | "full";
  /** Server callers pass the link and a project stripped of its spotlight body, so the body is not serialized into the page */
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const href = hrefProp ?? (project.spotlight ? spotlightHref(project) : null);
  const preview = size === "preview";

  const body = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-8 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {project.image && (
        <div
          className={`relative aspect-[16/9] rounded-xl overflow-hidden -mx-2 -mt-2 ${preview ? "mb-4" : "mb-5"} ${
            project.image.kind === "render" ? "bg-[#f3f5f7]" : ""
          }`}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className={project.image.kind === "render" ? "object-contain p-2" : "object-cover"}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase mb-1.5" style={{ color: accent }}>
        {href ? "Project Spotlight" : "Case Study"}
      </div>
      <div className={`font-sans font-bold text-white mb-1 ${preview ? "text-[1.15rem]" : "text-[1.25rem]"}`}>
        {project.title}
      </div>
      <div className={`font-sans mb-3 ${preview ? "text-[0.78rem]" : "text-[0.82rem]"}`} style={{ color: accent }}>
        {project.subtitle}
      </div>
      <p className={`font-sans text-text-body ${preview ? "text-[0.85rem] leading-[1.6] mb-3.5" : "text-[0.88rem] leading-[1.65] mb-4"}`}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[0.56rem] border rounded-full px-2.5 py-1"
            style={{ color: `${accent}BF`, borderColor: `${accent}2E` }}
          >
            {t}
          </span>
        ))}
      </div>
      {href && (
        <div className="mt-4 font-mono text-[0.62rem] tracking-[0.08em] uppercase" style={{ color: accent }}>
          Read the spotlight &rarr;
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full no-underline">
      {body}
    </Link>
  ) : (
    body
  );
}
