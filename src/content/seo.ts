// Per-page metadata for Next.js generateMetadata

export const siteConfig = {
  name: "Automated Quality Solutions",
  shortName: "AQS",
  url: "https://www.automatedqs.com",
  email: "sales@automatedqs.com",
  phone: "(208) 297-4420",
  location: "Nampa, Idaho",
  address: "1420 W. Karcher Rd., Nampa, ID 83687",
  linkedin: "https://www.linkedin.com/company/automatedqs/",
  youtube: "https://www.youtube.com/@AutomatedQS",
};

export const pageMetadata = {
  home: {
    title: "Automated Quality Solutions | Audit-Ready Packaging Quality Control",
    description:
      "Your equipment catches bad product — can it prove a good one? AQS builds quality control systems that record, trace, and prove every package. VeriPak SCADA, IntelliPak conveyors, sanitary robotics.",
  },
  solutions: {
    title: "Packaging Automation Solutions | VeriPak, IntelliPak & More | AQS",
    description:
      "Explore AQS packaging line solutions: VeriPak SCADA, IntelliPak smart conveyors, EvacuPak liquid recovery, custom sanitary conveyors, leak detection, and washdown robotics.",
  },
  veripak: {
    title: "VeriPak SCADA | Audit-Ready Quality Control for Packaging Lines | AQS",
    description:
      "VeriPak ties inspection data to every individual package \u2014 weight, metal detection, vision, leak testing \u2014 so you can prove compliance, defend chargebacks, and stop managing quality backwards.",
  },
  evacupak: {
    title: "EvacuPak | Liquid Recovery System — Up to 97% Product Recovery | AQS",
    description:
      "EvacuPak liquid recovery systems achieve up to 97% product recovery with a patented hygienic lance design. 3A certified, CIP capable, full HACCP traceability.",
  },
  leakDetection: {
    title: "Package Leak Detection | Mechanical Integrity Testing | AQS",
    description:
      "Dual-pull suction leak detection finds pinholes and micro-leaks that vision systems miss. Mechanical testing with binary pass/fail — no ML drift, no false positives. VeriPak integrated.",
  },
  robotics: {
    title: "Sanitary Robotics | Washdown-Rated Palletizing & Case Packing | AQS",
    description:
      "KUKA and Staubli washdown-rated robotic systems for palletizing, case packing, and pick-and-place in food production. 316L stainless steel, Rockwell-native programming.",
  },
  conveyors: {
    title: "Custom Sanitary Conveyors | TIG-Welded Stainless Steel | AQS",
    description:
      "Purpose-built sanitary conveyors with continuous TIG-welded 304/316 stainless steel frames. Flat-top, modular belt, MDR, freezer, and accumulation systems for food and dairy plants.",
  },
  conveyorsBelt: {
    title: "Belt Conveyor Systems — Flat-Top, Modular, Incline & Freezer | AQS",
    description:
      "Sanitary belt conveyor systems: flat-top, modular, incline/decline, and freezer-rated arctic conveyors. TIG-welded stainless steel, FDA-approved belting, IP69K washdown capable.",
  },
  conveyorsRollerDrive: {
    title: "Roller & Drive Systems — MDR, Accumulation & Merge/Divert | AQS",
    description:
      "Zone-controlled MDR conveyors, zero-pressure accumulation, and intelligent merge/divert systems for sanitary food processing. PulseRoller washdown-rated options available.",
  },
  conveyorsSpecialty: {
    title: "Heavy-Duty & Pallet Conveyor Systems — Chain & Washdown Pallet | AQS",
    description:
      "Heavy-duty chain conveyors and washdown pallet handling systems for end-of-line sanitary environments. IP69K rated, KUKA robotic palletizing compatible.",
  },
  conveyorsProjects: {
    title: "Conveyor Projects & Case Studies | AQS — Automated Quality Solutions",
    description:
      "Real-world conveyor projects: freezer conveyors for marshmallow production, dairy accumulation systems, and more. See how AQS solves sanitary conveyance challenges.",
  },
  intellipak: {
    title: "IntelliPak | Mag-Drive Smart Infeed \u2014 Zero Oil, 500 PPM, 55% Less Energy | AQS",
    description:
      "IntelliPak replaces gearbox-driven infeeds with Mag-Drive hub motors \u2014 eliminating oil contamination, cutting energy 55%, and delivering 500 PPM synchronous feeding for sanitary packaging lines.",
  },
  veripakFullInspection: {
    title: "Full Inspection Suite — Vision, Reject & Image Historian | AQS VeriPak",
    description:
      "Complete package inspection with Keyence vision, lane-specific pneumatic reject, and Package Image Historian. Every image saved, every defect caught, every decision logged.",
  },
  veripakLeakDetection: {
    title: "Leak Detection Module — Dual-Pull Aspiration Testing | AQS VeriPak",
    description:
      "Mechanical dual-pull suction detects micro-leaks and pinholes that vision cannot see. Binary pass/fail, inline at full speed, integrated with VeriPak SCADA.",
  },
  veripakSpecifications: {
    title: "Technical Specifications — Hardware, Network & Compatibility | AQS VeriPak",
    description:
      "VeriPak hardware: NEMA 4X stainless enclosure, Allen-Bradley CompactLogix PLC, Optix HMI, dual-network security architecture. Full feature comparison and device compatibility.",
  },
  reps: {
    title: "Sales Representative Resources | AQS Partner Portal",
    description:
      "Resources and information for authorized AQS sales representatives. Access product specs, quoting tools, and sales support materials.",
  },
  about: {
    title: "About AQS | Packaging Automation Engineers in Nampa, Idaho",
    description:
      "Automated Quality Solutions is a Nampa, Idaho company engineering intelligent automation for food, dairy, protein, and pharma packaging lines. 50+ years combined engineering experience.",
  },
  contact: {
    title: "Get a Quote | Contact Automated Quality Solutions",
    description:
      "Request a quote for VeriPak SCADA, IntelliPak conveyors, custom sanitary conveyors, robotics, or leak detection. Contact AQS at (208) 297-4420 or sales@automatedqs.com.",
  },
  apps: {
    title: "Digital Tools & Apps | Conveyor Quoting & ROI Calculator | AQS",
    description:
      "AQS builds purpose-built digital tools for packaging automation sales — including a conveyor quote builder with 3D preview and an ROI projection calculator for capital equipment decisions.",
  },
  blog: {
    title: "Blog | Packaging Automation Insights | AQS",
    description:
      "Technical articles on packaging SCADA, sanitary conveyor design, leak detection, and ROI optimization from the AQS engineering team. Built for plant managers and packaging professionals.",
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
    streetAddress: "1420 W. Karcher Rd.",
    addressLocality: "Nampa",
    addressRegion: "ID",
    postalCode: "83687",
    addressCountry: "US",
  },
  telephone: "(208) 297-4420",
  email: "sales@automatedqs.com",
  founder: [
    { "@type": "Person", name: "Travis Nebeker", jobTitle: "CEO and Co-Founder" },
    { "@type": "Person", name: "Robert Byars", jobTitle: "COO and Co-Founder" },
  ],
  sameAs: [
    "https://www.linkedin.com/company/automatedqs/",
    "https://www.youtube.com/@AutomatedQS",
  ],
};
