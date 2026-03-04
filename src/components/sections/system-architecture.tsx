"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";

/* ================================================
   Types
   ================================================ */

type ProductSlug =
  | "veripak"
  | "evacupak"
  | "leak-detection"
  | "robotics"
  | "conveyors"
  | "intellipak";

interface Stage {
  label: string;
  icon: string;
  description: string;
  productSlug?: ProductSlug;
  subtitle: string;
  /** Override color for non-AQS stages (e.g. Reject = red) */
  color?: string;
}

interface LineConfig {
  id: string;
  name: string;
  description: string;
  stages: Stage[];
}

/* ================================================
   Constants
   ================================================ */

const ACCENT_COLORS: Record<ProductSlug, string> = {
  veripak: "#00c2ff",
  evacupak: "#00d4aa",
  "leak-detection": "#ff6666",
  robotics: "#4d9fff",
  conveyors: "#94A3B8",
  intellipak: "#f5a623",
};

const NEUTRAL_COLOR = "#8892B0";
const REJECT_COLOR = "#F87171";
const GAPPING_COLOR = "#A8B2D1";

const SLUG_TO_ROUTE: Record<ProductSlug, string> = {
  veripak: "/solutions/veripak",
  evacupak: "/solutions/evacupak",
  "leak-detection": "/solutions/leak-detection",
  robotics: "/solutions/robotics",
  conveyors: "/solutions/conveyors",
  intellipak: "/solutions/intellipak",
};

/* ================================================
   Per-Product Line Configurations
   ================================================ */

const PRODUCT_CONFIGS: Record<ProductSlug, LineConfig[]> = {
  /* ────────────────────────────────────────────────
     IntelliPak — corrected per process logic:
     Inspect → Reject → IntelliPak (always)
     ──────────────────────────────────────────────── */
  intellipak: [
    {
      id: "thermo-to-case",
      name: "Thermoform to Case Packer",
      description:
        "Products are inspected and rejected individually, then IntelliPak batches the verified products for case packing — so every batch is complete and correct.",
      stages: [
        {
          label: "Thermoformer",
          icon: "⚙",
          subtitle: "Form & Seal",
          description:
            "Discharges vacuum-sealed packages in 4/6/9 patterns at consistent machine cycle rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Vision Inspection",
          description:
            "Keyence vision detects seal defects, alignment issues, and label errors. Every package image is saved to the historian.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Defective packages are removed individually before batching — so downstream groups are never short-counted.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Batching & Staging",
          description:
            "With only verified product remaining, Mag-Drive belts batch and stage precise groupings at up to 500 ppm for the case packer.",
        },
        {
          label: "Case Packer",
          icon: "⬡",
          subtitle: "Pack & Palletize",
          description:
            "Case packer receives complete, inspected batches ready for packing and palletizing with full traceability data.",
        },
      ],
    },
    {
      id: "bowl-to-thermo",
      name: "Bowl Feeder to Thermoformer",
      description:
        "Singulated product from a bowl feeder is gapped for inspection clearance, inspected, defects rejected, then IntelliPak collates and times verified product for the thermoformer loading cycle.",
      stages: [
        {
          label: "Bowl Feeder",
          icon: "◔",
          subtitle: "Singulated Product",
          description:
            "Delivers singulated, randomly oriented product onto the line at variable rates.",
        },
        {
          label: "Gapping",
          icon: "↔",
          subtitle: "Inspection Clearance",
          color: GAPPING_COLOR,
          description:
            "A simple 1–2 belt gapping conveyor creates consistent spacing between products so VeriPak's cameras and sensors have the clearance they need for accurate inspection.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Vision Inspection",
          description:
            "Pre-packaging inspection catches product defects before they consume thermoformer film and cycle time.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Defective product is removed while still singulated — clean removal with no impact on downstream patterns.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Collation & Timing",
          description:
            "Collates and times only verified product into the precise patterns required by the thermoformer's loading cycle.",
        },
        {
          label: "Thermoformer",
          icon: "⚙",
          subtitle: "Packaging",
          description:
            "Receives perfectly timed, fully inspected product ready for vacuum sealing — zero wasted film on bad product.",
        },
      ],
    },
    {
      id: "multi-lane-wrapper",
      name: "Multi-Lane Merge to Flow Wrapper",
      description:
        "Multiple lanes are gapped for inspection clearance, inspected individually, defects rejected, then IntelliPak merges verified product into a single precisely gapped stream for the wrapper.",
      stages: [
        {
          label: "Multi-Lane",
          icon: "☰",
          subtitle: "Parallel Infeed",
          description:
            "Multiple parallel lanes deliver product at varying rates — common in bakery, snack, and protein lines.",
        },
        {
          label: "Gapping",
          icon: "↔",
          subtitle: "Inspection Clearance",
          color: GAPPING_COLOR,
          description:
            "Spaces products apart on each lane, giving VeriPak's cameras and sensors the clearance needed for accurate per-product inspection.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inline QC",
          description:
            "Each lane is inspected independently for product integrity, label accuracy, and defects before merging.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Per-Lane Removal",
          color: REJECT_COLOR,
          description:
            "Non-conforming product is diverted per-lane while still separated — no disruption to the merged output stream.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Merge & Gapping",
          description:
            "Mag-Drive powered merge conveyors combine only verified product into a single stream with tight pitch control for wrapper registration.",
        },
        {
          label: "Flow Wrapper",
          icon: "◫",
          subtitle: "HFFS / VFFS",
          description:
            "Receives a clean, perfectly spaced single-file stream — every product in the wrapper has passed inspection.",
        },
      ],
    },
  ],

  /* ────────────────────────────────────────────────
     VeriPak — inspection is the highlighted stage
     ──────────────────────────────────────────────── */
  veripak: [
    {
      id: "thermo-inspection",
      name: "Thermoform Inspection Line",
      description:
        "Every vacuum-sealed package is vision-inspected for seal defects, label errors, and weight variance — defects are rejected before batching so every downstream group is complete.",
      stages: [
        {
          label: "Thermoformer",
          icon: "⚙",
          subtitle: "Form & Seal",
          description:
            "Discharges vacuum-sealed packages at consistent machine cycle rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "SCADA Inspection",
          description:
            "Keyence vision detects seal defects, alignment issues, and label errors. Every package imaged, graded, and logged to the historian in real time.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Defective packages removed individually before downstream batching — groups are never short-counted.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Batching",
          description:
            "Batches verified product into precise groupings for the case packer.",
        },
        {
          label: "Case Packer",
          icon: "⬡",
          subtitle: "Pack & Ship",
          description:
            "Receives complete, inspected batches ready for packing with full traceability.",
        },
      ],
    },
    {
      id: "dairy-qa",
      name: "Dairy Fill & Inspect",
      description:
        "Filled containers are inspected inline for fill level, cap integrity, and label placement — rejects are diverted for product recovery via EvacuPak.",
      stages: [
        {
          label: "Filler",
          icon: "⚙",
          subtitle: "Liquid Fill",
          description:
            "Fill equipment discharges liquid containers at variable rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inline Inspection",
          description:
            "Inline inspection verifies fill levels, cap integrity, label placement, and date codes in real time — every container graded and logged.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Diversion",
          color: REJECT_COLOR,
          description:
            "Non-conforming containers diverted for product recovery — minimizing waste.",
        },
        {
          label: "EvacuPak",
          icon: "◉",
          productSlug: "evacupak",
          subtitle: "Product Recovery",
          description:
            "Recovers up to 97% of product from rejected containers — 3A certified, never exposed to atmosphere.",
        },
        {
          label: "Robotics",
          icon: "⬡",
          productSlug: "robotics",
          subtitle: "Palletizing",
          description:
            "Palletizing systems stack verified cases with full traceability from product to load.",
        },
      ],
    },
    {
      id: "multi-lane-qc",
      name: "Multi-Lane Flow Wrap QC",
      description:
        "Multiple production lanes are individually inspected for product integrity and defects — VeriPak provides per-lane quality data before merging into a single output stream.",
      stages: [
        {
          label: "Multi-Lane",
          icon: "☰",
          subtitle: "Parallel Infeed",
          description:
            "Multiple parallel lanes deliver product at varying rates.",
        },
        {
          label: "Gapping",
          icon: "↔",
          subtitle: "Inspection Clearance",
          color: GAPPING_COLOR,
          description:
            "Spaces products apart on each lane for accurate per-product inspection.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Per-Lane QC",
          description:
            "Each lane is inspected independently for product integrity, label accuracy, and defects before merging.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Per-Lane Removal",
          color: REJECT_COLOR,
          description:
            "Non-conforming product diverted per-lane while still separated — no disruption to merged output.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Merge & Gapping",
          description:
            "Merges only verified product into a single stream with tight pitch control for wrapper registration.",
        },
        {
          label: "Flow Wrapper",
          icon: "◫",
          subtitle: "HFFS / VFFS",
          description:
            "Receives a clean, perfectly spaced single-file stream — every product has passed inspection.",
        },
      ],
    },
  ],

  /* ────────────────────────────────────────────────
     EvacuPak — product recovery from rejects
     ──────────────────────────────────────────────── */
  evacupak: [
    {
      id: "dairy-recovery",
      name: "Dairy Product Recovery",
      description:
        "Rejected containers are diverted to EvacuPak for hygienic product recovery — up to 97% of product is recovered and returned to the process, minimizing waste and maximizing yield.",
      stages: [
        {
          label: "Filler",
          icon: "⚙",
          subtitle: "Liquid Fill",
          description:
            "Fill equipment discharges liquid containers at variable rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inline Inspection",
          description:
            "Inline inspection identifies containers with fill, seal, or label defects.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Diversion",
          color: REJECT_COLOR,
          description:
            "Non-conforming containers diverted to the recovery station.",
        },
        {
          label: "EvacuPak",
          icon: "◉",
          productSlug: "evacupak",
          subtitle: "Product Recovery",
          description:
            "Hygienic lances recover up to 97% of product from rejected containers — 3A certified, closed-system processing, never exposed to atmosphere.",
        },
        {
          label: "Reprocessing",
          icon: "⟳",
          subtitle: "Return to Process",
          description:
            "Recovered product is returned to the process stream — maximizing yield and minimizing waste.",
        },
      ],
    },
    {
      id: "liquid-line",
      name: "Liquid Line with Palletizing",
      description:
        "End-to-end liquid processing with inspection, recovery, and automated palletizing — every rejected container's product is recovered before disposal.",
      stages: [
        {
          label: "Filler",
          icon: "⚙",
          subtitle: "Liquid Fill",
          description:
            "Filling equipment discharges containers onto the line at variable rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inline Inspection",
          description:
            "Verifies fill levels, cap integrity, and label placement in real time.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Diversion",
          color: REJECT_COLOR,
          description:
            "Defective containers diverted to EvacuPak for product recovery.",
        },
        {
          label: "EvacuPak",
          icon: "◉",
          productSlug: "evacupak",
          subtitle: "Product Recovery",
          description:
            "Recovers valuable product from rejected containers before disposal — 3A certified, closed-system processing.",
        },
        {
          label: "Robotics",
          icon: "⬡",
          productSlug: "robotics",
          subtitle: "Palletizing",
          description:
            "Verified cases are stacked and palletized with full traceability from product to load.",
        },
      ],
    },
  ],

  /* ────────────────────────────────────────────────
     Leak Detection — seal integrity testing
     ──────────────────────────────────────────────── */
  "leak-detection": [
    {
      id: "thermo-seal-test",
      name: "Post-Seal Integrity Testing",
      description:
        "After thermoforming and vision inspection, every package undergoes physical seal testing — catching pinholes and micro-leaks that cameras cannot see.",
      stages: [
        {
          label: "Thermoformer",
          icon: "⚙",
          subtitle: "Form & Seal",
          description:
            "Discharges vacuum-sealed packages at consistent cycle rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Vision Inspection",
          description:
            "Vision inspection catches visual seal defects and label errors — the first quality gate.",
        },
        {
          label: "Leak Detection",
          icon: "⊙",
          productSlug: "leak-detection",
          subtitle: "Seal Integrity",
          description:
            "Dual-pull suction testing detects pinholes and seal failures that vision systems physically cannot see — the critical final quality gate.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Failed packages diverted before case packing — every downstream case is complete and verified.",
        },
        {
          label: "Case Packer",
          icon: "⬡",
          subtitle: "Pack & Ship",
          description:
            "Receives fully inspected, seal-verified packages ready for packing.",
        },
      ],
    },
    {
      id: "map-validation",
      name: "MAP Package Validation",
      description:
        "Modified atmosphere packages require physical seal testing to ensure gas retention — leak detection validates that every package maintains its protective atmosphere.",
      stages: [
        {
          label: "MAP Sealer",
          icon: "⚙",
          subtitle: "Gas Flush & Seal",
          description:
            "Modified atmosphere packaging equipment seals packages with controlled gas composition for shelf life extension.",
        },
        {
          label: "Leak Detection",
          icon: "⊙",
          productSlug: "leak-detection",
          subtitle: "Seal Integrity",
          description:
            "Validates seal integrity to ensure MAP gas retention — protecting shelf life and food safety.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Compromised Seals",
          color: REJECT_COLOR,
          description:
            "Packages with compromised seals diverted before downstream processing — protecting brand and consumer safety.",
        },
        {
          label: "Conveyors",
          icon: "═",
          productSlug: "conveyors",
          subtitle: "Sanitary Transport",
          description:
            "Sanitary transport moves verified packages to palletizing.",
        },
        {
          label: "Palletizing",
          icon: "⬡",
          subtitle: "Stack & Ship",
          description:
            "Verified packages stacked and palletized for distribution.",
        },
      ],
    },
  ],

  /* ────────────────────────────────────────────────
     Robotics — case packing & palletizing
     ──────────────────────────────────────────────── */
  robotics: [
    {
      id: "end-of-line",
      name: "End-of-Line Palletizing",
      description:
        "After inspection and batching, washdown-rated robotics handle case packing and palletizing with full traceability from product to pallet.",
      stages: [
        {
          label: "Thermoformer",
          icon: "⚙",
          subtitle: "Upstream",
          description:
            "Upstream packaging equipment discharges product at machine cycle rates.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inspection",
          description:
            "Every package inspected and logged before downstream batching.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Defective packages removed individually so every batch is complete.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Batching",
          description:
            "Batches and stages verified product into precise groupings for robotic handling.",
        },
        {
          label: "Robotics",
          icon: "⬡",
          productSlug: "robotics",
          subtitle: "Case Pack & Palletize",
          description:
            "Washdown-rated robotic case packing and palletizing with full VeriPak traceability from product to pallet.",
        },
      ],
    },
    {
      id: "case-packing",
      name: "Case Packing Line",
      description:
        "Sanitary conveyors feed IntelliPak-batched product to robotic case packing — the robot builds precise pallet patterns with real-time monitoring.",
      stages: [
        {
          label: "Conveyors",
          icon: "═",
          productSlug: "conveyors",
          subtitle: "Sanitary Transport",
          description:
            "Sanitary transport moves product from upstream processing.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Accumulation",
          description:
            "Accumulates and stages cases for robotic pickup patterns.",
        },
        {
          label: "Robotics",
          icon: "⬡",
          productSlug: "robotics",
          subtitle: "Case Pack & Palletize",
          description:
            "KUKA washdown-rated robots build precise pallet patterns with full traceability and real-time monitoring.",
        },
        {
          label: "Stretch Wrapper",
          icon: "⚙",
          subtitle: "Ship Ready",
          description:
            "Finished pallets wrapped and prepared for shipping.",
        },
      ],
    },
  ],

  /* ────────────────────────────────────────────────
     Conveyors — sanitary transport & gapping
     ──────────────────────────────────────────────── */
  conveyors: [
    {
      id: "sanitary-transport",
      name: "Sanitary Transport Line",
      description:
        "IP69K washdown-rated conveyors move product between processing stations with quick-change belting, tool-free maintenance, and food-grade construction throughout.",
      stages: [
        {
          label: "Filler",
          icon: "⚙",
          subtitle: "Upstream Equipment",
          description:
            "Upstream fill equipment discharges containers at variable rates.",
        },
        {
          label: "Conveyors",
          icon: "═",
          productSlug: "conveyors",
          subtitle: "Sanitary Transport",
          description:
            "Food-grade sanitary conveyors with IP69K washdown construction, quick-change belting, and tool-free maintenance for maximum uptime.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inline Inspection",
          description:
            "Inline inspection verifies product quality before downstream processing.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Non-conforming product diverted before downstream processing.",
        },
        {
          label: "Packaging",
          icon: "⚙",
          subtitle: "Downstream",
          description:
            "Verified product continues to packaging equipment.",
        },
      ],
    },
    {
      id: "gapping-spacing",
      name: "Gapping & Spacing Line",
      description:
        "Conveyors create consistent product spacing for accurate inspection — ensuring VeriPak cameras have the clearance needed for per-product quality checks.",
      stages: [
        {
          label: "Upstream",
          icon: "⚙",
          subtitle: "Variable Output",
          description:
            "Production equipment discharges product at variable rates requiring spacing.",
        },
        {
          label: "Conveyors",
          icon: "═",
          productSlug: "conveyors",
          subtitle: "Gapping & Spacing",
          description:
            "Gapping conveyors create consistent product spacing for accurate downstream inspection — IP69K washdown rated with tool-free belt changes.",
        },
        {
          label: "VeriPak",
          icon: "◈",
          productSlug: "veripak",
          subtitle: "Inspection",
          description:
            "Properly spaced product enables accurate per-product inspection.",
        },
        {
          label: "Reject",
          icon: "⊘",
          subtitle: "Defect Removal",
          color: REJECT_COLOR,
          description:
            "Defective product removed while still separated.",
        },
        {
          label: "IntelliPak",
          icon: "▦",
          productSlug: "intellipak",
          subtitle: "Merge & Timing",
          description:
            "Merges and times verified product for wrapper registration.",
        },
        {
          label: "Flow Wrapper",
          icon: "◫",
          subtitle: "HFFS / VFFS",
          description:
            "Receives a perfectly spaced, fully inspected product stream.",
        },
      ],
    },
  ],
};

/* ================================================
   Connecting Arrow SVG
   ================================================ */

function ConnectingArrow({
  tick,
  color,
}: {
  tick: number;
  color: string;
}) {
  const dotProgress = (tick % 60) / 60;
  const dotX = 4 + dotProgress * 32;

  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 self-center"
      aria-hidden="true"
    >
      <line
        x1="4"
        y1="12"
        x2="32"
        y2="12"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <polygon points="32,8 38,12 32,16" fill="rgba(255,255,255,0.25)" />
      <circle cx={dotX} cy="12" r="2.5" fill={color} opacity="0.9">
        <animate
          attributeName="opacity"
          values="0.9;0.4;0.9"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/* ================================================
   Stage Card
   ================================================ */

function StageCard({
  stage,
  isCurrentProduct,
  isActive,
  accentColor,
  onClick,
}: {
  stage: Stage;
  isCurrentProduct: boolean;
  isActive: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  const isAQS = !!stage.productSlug;
  const stageColor = stage.color ?? (isAQS ? accentColor : NEUTRAL_COLOR);

  const borderColor = isCurrentProduct
    ? accentColor
    : isActive
      ? stageColor
      : "rgba(0,0,0,0.25)";

  const card = (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="relative flex flex-col items-center text-center w-[96px] shrink-0 cursor-pointer group"
    >
      {/* YOU ARE HERE badge */}
      {isCurrentProduct && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.58rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}55`,
          }}
        >
          You Are Here
        </div>
      )}

      {/* Card body */}
      <div
        className="w-full rounded-xl p-3 transition-all duration-300 bg-black/30 group-hover:bg-black/50"
        style={{
          border: `1.5px solid ${borderColor}`,
          boxShadow: isCurrentProduct
            ? `0 0 20px ${accentColor}20, inset 0 0 20px ${accentColor}08`
            : isActive
              ? `0 0 12px ${stageColor}15`
              : "none",
        }}
      >
        {/* Icon */}
        <div
          className="text-2xl mb-1.5 leading-none"
          style={{ color: stageColor }}
        >
          {stage.icon}
        </div>

        {/* Label */}
        <div
          className="font-sans text-[0.72rem] font-semibold leading-tight mb-0.5"
          style={{ color: isAQS || stage.color ? "#fff" : "rgba(255,255,255,0.6)" }}
        >
          {stage.label}
        </div>

        {/* Subtitle */}
        <div className="font-mono text-[0.54rem] tracking-[0.08em] uppercase text-text-dim leading-tight">
          {stage.subtitle}
        </div>
      </div>
    </div>
  );

  // Wrap AQS product stages in Link — but not the currentProduct
  if (isAQS && !isCurrentProduct && stage.productSlug) {
    return (
      <Link
        href={SLUG_TO_ROUTE[stage.productSlug]}
        className="no-underline"
        onClick={(e) => e.stopPropagation()}
      >
        {card}
      </Link>
    );
  }

  return card;
}

/* ================================================
   Main Component
   ================================================ */

export function SystemArchitecture({
  currentProduct,
}: {
  currentProduct: ProductSlug;
}) {
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  const currentAccent = ACCENT_COLORS[currentProduct] ?? "#f5a623";
  const configs = PRODUCT_CONFIGS[currentProduct] ?? [];
  const activeConfig = configs[activeConfigIndex];

  // Animated pulsing dot tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 600);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Reset active stage when switching configs
  const handleConfigChange = useCallback((index: number) => {
    setActiveConfigIndex(index);
    setActiveStageIndex(null);
  }, []);

  const getStageColor = useCallback(
    (stage: Stage): string => {
      if (stage.color) return stage.color;
      if (stage.productSlug) {
        return ACCENT_COLORS[stage.productSlug];
      }
      return NEUTRAL_COLOR;
    },
    [],
  );

  if (!activeConfig) return null;

  return (
    <section className="py-[72px] px-8 relative">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          {/* Section header */}
          <div className="mb-10">
            <div
              className="font-mono text-[0.68rem] tracking-[0.15em] uppercase mb-3"
              style={{ color: currentAccent }}
            >
              System Architecture
            </div>
            <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 leading-[1.1]">
              Where It Fits in the Line
            </h2>
            <p className="font-sans text-[1.02rem] text-text-body max-w-[640px] leading-[1.7]">
              See how this solution integrates into common production line
              configurations. Click any AQS product to learn more.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {configs.map((config, idx) => {
              const isActive = idx === activeConfigIndex;
              return (
                <button
                  key={config.id}
                  onClick={() => handleConfigChange(idx)}
                  className="rounded-lg px-4 py-2 text-[0.78rem] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isActive
                      ? `${currentAccent}18`
                      : "transparent",
                    border: `1px solid ${isActive ? currentAccent : "rgba(0,0,0,0.25)"}`,
                    color: isActive ? currentAccent : "rgba(255,255,255,0.55)",
                  }}
                >
                  {config.name}
                </button>
              );
            })}
          </div>

          {/* Config description */}
          <p className="text-text-body text-[0.88rem] leading-[1.65] mb-8 max-w-[720px]">
            {activeConfig.description}
          </p>

          {/* Production line flow — centered */}
          <div className="bg-black/30 border border-[rgba(0,0,0,0.25)] rounded-xl p-6 md:p-8 overflow-x-auto">
            <div className="flex items-start justify-center gap-0 min-w-max pt-8 pb-4 px-2">
              {activeConfig.stages.map((stage, idx) => {
                const isCurrentStage = stage.productSlug === currentProduct;
                const isActiveStage = activeStageIndex === idx;
                const stageColor = getStageColor(stage);

                return (
                  <div
                    key={`${activeConfig.id}-${idx}`}
                    className="flex items-center"
                  >
                    <StageCard
                      stage={stage}
                      isCurrentProduct={isCurrentStage}
                      isActive={isActiveStage}
                      accentColor={isCurrentStage ? currentAccent : stageColor}
                      onClick={() =>
                        setActiveStageIndex(
                          activeStageIndex === idx ? null : idx,
                        )
                      }
                    />
                    {idx < activeConfig.stages.length - 1 && (
                      <ConnectingArrow tick={tick} color={stageColor} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Flow direction label */}
            <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
              <div className="h-px w-12 bg-white/20" />
              <span className="font-mono text-[0.58rem] tracking-[0.15em] uppercase text-white/30">
                Product Flow Direction
              </span>
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                <path
                  d="M0 4H14M14 4L10 0.5M14 4L10 7.5"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Active stage detail popover */}
          <AnimatePresence mode="wait">
            {activeStageIndex !== null && (
              <motion.div
                key={`detail-${activeConfigIndex}-${activeStageIndex}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 rounded-lg p-4 bg-black/50"
                style={{
                  border: `1px solid ${getStageColor(activeConfig.stages[activeStageIndex])}55`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-xl shrink-0 mt-0.5"
                    style={{
                      color: getStageColor(
                        activeConfig.stages[activeStageIndex],
                      ),
                    }}
                  >
                    {activeConfig.stages[activeStageIndex].icon}
                  </span>
                  <div>
                    <div className="font-sans text-[0.88rem] font-semibold text-white mb-1">
                      {activeConfig.stages[activeStageIndex].label}
                      <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase ml-2 text-text-dim">
                        {activeConfig.stages[activeStageIndex].subtitle}
                      </span>
                    </div>
                    <p className="text-text-body text-[0.84rem] leading-[1.65] m-0">
                      {activeConfig.stages[activeStageIndex].description}
                    </p>
                    {activeConfig.stages[activeStageIndex].productSlug &&
                      activeConfig.stages[activeStageIndex].productSlug !==
                        currentProduct && (
                        <Link
                          href={
                            SLUG_TO_ROUTE[
                              activeConfig.stages[activeStageIndex]
                                .productSlug!
                            ]
                          }
                          className="inline-flex items-center gap-1 mt-2 font-mono text-[0.68rem] tracking-[0.1em] uppercase no-underline transition-opacity hover:opacity-80"
                          style={{
                            color: getStageColor(
                              activeConfig.stages[activeStageIndex],
                            ),
                          }}
                        >
                          Learn more
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M4.5 2.5L8 6L4.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>
      </div>
    </section>
  );
}
