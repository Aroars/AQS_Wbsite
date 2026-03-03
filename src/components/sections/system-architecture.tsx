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
  conveyors: "#66b3ff",
  intellipak: "#f5a623",
};

const NEUTRAL_COLOR = "#8892B0";

const SLUG_TO_ROUTE: Record<ProductSlug, string> = {
  veripak: "/solutions/veripak",
  evacupak: "/solutions/evacupak",
  "leak-detection": "/solutions/leak-detection",
  robotics: "/solutions/robotics",
  conveyors: "/solutions/conveyors",
  intellipak: "/solutions/intellipak",
};

const LINE_CONFIGS: LineConfig[] = [
  {
    id: "protein",
    name: "Protein / Thermoform Line",
    description:
      "Thermoformed packages are inspected, seal-tested, batched by IntelliPak, and robotically case-packed \u2014 every unit verified before it leaves the line.",
    stages: [
      {
        label: "Thermoformer",
        icon: "\u2699",
        subtitle: "Form & Seal",
        description:
          "Thermoformer discharges vacuum-sealed packages at consistent machine cycle rates.",
      },
      {
        label: "Conveyors",
        icon: "\u2550",
        productSlug: "conveyors",
        subtitle: "Sanitary Transport",
        description:
          "Sanitary transport conveyors move product between stations with washdown-rated construction and quick-change belting.",
      },
      {
        label: "VeriPak",
        icon: "\u25C8",
        productSlug: "veripak",
        subtitle: "SCADA Inspection",
        description:
          "Real-time SCADA inspection catches seal defects, label errors, and weight variance \u2014 every package imaged and logged.",
      },
      {
        label: "Leak Detection",
        icon: "\u2298",
        productSlug: "leak-detection",
        subtitle: "Seal Integrity",
        description:
          "Dual-pull suction testing detects pinholes and seal failures that vision systems physically cannot see.",
      },
      {
        label: "IntelliPak",
        icon: "\u25A6",
        productSlug: "intellipak",
        subtitle: "Batch & Stage",
        description:
          "Mag-Drive belts batch and stage verified product into precise groupings at up to 500 PPM for the case packer.",
      },
      {
        label: "Robotics",
        icon: "\u2B21",
        productSlug: "robotics",
        subtitle: "Case Pack & Palletize",
        description:
          "Washdown-rated robotic case packing and palletizing with full traceability from product to pallet.",
      },
    ],
  },
  {
    id: "dairy",
    name: "Dairy / Liquid Processing",
    description:
      "Filled containers are inspected, product is recovered from rejects via EvacuPak, and verified units are staged and palletized \u2014 maximizing yield and minimizing waste.",
    stages: [
      {
        label: "Filler",
        icon: "\u2699",
        subtitle: "Liquid Fill",
        description:
          "Filling equipment discharges liquid product containers onto the line at variable rates.",
      },
      {
        label: "Conveyors",
        icon: "\u2550",
        productSlug: "conveyors",
        subtitle: "Washdown Transport",
        description:
          "Food-grade conveyor transport between processing stations with full washdown capability.",
      },
      {
        label: "VeriPak",
        icon: "\u25C8",
        productSlug: "veripak",
        subtitle: "Inline Inspection",
        description:
          "Inline inspection verifies fill levels, cap integrity, label placement, and date codes in real time.",
      },
      {
        label: "EvacuPak",
        icon: "\u25C9",
        productSlug: "evacupak",
        subtitle: "Product Recovery",
        description:
          "Hygienic lances recover up to 97% of product from rejected containers \u2014 never exposed to atmosphere, 3A certified.",
      },
      {
        label: "IntelliPak",
        icon: "\u25A6",
        productSlug: "intellipak",
        subtitle: "Accumulation",
        description:
          "Precision staging and accumulation of verified containers for downstream packaging equipment.",
      },
      {
        label: "Robotics",
        icon: "\u2B21",
        productSlug: "robotics",
        subtitle: "Palletizing",
        description:
          "Sanitary palletizing systems stack cases with full VeriPak traceability from product to load.",
      },
    ],
  },
  {
    id: "bakery",
    name: "Bakery / Snack Line",
    description:
      "Product from the oven is gapped for inspection, quality-checked, seal-tested, and flow-wrapped \u2014 with IntelliPak controlling pitch and timing for wrapper registration.",
    stages: [
      {
        label: "Oven",
        icon: "\u2699",
        subtitle: "Continuous Output",
        description:
          "Continuous oven output delivers product at variable rates requiring singulation and spacing.",
      },
      {
        label: "Conveyors",
        icon: "\u2550",
        productSlug: "conveyors",
        subtitle: "Gapping & Spacing",
        description:
          "Gapping conveyors create consistent spacing between products for accurate downstream inspection.",
      },
      {
        label: "IntelliPak",
        icon: "\u25A6",
        productSlug: "intellipak",
        subtitle: "Pitch Control",
        description:
          "Mag-Drive infeed creates tight pitch control and timing for wrapper registration \u2014 no servo motors needed.",
      },
      {
        label: "VeriPak",
        icon: "\u25C8",
        productSlug: "veripak",
        subtitle: "Quality Check",
        description:
          "Quality inspection verifies product integrity, dimensions, and foreign material before wrapping.",
      },
      {
        label: "Leak Detection",
        icon: "\u2298",
        productSlug: "leak-detection",
        subtitle: "Seal Testing",
        description:
          "Post-wrap seal integrity testing ensures every package is properly sealed before shipping.",
      },
      {
        label: "Flow Wrapper",
        icon: "\u2699",
        subtitle: "HFFS / VFFS",
        description:
          "HFFS or VFFS flow wrapper receives perfectly spaced, fully inspected product stream.",
      },
    ],
  },
];

/* ================================================
   Connecting Arrow SVG
   ================================================ */

function ConnectingArrow({ tick }: { tick: number }) {
  // Dot travels from left to right over 3 ticks then resets
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
      {/* Dashed line */}
      <line
        x1="4"
        y1="12"
        x2="32"
        y2="12"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {/* Arrowhead */}
      <polygon
        points="32,8 38,12 32,16"
        fill="rgba(255,255,255,0.25)"
      />
      {/* Animated pulsing dot */}
      <circle cx={dotX} cy="12" r="2.5" fill="#f5a623" opacity="0.9">
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
  const borderColor = isCurrentProduct
    ? accentColor
    : isActive
      ? accentColor
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
              ? `0 0 12px ${accentColor}15`
              : "none",
        }}
      >
        {/* Icon */}
        <div
          className="text-2xl mb-1.5 leading-none"
          style={{ color: isAQS ? accentColor : NEUTRAL_COLOR }}
        >
          {stage.icon}
        </div>

        {/* Label */}
        <div
          className="font-sans text-[0.72rem] font-semibold leading-tight mb-0.5"
          style={{ color: isAQS ? "#fff" : "rgba(255,255,255,0.6)" }}
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
  const activeConfig = LINE_CONFIGS[activeConfigIndex];

  // Auto-select the config that contains the current product on mount
  useEffect(() => {
    const idx = LINE_CONFIGS.findIndex((config) =>
      config.stages.some((s) => s.productSlug === currentProduct)
    );
    if (idx !== -1) {
      setActiveConfigIndex(idx);
    }
  }, [currentProduct]);

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
      if (stage.productSlug) {
        return ACCENT_COLORS[stage.productSlug];
      }
      return NEUTRAL_COLOR;
    },
    []
  );

  return (
    <section className="py-[72px] px-8 relative">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          {/* Section header */}
          <div className="mb-10">
            <div className="font-mono text-[0.68rem] tracking-[0.15em] uppercase mb-3" style={{ color: currentAccent }}>
              System Architecture
            </div>
            <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 leading-[1.1]">
              Where It Fits in the Line
            </h2>
            <p className="font-sans text-[1.02rem] text-text-body max-w-[640px] leading-[1.7]">
              See how this solution integrates into common production line configurations.
              Click any AQS product to learn more.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {LINE_CONFIGS.map((config, idx) => {
              const isActive = idx === activeConfigIndex;
              return (
                <button
                  key={config.id}
                  onClick={() => handleConfigChange(idx)}
                  className="rounded-lg px-4 py-2 text-[0.78rem] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(245,166,35,0.13)"
                      : "transparent",
                    border: `1px solid ${
                      isActive ? "#f5a623" : "rgba(0,0,0,0.25)"
                    }`,
                    color: isActive ? "#f5a623" : "rgba(255,255,255,0.55)",
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

          {/* Production line flow */}
          <div className="bg-black/30 border border-[rgba(0,0,0,0.25)] rounded-xl p-6 md:p-8 overflow-x-auto">
            <div className="flex items-start gap-0 min-w-max pt-8 pb-4 px-2">
              {activeConfig.stages.map((stage, idx) => {
                const isCurrentStage = stage.productSlug === currentProduct;
                const isActiveStage = activeStageIndex === idx;
                const stageColor = getStageColor(stage);

                return (
                  <div key={`${activeConfig.id}-${idx}`} className="flex items-center">
                    <StageCard
                      stage={stage}
                      isCurrentProduct={isCurrentStage}
                      isActive={isActiveStage}
                      accentColor={isCurrentStage ? currentAccent : stageColor}
                      onClick={() =>
                        setActiveStageIndex(
                          activeStageIndex === idx ? null : idx
                        )
                      }
                    />
                    {idx < activeConfig.stages.length - 1 && (
                      <ConnectingArrow tick={tick} />
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
                <path d="M0 4H14M14 4L10 0.5M14 4L10 7.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
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
                  border: `1px solid ${getStageColor(
                    activeConfig.stages[activeStageIndex]
                  )}55`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-xl shrink-0 mt-0.5"
                    style={{
                      color: getStageColor(
                        activeConfig.stages[activeStageIndex]
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
                              activeConfig.stages[activeStageIndex]
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
