// Content data extracted from prototype — single source for all solution references across the site

export const solutions = [
  {
    slug: "veripak",
    route: "/solutions/veripak",
    icon: "◈",
    title: "VeriPak SCADA",
    subtitle: "Standalone SCADA Platform",
    accent: "#00c2ff",
    shortFeatures: [
      "Real-time dashboards & live alerts",
      "Standalone SCADA — no middleware",
      "Immediate operator feedback loop",
      "Auto-reject & line stop triggers",
      "Allen-Bradley CompactLogix + Optix",
    ],
    description:
      "VeriPak is a standalone SCADA system purpose-built for packaging quality control. It delivers real-time visibility, immediate operator feedback, and automated intervention the moment something goes wrong.",
  },
  {
    slug: "evacupak",
    route: "/solutions/evacupak",
    icon: "◉",
    title: "EvacuPak",
    subtitle: "Liquid Recovery System",
    accent: "#00d4aa",
    shortFeatures: [
      "Up to 97% product recovery",
      "3A certified, CIP capable",
      "Patented hygienic lance design",
      "Full HACCP traceability",
      "Never exposed to atmosphere",
    ],
    description:
      "Our patented design achieves up to 97% product recovery from packaging. Hygienic lances extract product directly into 3A process piping — never exposed to atmosphere, never compromised.",
  },
  {
    slug: "leak-detection",
    route: "/solutions/leak-detection",
    icon: "⊘",
    title: "Leak Detection",
    subtitle: "Dual-Pull Suction System",
    accent: "#ff6666",
    badge: "R&D — Patent Pending",
    shortFeatures: [
      "Detects pinholes vision can't see",
      "Mechanical force & deflection delta",
      "Self-referencing dual-pull method",
      "Binary pass/fail — no ML tuning",
      "VeriPak SCADA integration",
    ],
    description:
      "Vision can't detect what physics can measure. Our dual-pull differential suction system detects actual atmosphere ingress through any breach — regardless of visual appearance.",
  },
  {
    slug: "robotics",
    route: "/solutions/robotics",
    icon: "⬡",
    title: "Sanitary Robotics",
    subtitle: "Washdown Robotic Systems",
    accent: "#4d9fff",
    shortFeatures: [
      "USDA / FDA washdown rated",
      "Palletizing, case packing, pick-and-place",
      "316L stainless steel construction",
      "Rockwell-native programming",
      "Full end-of-line integration",
    ],
    description:
      "Fully sanitary robotic systems for palletizing, case packing, pick-and-place, and end-of-line automation — engineered for USDA and FDA washdown environments.",
  },
  {
    slug: "conveyors",
    route: "/solutions/conveyors",
    icon: "═",
    title: "Conveyors",
    subtitle: "Sanitary Material Handling",
    accent: "#94A3B8",
    shortFeatures: [
      "Freezer, accumulation, & custom configs",
      "Food-grade belt & chain options",
      "Washdown-rated construction",
      "Quick-disconnect modular design",
      "50+ years engineering expertise",
    ],
    description:
      "Custom-engineered food-grade conveyor systems including freezer conveyors, accumulation systems, and modular belt configurations for washdown environments.",
  },
  {
    slug: "intellipak",
    route: "/solutions/intellipak",
    icon: "▦",
    title: "IntelliPak Feed Systems",
    subtitle: "Smart Infeed & Product Handling",
    accent: "#f5a623",
    shortFeatures: [
      "Mag-Drive precision up to 500 PPM",
      "Multi-lane collation & merging",
      "Zero-pressure gentle accumulation",
      "IP69K sanitary construction",
      "Allen-Bradley + VeriPak SCADA ready",
    ],
    description:
      "Precision product handling for sanitary packaging lines. Mag-Drive powered conveyors that gap, merge, collate, and time your products with servo-like accuracy — no gears, no oil, no guesswork.",
  },
];

export const partners: { name: string; logo?: string; width: number; height: number }[] = [
  { name: "Keyence", logo: "/images/logos/partners/keyence.png", width: 400, height: 70 },
  { name: "OneMotion", logo: "/images/logos/partners/onemotion.png", width: 300, height: 58 },
  { name: "Intralox", logo: "/images/logos/partners/intralox.png", width: 310, height: 131 },
  { name: "Festo", logo: "/images/logos/partners/festo.png", width: 519, height: 97 },
  { name: "NGI", logo: "/images/logos/partners/ngi.png", width: 300, height: 158 },
];

export const industries = [
  { icon: "🥩", name: "Protein & Meat" },
  { icon: "🧀", name: "Dairy & Ice Cream" },
  { icon: "🍞", name: "Bakery & Snacks" },
  { icon: "🥤", name: "Beverages" },
  { icon: "🫛", name: "Fresh Produce" },
  { icon: "💊", name: "Nutraceuticals" },
];

export const testimonials = [
  {
    quote:
      "The AQS inspection system is exactly what we needed to assure we never had another costly recall from lids not matching cartons again!",
    name: "Tim",
    title: "Ice Cream Production Manager",
  },
  {
    quote:
      "The VeriPak system is well thought out and well executed. No longer worrying about quality issues on our lidding system will really improve peace of mind. The team was great to work with.",
    name: "Chad",
    title: "Production Manager",
  },
  {
    quote:
      "Liquid recovery is a game-changing innovation that lowers costs and increases system efficiencies dramatically. All leading to the increase in profit margins.",
    name: "Greg",
    title: "Chief Financial Officer",
  },
];

export const whyAQS = [
  {
    icon: "🛡",
    title: "Avoid Costly Recalls",
    desc: "Ensure traceability — protect your brand with 100% package inspection and audit-ready records.",
  },
  {
    icon: "📊",
    title: "Elevate Product Quality",
    desc: "Guarantee consistency — automate and record QC data across every line, shift, and SKU.",
  },
  {
    icon: "💰",
    title: "Maximize Profitability",
    desc: "Decrease risk — cut costs and recover up to 97% of fluid product from packaging waste.",
  },
  {
    icon: "♻️",
    title: "Improve Sustainability",
    desc: "Waste less — maximize yields while improving safety. EvacuPak turns waste into recovered product.",
  },
];

export const heroStats = [
  { value: 100, suffix: "%", label: "Package Inspection" },
  { value: 97, suffix: "%", label: "Liquid Recovery Rate" },
  { value: 50, suffix: "+", label: "Years Combined Exp." },
  { value: 0, suffix: "", label: "Costly Recalls" },
];
