export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  content: string;
  /** Toolbox slugs worth linking from this post ("Size it yourself" callout) */
  tools?: string[];
  /** ISO date for Article schema; `date` stays the display string */
  isoDate?: string;
  /** Social preview image (Open Graph) and Article schema image */
  image?: { src: string; alt: string };
  /** Laid-out PDF of a white paper, under /public */
  pdf?: string;
}

/* White papers: customers are anonymized in every post ("a frozen vegetable
   processor in the Upper Midwest", "an ice cream plant in the Southeast").
   Do not add customer or brand names without written approval. */

export const blogPosts: BlogPost[] = [
  {
    slug: "we-bought-them-first",
    title: "We Bought Them First.",
    description:
      "Why AQS builds its own sanitary conveyors, what the purchased ones taught us, and what that means for a plant deciding whether to let a new conveyor vendor onto the floor.",
    category: "White Paper",
    categoryColor: "#4D9FFF",
    readTime: "8 min",
    date: "October 2026",
    isoDate: "2026-10-08",
    content: "we-bought-them-first",
    image: { src: "/images/blog/conveyor-origin-modular-belt-close-up.jpg", alt: "Sanitary modular belt conveyor with a continuous stainless frame, hygienic leveling feet, and quick-adjust guide rails" },
    pdf: "/whitepapers/aqs-white-paper-we-bought-them-first.pdf",
    tools: ["mdr-motorized-roller-selection", "belt-pull-calculator", "accumulation-conveyor-calculator"],
  },
  {
    slug: "photo-eyes-retroreflective-vs-diffuse",
    title: "The Pallet Was Blue. The Sensor Couldn't See It.",
    description:
      "Why diffuse photo eyes miss dark pallets, why polarized retro-reflective sensing is the right default for pallet and tote lines, and how to specify for change.",
    category: "White Paper",
    categoryColor: "#4D9FFF",
    readTime: "11 min",
    date: "October 2026",
    isoDate: "2026-10-01",
    content: "photo-eyes-retroreflective-vs-diffuse",
    image: { src: "/images/blog/photo-eyes-blue-pallet-on-mdr-line.jpg", alt: "A blue pooled rental pallet staged on a stainless 24 VDC MDR pallet conveyor" },
    pdf: "/whitepapers/aqs-white-paper-photo-eyes-retroreflective.pdf",
    tools: ["mdr-motorized-roller-selection", "accumulation-conveyor-calculator", "light-curtain-safety-distance-calculator"],
  },
  {
    slug: "veripak-production-quality-platform",
    title: "Every Inspection System Can Reject a Bad Package. VeriPak Proves a Good One.",
    description:
      "How the VeriPak Production Quality Platform records every primary package, coordinates the inspection devices you own, and turns an audit into a query.",
    category: "White Paper",
    categoryColor: "#4D9FFF",
    readTime: "10 min",
    date: "September 2026",
    isoDate: "2026-09-24",
    content: "veripak-production-quality-platform",
    image: { src: "/images/blog/veripak-platform-architecture.jpg", alt: "VeriPak Production Quality Platform architecture diagram" },
    pdf: "/whitepapers/aqs-white-paper-veripak-production-quality-platform.pdf",
    tools: ["product-giveaway-calculator", "packaging-line-downtime-cost-calculator"],
  },
  {
    slug: "ice-cream-lid-match-inspection",
    title: "The Lid Says Vanilla. Does the Tub Agree?",
    description:
      "A VeriPak inspection system reads the lid and sidewall UPC of every ice cream tub at 65 per minute, rejects mismatches, and logs the rest.",
    category: "White Paper",
    categoryColor: "#4D9FFF",
    readTime: "9 min",
    date: "September 2026",
    isoDate: "2026-09-24",
    content: "ice-cream-lid-match-inspection",
    image: { src: "/images/blog/lid-match-inspection-system-shop.jpg", alt: "Stainless lid-match inspection system with controls enclosure and inspection shroud" },
    pdf: "/whitepapers/aqs-white-paper-veripak-ice-cream-lid-match.pdf",
    tools: ["conveyor-speed-calculator", "product-giveaway-calculator"],
  },
  {
    slug: "automated-tote-filling-frozen-vegetables",
    title: "Filling 1,800-Pound Totes at 20 °F. Hands-Free.",
    description:
      "A densification pallet filling system for frozen vegetables: live weighing to 1%, recipe-controlled settling, 24V MDR conveyance, built for 0 to 20 °F.",
    category: "White Paper",
    categoryColor: "#4D9FFF",
    readTime: "8 min",
    date: "September 2026",
    isoDate: "2026-09-24",
    content: "automated-tote-filling-frozen-vegetables",
    image: { src: "/images/blog/tote-filling-system-24v-mdr-pallet-loop.jpg", alt: "Stainless 24 VDC MDR pallet conveyor circuit with swept-radius corners and a scale deck" },
    pdf: "/whitepapers/aqs-white-paper-densification-tote-filling.pdf",
    tools: ["mdr-motorized-roller-selection", "accumulation-conveyor-calculator", "conveyor-throughput-calculator"],
  },
  {
    slug: "what-is-packaging-scada",
    title: "What Is Packaging SCADA and Why Does Your Plant Need One?",
    description:
      "Most packaging lines run QC devices in isolation. Packaging SCADA connects them into one auditable network. Learn what it is and why it matters for food safety.",
    category: "Technology",
    categoryColor: "#00C6D7",
    readTime: "6 min",
    date: "March 2026",
    content: "what-is-packaging-scada",
  },
  {
    slug: "mag-drive-vs-conventional-gearbox",
    title:
      "Mag-Drive vs. Conventional Gearbox: The Case for Oil-Free Conveyors",
    description:
      "Conventional gearbox conveyors leak oil, require maintenance, and fail at the worst times. Mag-Drive eliminates all three. Here's how the technology compares.",
    category: "Engineering",
    categoryColor: "#F5A623",
    readTime: "5 min",
    date: "March 2026",
    content: "mag-drive-vs-conventional-gearbox",
    tools: ["mdr-motorized-roller-selection", "belt-pull-calculator", "conveyor-speed-calculator", "conveyor-throughput-calculator"],
  },
  {
    slug: "mechanical-vs-vision-leak-detection",
    title:
      "Mechanical vs. Vision-Based Leak Detection: Which Catches More?",
    description:
      "Vision systems miss micro-leaks. Mechanical suction-based leak detection catches what cameras can't see. Here's how the two approaches compare for food packaging.",
    category: "Technology",
    categoryColor: "#00C6D7",
    readTime: "5 min",
    date: "March 2026",
    content: "mechanical-vs-vision-leak-detection",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Up to four other posts, same category first */
export function getRelatedPosts(currentSlug: string): BlogPost[] {
  const current = getBlogPost(currentSlug);
  const others = blogPosts.filter((post) => post.slug !== currentSlug);
  return [
    ...others.filter((p) => p.category === current?.category),
    ...others.filter((p) => p.category !== current?.category),
  ].slice(0, 4);
}
