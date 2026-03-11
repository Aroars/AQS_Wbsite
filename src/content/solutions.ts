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
      "Audit-ready QC recordkeeping",
      "Allen-Bradley CompactLogix + Optix",
    ],
    description:
      "VeriPak is a standalone SCADA system purpose-built for packaging quality control. It delivers real-time visibility, immediate operator feedback, and automated intervention the moment something goes wrong.",
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
      "Ships with Allen-Bradley controls onboard",
      "IP69K sanitary construction",
      "Sensor-driven dynamic belt velocity",
    ],
    description:
      "Precision product handling for sanitary packaging lines. Mag-Drive powered conveyors that gap, merge, collate, and time your products with servo-like accuracy — no gears, no oil, no guesswork.",
  },
  {
    slug: "conveyors",
    route: "/solutions/conveyors",
    icon: "═",
    title: "Custom Conveyors",
    subtitle: "Sanitary Material Handling",
    accent: "#94A3B8",
    shortFeatures: [
      "Freezer, accumulation, & custom configs",
      "Food-grade belt & chain options",
      "Continuous TIG-welded frames — zero harborage",
      "Quick-disconnect modular design",
      "50+ years engineering expertise",
    ],
    description:
      "Custom-engineered food-grade conveyor systems including freezer conveyors, accumulation systems, and modular belt configurations for washdown environments.",
  },
  {
    slug: "robotics",
    route: "/solutions/robotics",
    icon: "⬡",
    title: "Sanitary Robotics",
    subtitle: "Washdown Robotic Systems",
    accent: "#4d9fff",
    shortFeatures: [
      "KUKA & Stäubli platforms — true washdown rated",
      "Palletizing, case packing, pick-and-place",
      "316L stainless steel construction",
      "Rockwell-native programming",
      "Full end-of-line integration",
    ],
    description:
      "Fully sanitary robotic systems for palletizing, case packing, pick-and-place, and end-of-line automation — engineered for USDA and FDA washdown environments.",
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
];

export const partners: { name: string; logo?: string; width: number; height: number }[] = [
  { name: "Allen-Bradley", logo: "/images/logos/partners/allen-bradley.png", width: 400, height: 94 },
  { name: "Stäubli", logo: "/images/logos/partners/staubli.png", width: 300, height: 81 },
  { name: "Keyence", logo: "/images/logos/partners/keyence.png", width: 400, height: 70 },
  { name: "OneMotion", logo: "/images/logos/partners/onemotion.png", width: 300, height: 58 },
  { name: "Intralox", logo: "/images/logos/partners/intralox.png", width: 310, height: 131 },
  { name: "Festo", logo: "/images/logos/partners/festo.png", width: 519, height: 97 },
  { name: "NGI", logo: "/images/logos/partners/ngi.png", width: 300, height: 95 },
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
      "The VeriPak inspection system is exactly what we needed to assure we never had another costly recall from lids not matching cartons again!",
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
    icon: "◈",
    title: "Every Package Has an Identity",
    desc: "VeriPak SCADA assigns a verifiable record to each individual package — weight, metal detection, vision image, leak test, operator, timestamp. Not batch summaries. Not shift averages. Every single package.",
    link: { label: "Learn about VeriPak →", href: "/solutions/veripak" },
  },
  {
    icon: "✓",
    title: "Your Next Audit Is Already Done",
    desc: "When an auditor asks you to prove compliance for Tuesday's second shift, VeriPak gives you one screen, one query, one report. No binder scrambles. No USB drives. No reconstructing from memory.",
    link: { label: "See how it works →", href: "/solutions/veripak" },
  },
  {
    icon: "◆",
    title: "Engineered for the Harshest Environments",
    desc: "Every AQS system — conveyors, controls, enclosures — is designed for sanitary, washdown, and cold environments. NEMA 4X stainless steel, IP69K rated, TIG-welded construction. Because your packaging line doesn't stop for cleaning.",
    link: { label: "Explore solutions →", href: "/solutions" },
  },
  {
    icon: "⬡",
    title: "Allen-Bradley Native. Vendor-Agnostic Integration.",
    desc: "VeriPak runs on Allen-Bradley CompactLogix + Optix — the same platform most plants already standardize on. It connects to any QC device with Ethernet/IP or Modbus-TCP, regardless of manufacturer.",
    link: { label: "See the architecture →", href: "/solutions/veripak/specifications" },
  },
];

export const heroStats = [
  { value: 100, suffix: "%", label: "Package Inspection" },
  { value: 60, suffix: "+", label: "Devices Connected" },
  { value: 50, suffix: "+", label: "Years Combined Exp." },
  { value: 0, suffix: "", label: "Costly Recalls" },
];
