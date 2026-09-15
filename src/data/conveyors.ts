// All conveyor data — categories, types, differentiators, construction, FAQs

export const CONVEYOR_ACCENT = "#94A3B8";

/* ================================================
   Shared shapes
   ================================================ */

/**
 * Sentinel for copy AQS has not supplied yet (a belt width, a publish date).
 * Anything carrying this value is hidden by the components, never rendered
 * blank — so a page can ship with the rows it can stand behind.
 */
export const TODO = "__TODO__";
export const isFilled = (v: string | null | undefined): v is string =>
  typeof v === "string" && v !== TODO && v.trim().length > 0;

export interface SpecRow {
  label: string;
  value: string;
  note?: string;
}

export interface ImageRef {
  src: string;
  alt: string;
  caption?: string;
  /** Renders get a light tile and object-contain; photos fill their frame */
  kind?: "photo" | "render";
  /** Tall photos get a 3:4 frame instead of 4:3 so they are not cropped to a strip */
  orientation?: "portrait";
}

/** A short muted loop (mp4, no audio) with its poster frame */
export interface VideoRef {
  src: string;
  poster: string;
  /** What the clip shows, for assistive tech */
  alt: string;
  caption?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

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
  image?: ImageRef;
}

export interface ConveyorCategory {
  slug: string;
  /** Short name for the family switcher (Belt / MDR / Pallet) */
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage?: ImageRef;
  /** Which drive technologies apply (titles from driveTechnologies) */
  driveTitles: string[];
  /** Family-page questions (rendered and emitted as FAQPage schema) */
  faq?: FAQItem[];
  /** A short loop shown under the type cards */
  video?: VideoRef;
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
    video: {
      src: "/video/auto-adjusting-rails-loop.mp4",
      poster: "/images/conveyors/auto-adjusting-rails-loop-poster.jpg",
      alt: "Sanitary modular belt conveyor with automatically adjusting guide rails closing in on a bottle",
      caption: "Auto-adjusting guide rails on a sanitary modular belt line — one recipe change resets the rails for the next container.",
    },
    faq: [
      {
        q: "Which belt should I use for wet product?",
        a: "Modular belt with perforated or raised-rib modules drains and grips; flat-top urethane belt is easier to wipe down and inspect. Both use FDA-approved belting from Intralox, Habasit, or equivalent — the choice comes down to drainage, product grip, and whether the path has to curve.",
      },
      {
        q: "Can a belt conveyor turn a corner without a transfer?",
        a: "Yes. Side-flexing modular belt and radius flat belts carry product through 45°, 90°, 180°, and S-curve turns on one continuous belt, so there is no dead plate or gap for product to catch on. The inside radius is set by the belt's collapse factor.",
      },
      {
        q: "How steep can an incline conveyor run?",
        a: "Without cleats the limit is the product's friction on the belt. Cleated or sidewall belts carry product up much steeper angles, and Z-frame designs keep the infeed and discharge horizontal. The incline calculator in the toolbox works the geometry for a given rise and floor space.",
      },
    ],
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
        title: "Radius, S-Curve & 180° Belt Conveyors",
        shortTitle: "Radius & S-Curve",
        slug: "radius",
        useCase: "Direction changes without transfers — 45°, 90°, 180°, and S-curve paths.",
        description:
          "Side-flexing modular belt (Intralox or Habasit) or a radius flat belt on a TIG-welded stainless frame carries product around the corner on one continuous belt — no dead plates, no transfer gaps, no product tumble. The inside radius is set by the belt's collapse factor.",
        features: [
          "45°, 90°, 180°, and S-curve layouts",
          "One belt through the turn — no transfer points",
          "Side-flexing FDA-approved belting",
          "Curved UHMW wearstrips and sanitary guide rails",
        ],
        idealFor: ["Tight footprints", "Line reversals", "Wrapping around equipment"],
        image: { src: "/images/conveyors/curved-conveyor.jpg", alt: "Curved modular belt conveyor on a stainless steel frame rounding a turn in a food plant" },
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
        image: { src: "/images/conveyors/freezer-conveyor-marshmallow.jpg", alt: "Frosted blue cleated modular belt at the discharge of a freezer conveyor inside a marshmallow production freezer" },
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
    video: {
      src: "/video/mdr-180-curve-loop.mp4",
      poster: "/images/conveyors/mdr-180-curve-loop-poster.jpg",
      alt: "A case riding a stainless 24V MDR conveyor through a 180° curve",
      caption: "Stainless 24V MDR through a 180° curve — each zone runs only while product is on it.",
    },
    faq: [
      {
        q: "What is a 24V MDR conveyor?",
        a: "A motorized roller conveyor in which each zone is driven by its own low-voltage roller with a local drive card. Zones talk to their neighbours, so product accumulates without contact and only occupied zones run. The traffic logic lives in the conveyor; the PLC handles the line.",
      },
      {
        q: "Is MDR conveyor washdown-rated?",
        a: "Yes. AQS builds MDR on stainless frames with washdown-rated PulseRoller options, IP67 drive cards, and sealed quick-disconnects, with frames engineered to IP69K where the room demands it.",
      },
      {
        q: "Can an MDR conveyor carry pallets?",
        a: "Yes. Heavier hub-motor rollers move loaded pallets; AQS has built 24V pallet loops carrying 1,800 lb loads with one drive card per zone and zero-pressure accumulation between the forklift drop and the fill station.",
      },
    ],
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
        image: { src: "/images/conveyors/accumulation-production.jpg", alt: "Carton accumulation conveyors in a dairy production environment" },
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
        image: { src: "/images/conveyors/dairy-facility.jpg", alt: "Multi-lane sanitary modular belt conveyors with stainless guide rails merging product in a dairy plant" },
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
    heroImage: { src: "/images/conveyors/mdr-pallet-loop-full-system.jpg", alt: "Stainless 24V MDR pallet conveyor loop with tapered-roller curves, a loaded pallet, and a stainless HMI pedestal in the AQS shop" },
    driveTitles: ["Standard Gear Motor Drives", "Motorized Drive Rolls (MDR)"],
    video: {
      src: "/video/mdr-pallet-loop-wrapped-pallet.mp4",
      poster: "/images/conveyors/mdr-pallet-loop-wrapped-pallet-poster.jpg",
      alt: "A stretch-wrapped pallet moving around a stainless 24V MDR pallet conveyor loop",
      caption: "A wrapped pallet indexing through the tapered-roller curve on a stainless 24V MDR pallet loop.",
    },
    faq: [
      {
        q: "Chain or roller for a washdown pallet line?",
        a: "Chain conveyors take the heaviest loads and tolerate rough pallets; stainless roller and 24V MDR pallet conveyors add zone control and zero-pressure accumulation. Many end-of-line layouts use chain at the palletizer and MDR or roller through accumulation and wrapping.",
      },
      {
        q: "What protection rating do pallet conveyors carry?",
        a: "IP65 through IP69K depending on the room, with stainless frames, sealed drives, and NEMA 4X enclosures. Freezer-rated builds cover cold-storage staging.",
      },
      {
        q: "Do pallet conveyors integrate with palletizers and wrappers?",
        a: "Yes — KUKA robotic palletizing cells, stretch wrappers, strappers, labelers, and pallet dispensers, on Allen-Bradley controls with VeriPak reporting when the line needs it.",
      },
    ],
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
        image: { src: "/images/conveyors/mdr-pallet-curve-loaded.jpg", alt: "Loaded pallet riding the white tapered rollers of a stainless 24V MDR pallet conveyor curve" },
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
  { value: "3-A", label: "Designed to Sanitary Standards" },
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

/** The four construction claims on the hub strip — every one is true of what AQS builds today */
export const hubClaims = [
  { value: "IP69K", label: "Washdown-rated construction" },
  { value: "−40 °F", label: "Freezer-rated systems" },
  { value: "24V", label: "MDR zone drives" },
  { value: "TIG", label: "Continuous-welded frames" },
];

/* ================================================
   Case Studies
   ================================================ */

/** A full project page. Present on a project = it has its own route under /solutions/conveyors/projects/ */
export interface ConveyorSpotlight {
  h1: string;
  /** <title> (≤ 60 chars) and meta description (≤ 155) */
  title: string;
  description: string;
  /** Long approved title, used for Open Graph when it differs from `title` */
  ogTitle?: string;
  industry: string;
  region: string;
  /** ISO dates; TODO until AQS supplies them (Article schema omits them) */
  datePublished: string;
  dateModified?: string;
  hero: ImageRef;
  atAGlance: SpecRow[];
  sections: { id: string; heading: string; paragraphs: string[] }[];
  result: { body: string; numbers: { value: string; label: string }[] };
  gallery: ImageRef[];
  faq: FAQItem[];
  related: { label: string; href: string }[];
  /** Schema `about` entities */
  about?: string[];
}

export interface ConveyorProject {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: ImageRef;
  spotlight?: ConveyorSpotlight;
}

export const spotlightHref = (p: ConveyorProject) => `/solutions/conveyors/projects/${p.slug}`;
export const spotlightProjects = () => conveyorProjects.filter((p) => p.spotlight);
export const getSpotlight = (slug: string) => conveyorProjects.find((p) => p.slug === slug && p.spotlight);

const toteFillingRender: ImageRef = {
  src: "/images/conveyors/renders/24v-mdr-pallet-conveyor-tapered-curve-stainless.png",
  alt: "Engineering render of a stainless 24V MDR pallet conveyor loop with two tapered-roller 90° curves and a stainless control enclosure",
  caption: "Seven-zone 24V MDR pallet loop with dual-direction radius sections, control enclosure, and bollards.",
  kind: "render",
};

export const conveyorProjects: ConveyorProject[] = [
  {
    slug: "stainless-24v-pallet-tote-filling-system",
    title: "Automated Pallet Tote Filling Line",
    subtitle: "Frozen Vegetable Processor — Upper Midwest",
    description:
      "A seven-zone stainless 24V MDR pallet loop with live in-zone weighing and vibratory densification, running hands-off in a 0–20 °F freezer area from forklift drop to forklift pickup.",
    tags: ["24V MDR", "Pallet Handling", "Freezer 0–20 °F", "Live Weighing"],
    image: toteFillingRender,
    spotlight: {
      h1: "Automated Pallet Tote Filling Line — Stainless 24V MDR Conveyor with Live Weighing and Vibratory Densification",
      title: "24V MDR Pallet Tote Filling Line with Live Weighing | AQS",
      ogTitle: "Stainless 24V MDR Pallet Conveyor with Integrated Scale & Densification — Freezer Tote Filling Line | AQS",
      description:
        "Seven-zone stainless 24V MDR pallet loop with in-zone scale and vibratory densification fills 1,800 lb totes to 1% in a 0–20 °F freezer area — an AQS conveyor project spotlight.",
      industry: "Frozen vegetable processing",
      region: "Upper Midwest",
      datePublished: TODO,
      hero: toteFillingRender,
      atAGlance: [
        { label: "Customer", value: "Frozen vegetable processor, Upper Midwest" },
        { label: "Application", value: "Filling lined bulk totes on pallets with diced raw and frozen vegetables to a target weight" },
        { label: "Conveyor", value: "7-zone 24V MDR pallet circuit, U-shaped, two 90° dual-direction radius sections" },
        { label: "Capacity", value: "Up to 10 totes/hr · 1,800 lb max fill · 7 pallets in zero-pressure accumulation" },
        { label: "Weighing", value: "Live in-zone scale, 1% accuracy to 2,500 lb" },
        { label: "Environment", value: "Indoor freezer area, 0–20 °F · 304 stainless frames and NEMA 4X panels · IP65+ components" },
        { label: "Controls", value: "Allen-Bradley CompactLogix, touchscreen HMI, 100-recipe SKU library, VPN remote support" },
        { label: "Footprint", value: "About 23 ft × 19 ft" },
      ],
      sections: [
        {
          id: "the-problem",
          heading: "The problem",
          paragraphs: [
            "The plant filled bulk totes under an existing auger by hand: a forklift set a pallet, an operator watched a scale, and product had to be shaken down to fill the tote fully. Throughput depended on the operator, weights drifted, and the whole process lives in a room near 0 °F.",
          ],
        },
        {
          id: "what-we-built",
          heading: "What we built",
          paragraphs: [
            "A seven-zone 24V motorized-roller pallet loop in T304 stainless. Forklifts load empty pallets on the infeed leg and pull full ones from the discharge leg; everything between is automatic. Three staging zones index pallets forward, a scale conveyor at the fill station stops the pallet on four weigh modules, and three discharge zones accumulate finished pallets without contact.",
            "Two swept-radius corner conveyors with tapered idlers carry pallets around the 90° bends with no pneumatics, and accept pallets fed either 40\" or 48\" side leading.",
          ],
        },
        {
          id: "the-control-story",
          heading: "The control story",
          paragraphs: [
            "The PLC tares the empty tote, closes a dry contact to call the plant's existing auger filler, and watches live weight during the fill. At recipe-set intervals a densification deck under the fill zone lifts the pallet off the rollers on air bags and runs two electric rotary vibrators to settle the product, then filling resumes. Near target the auger is stopped, weight stabilizes, and the final weight is recorded before release.",
            "Settling frequency, duration, and intensity are per-SKU recipe values the operator tunes at the HMI — dozens of SKUs loaded at commissioning. Every zone runs on its own IP67 drive card, so accumulation logic lives in the conveyor and the PLC handles the fill.",
          ],
        },
        {
          id: "built-for-the-cold",
          heading: "Built for the cold",
          paragraphs: [
            "Freezer-rated motors, instrumentation, and photo eyes; zinc-coated rollers to hold off surface rust; stainless slope-top NEMA 4X enclosures with panel climate control; leveling feet with ±4\" adjustment on a floor that isn't flat.",
          ],
        },
      ],
      result: {
        body: "Hands-off filling from forklift drop to forklift pickup. Target weight held within 1% on every tote. Up to seven pallets buffered so the auger never waits on a forklift.",
        numbers: [
          { value: "1%", label: "of target weight, held on every tote" },
          { value: "7", label: "pallets buffered in zero-pressure accumulation" },
        ],
      },
      gallery: [toteFillingRender],
      faq: [
        { q: "Can a 24V MDR conveyor carry pallets?", a: "Yes. This system moves 1,800 lb loaded pallets on 2.5\" hub-motor rollers with one drive card per zone." },
        { q: "Can you weigh a pallet on a conveyor during filling?", a: "Yes. The fill zone rides on weigh modules and reads live to 1% of 2,500 lb, so the PLC can stop the filler at target and record the final weight before release." },
        { q: "Does MDR work in a freezer?", a: "This line runs at 0–20 °F with freezer-rated rollers, drive cards, and sensors, and climate-controlled NEMA 4X enclosures." },
        { q: "Do pallets have to enter a specific way?", a: "No. The dual-direction radius sections accept pallets fed either 40\" or 48\" side leading." },
      ],
      related: [
        { label: "24V MDR Zone Conveyors", href: "/solutions/conveyors/mdr/zones" },
        { label: "Pallet Conveyors", href: "/solutions/conveyors/pallet" },
        { label: "Zero-Pressure Accumulation", href: "/solutions/conveyors/mdr#accumulation" },
        { label: "Freezer & Arctic Conveyors", href: "/solutions/conveyors/belt#freezer-arctic" },
        { label: "MDR Roller Selection Chart", href: "/toolbox/mdr-motorized-roller-selection" },
        { label: "VeriPak SCADA", href: "/solutions/veripak" },
      ],
      about: ["24V MDR conveyor", "Pallet conveyor", "Zero-pressure accumulation", "Freezer conveyor", "Tote filling"],
    },
  },
  {
    slug: "freezer-conveyor-marshmallow-line",
    title: "Freezer Conveyors",
    subtitle: "Marshmallow Production — Utah",
    description:
      "State-of-the-art sanitary conveyor systems for transporting hot extruded marshmallow through a freezer tunnel. Full washdown construction rated for extreme temperature cycling.",
    tags: ["Freezer Rated", "Sanitary", "Temp Cycling"],
    image: { src: "/images/conveyors/freezer-conveyor-marshmallow.jpg", alt: "Frosted blue cleated modular belt at the discharge of a freezer conveyor inside a marshmallow production freezer" },
  },
  {
    slug: "eq70-accumulation-dairy-line",
    title: "EQ70 Accumulation Conveyor",
    subtitle: "Major Dairy Facility — Philadelphia",
    description:
      "Advanced EQ70 accumulation conveyor installed at a major dairy production facility. Designed for active product accumulation with enhanced operational efficiency and stringent sanitation standards.",
    tags: ["Active Accumulation", "Dairy Grade", "High Sanitation"],
    image: { src: "/images/conveyors/eq70-accumulation-dairy.jpg", alt: "EQ70 accumulation conveyor with blue modular belt and stainless guide rails on a washdown dairy production floor" },
  },
];

export const galleryImages: ImageRef[] = [
  { src: "/images/conveyors/flat-top-belt-sanitary.jpg", alt: "Sanitary flat-top belt conveyor with FDA-approved blue urethane belting and TIG-welded stainless steel frame" },
  { src: "/images/conveyors/modular-belt-sanitary.jpg", alt: "Sanitary modular belt conveyor showing interlocking plastic belt modules on stainless steel frame" },
  { src: "/images/conveyors/incline-conveyor.jpg", alt: "Stainless steel incline conveyor with cleated belt for positive product control at elevation changes" },
  { src: "/images/conveyors/mdr-tilt-gates.jpg", alt: "Motorized drive roll conveyor with tilt-up gate mechanism for zone-controlled product accumulation" },
  { src: "/images/conveyors/accumulation-production.jpg", alt: "Carton accumulation conveyors in dairy production environment" },
  { src: "/images/conveyors/sanitary-motor-detail.jpg", alt: "Close-up of sanitary conveyor motor and drive assembly with stainless steel construction" },
  { src: "/images/conveyors/modular-belt-conveyor-shop.jpg", alt: "Blue modular belt conveyor on a TIG-welded stainless frame ready to ship from the AQS shop" },
  { src: "/images/conveyors/mdr-tapered-curve-rollers.jpg", alt: "White tapered rollers of a stainless 24V MDR conveyor curve" },
  { src: "/images/conveyors/mdr-pallet-section-outdoor.jpg", alt: "Stainless 24V MDR pallet conveyor section with leveling feet and a drive card cable" },
];

/* ================================================
   Family comparison (hub strip)
   ================================================ */

export interface FamilyCompareRow {
  family: "belt" | "mdr" | "pallet";
  moves: string;
  drive: string;
  load: string;
  environments: string;
  controls: string;
}

export const familyCompare: FamilyCompareRow[] = [
  {
    family: "belt",
    moves: "Trays, pouches, cartons, bottles, loose bulk product",
    drive: "Gear motor + VFD or One Motion Mag-Drive; one drive per conveyor",
    load: "Light to medium — product on a continuous belt",
    environments: "Dry, washdown to IP69K, freezer to −40 °F",
    controls: "VFD speed; Allen-Bradley on request",
  },
  {
    family: "mdr",
    moves: "Cases, trays, totes, and pallets on rollers",
    drive: "24V motorized roller and drive card in every zone",
    load: "Medium to heavy — cases through loaded pallets",
    environments: "Dry, washdown (PulseRoller, IP67 cards), freezer-rated",
    controls: "Zone logic in the conveyor; PLC says go / stop",
  },
  {
    family: "pallet",
    moves: "Full pallets, bulk containers, heavy cases",
    drive: "Stainless chain or 24V MDR pallet rollers",
    load: "Heaviest on the line — 1,800 lb loaded pallets and up",
    environments: "Washdown IP65 to IP69K, freezer-rated",
    controls: "Allen-Bradley with wrapper, strapper, and palletizer handshakes",
  },
];

/** Construction detail shown beside the construction standards on the hub */
export const weldDetailImage: ImageRef = {
  src: "/images/conveyors/weld-polish-detail.jpg",
  alt: "Close-up of a continuous TIG-welded and polished stainless steel conveyor frame joint with blue modular belt",
  caption: "Continuous TIG weld, ground and polished — no crevice for water or product to sit in.",
};

/* ================================================
   FAQ Items
   ================================================ */

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
    a: "304 or 316 stainless steel frames with mirror polish, FDA-approved belting, USDA-accepted designs, and components designed to 3-A Sanitary Standards throughout. 316 stainless is available for caustic or high-chloride environments.",
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
