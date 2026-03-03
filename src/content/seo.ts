// Per-page metadata for Next.js generateMetadata

export const siteConfig = {
  name: "Automated Quality Solutions",
  shortName: "AQS",
  url: "https://www.automatedqs.com",
  email: "info@automatedqs.com",
  location: "Boise, Idaho",
  linkedin: "https://www.linkedin.com/company/automatedqs/",
  youtube: "https://www.youtube.com/@AutomatedQS",
};

export const pageMetadata = {
  home: {
    title: "Automated Quality Solutions | Packaging SCADA, Liquid Recovery & Sanitary Robotics",
    description:
      "AQS engineers standalone SCADA platforms, liquid recovery systems, leak detection technology, sanitary conveyors, and washdown robotics for food production facilities. Based in Boise, Idaho.",
  },
  solutions: {
    title: "Solutions | AQS — Automated Quality Solutions",
    description:
      "Explore AQS solutions: VeriPak SCADA, EvacuPak liquid recovery, leak detection, sanitary robotics, and custom conveyor systems for food production facilities.",
  },
  veripak: {
    title: "VeriPak Standalone SCADA Platform | AQS — Automated Quality Solutions",
    description:
      "VeriPak is a standalone SCADA system for packaging quality control. Real-time dashboards, sub-second alerts, auto-reject, and audit-ready records. Allen-Bradley CompactLogix. No middleware required.",
  },
  evacupak: {
    title: "EvacuPak Liquid Recovery System | AQS — Automated Quality Solutions",
    description:
      "Patented fluid recovery with up to 97% product recovery from packaging. 3A certified hygienic lances, CIP capable, full HACCP traceability. Never exposed to atmosphere.",
  },
  leakDetection: {
    title: "Leak Detection — Dual-Pull Suction Technology | AQS — Automated Quality Solutions",
    description:
      "Vision can't detect what physics can measure. AQS is developing a mechanical dual-pull suction system that detects pinholes, grease-in-seal, and board cuts that camera systems miss.",
  },
  robotics: {
    title: "Sanitary Robotics — Washdown Robotic Systems | AQS — Automated Quality Solutions",
    description:
      "Fully washdown-rated robotic systems for palletizing, case packing, pick-and-place, and end-of-line automation. 316L stainless, IP69K, USDA/FDA compliant. KUKA and Fanuc platforms.",
  },
  conveyors: {
    title: "Sanitary Conveyor Systems | AQS — Automated Quality Solutions",
    description:
      "Custom-engineered food-grade conveyor systems including freezer conveyors, accumulation systems, and modular belt configurations. 50+ years combined engineering experience.",
  },
  intellipak: {
    title: "IntelliPak® Feed Systems — Smart Infeed & Product Handling | AQS",
    description:
      "Mag-Drive powered precision infeed for sanitary packaging lines. Gap, merge, collate, and time products at up to 500 PPM with zero gears, zero oil, and servo-like accuracy.",
  },
  about: {
    title: "About | AQS — Automated Quality Solutions",
    description:
      "Meet the AQS leadership team and learn about our core values: Solutions Seekers, Motivated to Achieve, Integrity in Everything. Based in Boise, Idaho.",
  },
  contact: {
    title: "Contact | AQS — Automated Quality Solutions",
    description:
      "Get a quote for VeriPak SCADA, EvacuPak liquid recovery, leak detection, sanitary robotics, or conveyor systems. Contact AQS in Boise, Idaho.",
  },
};

// Organization structured data — include on all pages
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Automated Quality Solutions (AQS)",
  url: "https://www.automatedqs.com",
  description:
    "AQS designs and manufactures standalone SCADA platforms, liquid recovery systems, leak detection technology, sanitary robotics, and conveyor systems for food production facilities.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Boise",
    addressRegion: "ID",
    addressCountry: "US",
  },
  founder: [
    { "@type": "Person", name: "Travis Nebeker", jobTitle: "CEO and Co-Founder" },
    { "@type": "Person", name: "Robert Byars", jobTitle: "COO and Co-Founder" },
  ],
  sameAs: [
    "https://www.linkedin.com/company/automatedqs/",
    "https://www.youtube.com/@AutomatedQS",
  ],
};
