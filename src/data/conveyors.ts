// All conveyor data — categories, types, differentiators, construction, FAQs

export const CONVEYOR_ACCENT = "#94A3B8";

/* ================================================
   Category Definitions
   ================================================ */

export interface ConveyorType {
  title: string;
  shortTitle: string;
  slug: string;
  useCase: string;
  description: string;
  features: string[];
  idealFor: string[];
  image?: { src: string; alt: string };
}

export interface ConveyorCategory {
  slug: string;
  /** Short name for the family switcher (Belt / MDR / Pallet) */
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage?: { src: string; alt: string };
  /** Which drive technologies apply (titles from driveTechnologies) */
  driveTitles: string[];
  types: ConveyorType[];
}

/* Three families, nine system types. Family copy below the type level is
   AQS marketing copy — review before publishing changes. */

export const categories: ConveyorCategory[] = [
  {
    slug: "belt",
    shortTitle: "Belt",
    title: "Sanitary Belt Conveyors",
    subtitle: "Flat-Top, Modular, Incline & Freezer",
    description:
      "Food grade belt conveyors for washdown environments — from point-A-to-point-B transport to freezer-rated arctic systems and steep elevation changes. The widest range of sanitary applications, on TIG-welded stainless frames with FDA belting.",
    heroImage: { src: "/images/conveyors/dairy-line-full.jpg", alt: "Modular belt conveyor system handling clamshell packaging in a sanitary production environment" },
    driveTitles: ["One Motion™ Mag-Drive", "Standard Gear Motor Drives"],
    types: [
      {
        title: "Flat-Top Belt Conveyors",
        shortTitle: "Flat-Top Belt",
        slug: "flat-top-belt",
        useCase: "General-purpose sanitary product transport between process stages.",
        description:
          "Smooth, continuous belt surface for stable product handling. FDA-approved belting materials from Intralox, Habasit, or equivalent. Available in straight, curved, and incline/decline configurations with adjustable speed via VFD or Mag-Drive.",
        features: [
          "Smooth, continuous belt surface",
          "FDA-approved belting materials",
          "Straight, curved, and incline configurations",
          "Adjustable speed via VFD or Mag-Drive",
        ],
        idealFor: ["Packaged products", "Trays & cartons", "Pouches", "Bottles"],
        image: { src: "/images/conveyors/flat-top-belt-sanitary.jpg", alt: "Sanitary flat-top belt conveyor with FDA-approved blue urethane belting and TIG-welded stainless steel frame" },
      },
      {
        title: "Modular Belt Conveyors",
        shortTitle: "Modular Belt",
        slug: "modular-belt",
        useCase: "Applications requiring belt flexibility, drainage, or product grip.",
        description:
          "Modular plastic belt with interchangeable configurations — flat, raised rib, friction top, perforated. Self-tracking belt designs reduce maintenance. Side-flexing modules available for curved layouts without transfer points.",
        features: [
          "Interchangeable belt configurations",
          "Self-tracking belt designs",
          "Side-flexing modules for curved paths",
          "Drainage-capable perforated options",
        ],
        idealFor: ["Wet environments", "Products requiring drainage", "Curved conveyor paths"],
        image: { src: "/images/conveyors/modular-belt-sanitary.jpg", alt: "Sanitary modular belt conveyor showing interlocking plastic belt modules on stainless steel frame" },
      },
      {
        title: "Incline & Decline Conveyors",
        shortTitle: "Incline & Decline",
        slug: "incline-decline",
        useCase: "Elevation changes between production levels, mezzanines, or process stages.",
        description:
          "Cleated belt options for positive product control on steep angles. Nosebar transitions for smooth product hand-off at top and bottom. Available in straight incline, Z-frame, and custom angle configurations.",
        features: [
          "Cleated belt for steep angles",
          "Nosebar transitions for smooth hand-off",
          "Z-frame and custom angle configurations",
          "Side rails and product guides",
        ],
        idealFor: ["Mezzanine feeds", "Gravity-to-powered transitions", "Overhead packing areas"],
        image: { src: "/images/conveyors/incline-conveyor.jpg", alt: "Stainless steel incline conveyor with cleated belt for positive product control at elevation changes" },
      },
      {
        title: "Freezer / Arctic Conveyors",
        shortTitle: "Freezer / Arctic",
        slug: "freezer-arctic",
        useCase: "Product transport in sub-zero environments — blast freezers, cold storage, frozen product handling.",
        description:
          "Materials and components rated for sustained sub-zero operation down to -40°F / -40°C. Low-temperature lubricants and seals, condensation management at freezer-to-ambient transitions, and insulated frame options to reduce ice buildup.",
        features: [
          "Rated for -40°F / -40°C operation",
          "Low-temperature lubricants and seals",
          "Condensation management at transitions",
          "Insulated frame options",
        ],
        idealFor: ["Ice cream", "Frozen protein", "Frozen bakery", "Cold storage facilities"],
      },
    ],
  },
  {
    slug: "mdr",
    shortTitle: "MDR",
    title: "MDR Conveyors — 24V Motorized Roller",
    subtitle: "Zone Control, Zero-Pressure Accumulation & Merge/Divert",
    description:
      "Washdown-rated motorized drive roller conveyors for cases, trays, and totes. Each zone runs its own 24V roller, so product queues without contact, only active zones draw power, and traffic control lives in the conveyor instead of a PLC rack — from zero-pressure accumulation to multi-line merging and SKU-based sorting.",
    heroImage: { src: "/images/conveyors/mdr-tilt-gates.jpg", alt: "Motorized drive roll conveyor with tilt-up gate mechanism for zone-controlled product accumulation" },
    driveTitles: ["Motorized Drive Rolls (MDR)", "Standard Gear Motor Drives"],
    types: [
      {
        title: "24V Motorized Drive Roller (MDR) Zones",
        shortTitle: "MDR Zones",
        slug: "mdr-zones",
        useCase: "Case and pallet handling with zone-based accumulation.",
        description:
          "Each zone powered by an independent motorized roller. Zero-pressure accumulation ensures products queue without contact or back-pressure. Zone-to-zone communication enables intelligent traffic control with energy-efficient operation — only active zones draw power.",
        features: [
          "Independent motorized roller per zone",
          "Zero-pressure accumulation",
          "Zone-to-zone communication",
          "Energy efficient — only active zones draw power",
          "Washdown-rated MDR options (PulseRoller)",
        ],
        idealFor: ["Case packing areas", "Palletizing infeed", "Warehouse-to-production transitions"],
        image: { src: "/images/conveyors/mdr-tilt-gates.jpg", alt: "Motorized drive roll conveyor with tilt-up gate mechanism for zone-controlled product accumulation" },
      },
      {
        title: "Accumulation Conveyors",
        shortTitle: "Accumulation",
        slug: "accumulation",
        useCase: "Buffering between process stages to absorb speed differences and downstream stoppages.",
        description:
          "Zero-pressure accumulation protects product from damage. Configurable buffer capacity measured in minutes of production. Photo-eye or sensor-based zone control. Available in belt, MDR, or roller configurations.",
        features: [
          "Zero-pressure accumulation",
          "Configurable buffer capacity",
          "Photo-eye or sensor-based zone control",
          "Belt, MDR, or roller configurations",
        ],
        idealFor: [
          "Speed mismatch buffering",
          "Planned stoppages",
          "Shift changes",
          "Downstream recovery time",
        ],
      },
      {
        title: "Merge & Divert Systems",
        shortTitle: "Merge & Divert",
        slug: "merge-divert",
        useCase: "Combining multiple lines into one, or splitting one line to multiple destinations.",
        description:
          "Pneumatic or servo-driven divert mechanisms with photo-eye tracking for accurate product routing. Configurable merge angles and speeds, compatible with barcode and vision-based routing decisions.",
        features: [
          "Pneumatic or servo-driven divert",
          "Photo-eye tracking for routing",
          "Configurable merge angles and speeds",
          "Barcode/vision-based routing compatible",
        ],
        idealFor: [
          "Multi-line to single case packer",
          "SKU-based sorting",
          "Multi-destination routing",
        ],
      },
    ],
  },
  {
    slug: "pallet",
    shortTitle: "Pallet",
    title: "Pallet Conveyors",
    subtitle: "Washdown Pallet Handling & Heavy-Duty Chain",
    description:
      "Stainless pallet conveyors for end-of-line food and dairy lines — roller and chain-driven pallet conveyance, zero-pressure pallet accumulation, automated dispensing, and stretch-wrapper, strapper, and robotic palletizer integration, built for the heaviest loads on the line in full washdown environments.",
    heroImage: { src: "/images/conveyors/accumulation-production.jpg", alt: "Carton accumulation conveyors in dairy production environment" },
    driveTitles: ["Standard Gear Motor Drives", "Motorized Drive Rolls (MDR)"],
    types: [
      {
        title: "Washdown Pallet Conveyors",
        shortTitle: "Washdown Pallet",
        slug: "washdown-pallet",
        useCase: "End-of-line pallet handling in full washdown environments.",
        description:
          "Stainless steel roller or chain-driven pallet conveyance with IP65 through IP69K washdown ratings. Zero-pressure pallet accumulation, automated pallet dispensing, and integration with stretch wrappers, strappers, and labelers.",
        features: [
          "IP65 through IP69K washdown ratings",
          "Zero-pressure pallet accumulation",
          "Automated pallet dispensing",
          "Stretch wrapper and strapper integration",
          "KUKA robotic palletizing compatible",
        ],
        idealFor: [
          "Dairy end-of-line",
          "Protein processing",
          "Full-line washdown facilities",
        ],
      },
      {
        title: "Chain Conveyors",
        shortTitle: "Chain",
        slug: "chain",
        useCase: "Heavy-load and pallet transport in sanitary environments.",
        description:
          "Stainless steel chain on stainless steel frame with high load capacity for full pallets, heavy cases, or bulk containers. Available in single-strand, dual-strand, and multi-strand configurations. Compatible with pallet dispensers, stretch wrappers, and strapping systems.",
        features: [
          "Stainless steel chain and frame",
          "High load capacity",
          "Single, dual, and multi-strand options",
          "Compatible with pallet dispensers and wrappers",
        ],
        idealFor: ["Pallet handling", "End-of-line transport", "Heavy product staging"],
      },
    ],
  },
];

/* ================================================
   Differentiators
   ================================================ */

export interface Differentiator {
  title: string;
  description: string;
  icon: string;
}

export const differentiators: Differentiator[] = [
  {
    title: "Continuous TIG-Welded Frames",
    description:
      "Every frame joint is welded — not bolted. Bolted joints create crevices that trap bacteria and resist cleaning. Welded joints eliminate the problem entirely.",
    icon: "⊕",
  },
  {
    title: "Mirror-Polished Stainless",
    description:
      "Not just stainless — mirror finish. Polished surfaces are faster to clean, easier to inspect, and leave nowhere for contaminants to hide.",
    icon: "◇",
  },
  {
    title: "Sloped Drainage Design",
    description:
      "Water shedding geometry is built into every frame. Aggressive drainage angles reduce sanitation time by up to 50%.",
    icon: "▽",
  },
  {
    title: "Tool-Less Disassembly",
    description:
      "Quick-release belt lifters, snap-in guide rails, and removable components. Sanitation crews clean faster. Maintenance turns around faster.",
    icon: "⊞",
  },
  {
    title: "Engineered-to-Order",
    description:
      "Every system is designed around your specific product, line layout, and sanitary requirements. You get exactly what your line needs.",
    icon: "⬡",
  },
  {
    title: "Full Ecosystem Integration",
    description:
      "Designed to plug into VeriPak SCADA, IntelliPak feed systems, and AQS robotic palletizing cells. One controls platform, one support relationship.",
    icon: "◈",
  },
];

/* ================================================
   Construction Standards
   ================================================ */

export const constructionStats = [
  { value: "304/316", label: "Stainless Steel" },
  { value: "IP69K", label: "Washdown Capable" },
  { value: "50%", label: "Faster Sanitation" },
  { value: "3-A", label: "Sanitary Compliant" },
];

export const protectionRatings = [
  { rating: "IP54", description: "Dust-protected, splash-resistant", application: "Dry environments, light wipe-down" },
  { rating: "IP65", description: "Dust-tight, low-pressure water jets", application: "General food processing" },
  { rating: "IP66", description: "Dust-tight, high-pressure water jets", application: "Meat, poultry, dairy" },
  { rating: "IP67", description: "Dust-tight, temporary immersion", application: "High-moisture environments" },
  { rating: "IP69K", description: "Dust-tight, high-pressure/high-temp", application: "Full CIP/COP sanitary" },
];

/* ================================================
   Drive Technologies
   ================================================ */

export interface DriveTech {
  title: string;
  description: string;
  bestFor: string;
  highlights: string[];
}

export const driveTechnologies: DriveTech[] = [
  {
    title: "One Motion™ Mag-Drive",
    description:
      "Magnetic direct-drive hub motor — magnets push against magnets, no gears, no oil. IP69K washdown safe with 55% energy savings and a 3-year warranty.",
    bestFor: "High-speed precision, IntelliPak-style gapping, oil-free sanitary environments",
    highlights: ["Up to 500 PPM", "55% energy savings", "IP69K safe", "3-year warranty"],
  },
  {
    title: "Standard Gear Motor Drives",
    description:
      "Stainless steel washdown-rated gear motors with proven reliability for constant-speed transport. VFD-compatible for adjustable speed control.",
    bestFor: "Straight-line transport, incline/decline, case handling, pallet conveyance",
    highlights: ["Proven reliability", "VFD-compatible", "Lower upfront cost"],
  },
  {
    title: "Motorized Drive Rolls (MDR)",
    description:
      "Independent zone control with zero-pressure accumulation built into the drive architecture. Energy efficient 24VDC operation.",
    bestFor: "Case accumulation, zone-based traffic control, warehouse transitions",
    highlights: ["Independent zone control", "24VDC operation", "Energy efficient"],
  },
];

/* ================================================
   Hub Stats
   ================================================ */

export const hubStats = [
  { value: "50+", label: "Years Experience" },
  { value: "3", label: "Families · 9 Types" },
  { value: "IP69K", label: "Capable" },
  { value: "USDA", label: "Compliant" },
];

/* ================================================
   Case Studies
   ================================================ */

export interface ConveyorProject {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: { src: string; alt: string };
}

export const conveyorProjects: ConveyorProject[] = [
  {
    title: "Freezer Conveyors",
    subtitle: "Marshmallow Production — Utah",
    description:
      "State-of-the-art sanitary conveyor systems for transporting hot extruded marshmallow through a freezer tunnel. Full washdown construction rated for extreme temperature cycling.",
    tags: ["Freezer Rated", "Sanitary", "Temp Cycling"],
    image: { src: "/images/conveyors/elevated-conveyor.jpg", alt: "Elevated freezer conveyor system installed at a marshmallow production facility" },
  },
  {
    title: "EQ70 Accumulation Conveyor",
    subtitle: "Major Dairy Facility — Philadelphia",
    description:
      "Advanced EQ70 accumulation conveyor installed at a major dairy production facility. Designed for active product accumulation with enhanced operational efficiency and stringent sanitation standards.",
    tags: ["Active Accumulation", "Dairy Grade", "High Sanitation"],
    image: { src: "/images/conveyors/eq70-line.jpg", alt: "EQ70 accumulation conveyor system at a major dairy facility" },
  },
];

export const galleryImages = [
  { src: "/images/conveyors/flat-top-belt-sanitary.jpg", alt: "Sanitary flat-top belt conveyor with FDA-approved blue urethane belting and TIG-welded stainless steel frame" },
  { src: "/images/conveyors/modular-belt-sanitary.jpg", alt: "Sanitary modular belt conveyor showing interlocking plastic belt modules on stainless steel frame" },
  { src: "/images/conveyors/incline-conveyor.jpg", alt: "Stainless steel incline conveyor with cleated belt for positive product control at elevation changes" },
  { src: "/images/conveyors/mdr-tilt-gates.jpg", alt: "Motorized drive roll conveyor with tilt-up gate mechanism for zone-controlled product accumulation" },
  { src: "/images/conveyors/accumulation-production.jpg", alt: "Carton accumulation conveyors in dairy production environment" },
  { src: "/images/conveyors/sanitary-motor-detail.jpg", alt: "Close-up of sanitary conveyor motor and drive assembly with stainless steel construction" },
];

/* ================================================
   FAQ Items
   ================================================ */

export interface FAQItem {
  q: string;
  a: string;
}

export const conveyorFAQs: FAQItem[] = [
  {
    q: "What types of conveyors does AQS build?",
    a: "Three families: sanitary belt conveyors (flat-top, modular, incline/decline, freezer-rated arctic), MDR conveyors (24V motorized roller zones, zero-pressure accumulation, merge/divert), and pallet conveyors (washdown pallet handling and heavy-duty chain). Every type is available in sanitary construction rated from IP54 through IP69K.",
  },
  {
    q: "Are AQS conveyors catalog systems or custom-engineered?",
    a: "Custom-engineered. Every AQS conveyor is designed around your specific product, line layout, and sanitary requirements. We don't sell catalog conveyors — we engineer solutions.",
  },
  {
    q: "What's the difference between AQS Custom Conveyors and IntelliPak?",
    a: "IntelliPak is AQS's branded intelligent feed system — a Mag-Drive-powered platform for high-speed gapping, collation, merging, and timing ahead of packaging machines. Custom Conveyors cover all other conveyance needs: transport, accumulation, incline/decline, case handling, pallet handling, and more. Many lines use both.",
  },
  {
    q: "What materials do you use?",
    a: "304 or 316 stainless steel frames with mirror polish, FDA-approved belting, and USDA/3-A compliant components throughout. 316 stainless is available for caustic or high-chloride environments.",
  },
  {
    q: "Can AQS conveyors operate in freezer environments?",
    a: "Yes. AQS builds arctic-rated conveyors with components and materials rated for sustained sub-zero operation down to -40°F. This includes low-temperature lubricants, freeze-rated seals, and condensation management at freezer-to-ambient transition points.",
  },
  {
    q: "Do AQS conveyors integrate with VeriPak?",
    a: "Yes. When paired with an Allen-Bradley controls package, AQS conveyors can report status, throughput, and fault data to VeriPak SCADA for centralized monitoring and logging.",
  },
  {
    q: "Why does continuous TIG welding matter?",
    a: "Bolted joints create crevices — tiny gaps between frame members where water, product residue, and bacteria collect. These crevices resist standard washdown and can harbor contamination between sanitation cycles. Continuous TIG welding eliminates every joint crevice, creating a smooth, cleanable surface that auditors and sanitation crews can trust.",
  },
  {
    q: "How fast can AQS deliver?",
    a: "Delivery timelines depend on system complexity, but AQS maintains supply chain relationships and fabrication capacity designed for rapid turnaround. Contact us for a project-specific timeline.",
  },
];

/* ================================================
   Industries
   ================================================ */

export const conveyorIndustries = [
  { name: "Dairy & Ice Cream", applications: "Thermoformer discharge, tray handling, arctic/freezer conveyors, pallet conveyance in washdown environments" },
  { name: "Protein & Meat", applications: "Wet-environment transport, incline/decline between processing levels, case accumulation, full-washdown end-of-line" },
  { name: "Bakery & Snacks", applications: "Multi-line merging, flow wrapper infeed, gentle handling for fragile products, case conveying" },
  { name: "Beverages", applications: "Bottle/can transport, accumulation for fillers, case packing infeed, pallet conveyance" },
  { name: "Fresh Produce", applications: "Wet/perforated belt conveyors for drainage, gentle handling, MAP tray transport" },
  { name: "Nutraceuticals / Pharma", applications: "Cleanroom-compatible conveyance, serialization-ready transport, traceability integration" },
];
