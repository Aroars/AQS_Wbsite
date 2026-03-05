// ─── For Reps Page Data ───

// Accent colors for this page
export const REP_CYAN = "#00C6D7";
export const REP_GOLD = "#F5A623";
export const REP_GREEN = "#34D399";
export const REP_BLUE = "#3B82F6";

// ─── Why AQS — 6 reasons ───
export const reasons = [
  { icon: "\u26A1", accent: REP_CYAN,  title: "Products That Open Doors",          body: "VeriPak SCADA and IntelliPak solve a real, named problem food plants have today \u2014 isolated QC devices, no centralized data, audit vulnerability. You\u2019re not selling hardware. You\u2019re walking in with the answer to a question the QA manager has already been asked." },
  { icon: "\uD83C\uDFD7\uFE0F", accent: REP_GOLD,  title: "Engineering Support on Every Deal", body: "When you have a live opportunity, AQS works with you \u2014 site review, system scoping, proposal support, and technical Q&A. You bring the relationship. We bring the credibility. You don\u2019t need to be the expert on every spec." },
  { icon: "\uD83D\uDCCB", accent: REP_GREEN, title: "Compliance Sells Itself",           body: "FSMA, USDA, FDA, GFSI audit pressure \u2014 your customers are already stressed. VeriPak\u2019s audit-ready recordkeeping and 100% product-level traceability directly answer that pressure. You arrive with exactly what the QA manager needs to stop scrambling." },
  { icon: "\uD83E\uDD1D", accent: REP_BLUE,  title: "Your Accounts Stay Yours",          body: "AQS protects your territory. We don\u2019t go around you, we don\u2019t build direct relationships behind your back, and we don\u2019t compete with you. Your customers are recognized on every line item \u2014 and every expansion comes back to you." },
  { icon: "\uD83D\uDD27", accent: REP_CYAN,  title: "Turnkey Systems \u2014 Defined Scope",    body: "AQS ships systems ready to deploy: Allen-Bradley controls onboard, Keyence sensors integrated, VPN support built in. You\u2019re selling a finished product with predictable scope. No managing integration nightmares. No customer callback about missing parts." },
  { icon: "\uD83D\uDCCA", accent: REP_GOLD,  title: "One Relationship, Multiple Lines",  body: "A single plant relationship can grow into VeriPak SCADA nodes on multiple lines, IntelliPak feed systems, sanitary conveyors, and KUKA palletizing cells. Once you\u2019re in the door, the ecosystem expands your opportunity with every customer visit." },
];

// ─── Product lineup ───
export const products = [
  {
    name: "VeriPak\u00AE", subtitle: "Packaging SCADA Platform", accent: REP_CYAN, tag: "Lead Product", href: "/solutions/veripak",
    points: [
      "Standalone SCADA \u2014 not middleware, not a data logger",
      "Connects every QC device: metal detectors, checkweighers, X-ray, printers",
      "Allen-Bradley CompactLogix + Optix HMI \u2014 same platform plants already run",
      "Audit-ready recordkeeping, operator tracking, shift & SKU reports",
      "Priced $68,700\u2013$76,345 depending on deployment scale",
    ],
  },
  {
    name: "IntelliPak\u00AE", subtitle: "Intelligent Feed Systems", accent: REP_GOLD, tag: "Lead Product", href: "/solutions/intellipak",
    points: [
      "Mag-Drive powered \u2014 no gears, no oil, no servo amplifiers, no oil leak risk",
      "Up to 500 products per minute with servo-like open-loop precision",
      "Gapping, collation, multi-lane merging, batching, and cycle-synchronized timing",
      "Feeds flow wrappers, tray sealers, cartoners, thermoformers, case packers",
      "Ships with Allen-Bradley controls onboard \u2014 plug-in, not a build project",
    ],
  },
  {
    name: "Custom Conveyors", subtitle: "Sanitary Material Handling", accent: "#94A3B8", tag: "Recurring Revenue", href: "/solutions/conveyors",
    points: [
      "Engineered-to-order \u2014 never catalog hardware bolted together",
      "Continuous TIG-welded 304/316 mirror-polish stainless \u2014 zero harborage points",
      "IP54 through full IP69K high-pressure caustic washdown",
      "Belt, MDR, chain, incline/decline, accumulation, arctic-rated, merge/divert",
      "Instant quoting via the rep proposal tool \u2014 hand the customer a number same day",
    ],
  },
  {
    name: "Sanitary Robotics", subtitle: "KUKA Washdown Palletizing", accent: REP_BLUE, tag: "High-Value Sale", href: "/solutions/robotics",
    points: [
      "KUKA KR Quantec \u2014 true IP67 washdown and caustic environment rated",
      "Up to 54 cases per minute per line, multi-case grippers for tight stack patterns",
      "Automated pallet magazines \u2014 minimal operator intervention",
      "Arctic options for cold storage, blast freezer, and frozen product environments",
      "Full washdown rated end-to-end \u2014 including the conveyor infeed and discharge",
    ],
  },
];

// ─── How it works — 4 steps ───
export const partnerSteps = [
  { num: "01", accent: REP_CYAN,  title: "Register Your Interest",          body: "Fill out the form below or email sales@automatedqs.com. Tell us about your territory, your current line card, and the industries you call on." },
  { num: "02", accent: REP_GOLD,  title: "Discovery Call with AQS",         body: "We\u2019ll walk through the product lineup, discuss your typical customer base, and confirm fit. If it\u2019s a good match, we move fast \u2014 no lengthy approval process." },
  { num: "03", accent: REP_GREEN, title: "Rep Agreement & Onboarding",      body: "You\u2019ll receive a territory agreement, access to the rep portal and quoting tools, full marketing materials, and a dedicated AQS engineering contact for technical support." },
  { num: "04", accent: REP_BLUE,  title: "Bring Us Your First Opportunity", body: "Introduce us to a prospect. AQS supports the technical side \u2014 site review, system recommendation, proposal \u2014 while you manage the relationship. We close it together." },
];

// ─── Rep tools ───
export const repTools = [
  {
    icon: "\uD83D\uDCC8",
    title: "Project ROI Calculator",
    accent: REP_CYAN,
    tag: "Rep Portal",
    url: "apps.automatedqs.com",
    urlPath: "/roi",
    body: "Walk into any customer meeting and leave with a number. Input their line speed, downtime history, audit labor hours, and recall exposure \u2014 the tool builds a payback model on the spot. When the prospect asks \u2018what\u2019s this worth to us?\u2019, you have the answer before they finish the sentence.",
    features: [
      "Calculates payback period, year-1 ROI, and 5-year value",
      "Inputs: throughput, downtime events, audit labor, recall history",
      "Supports VeriPak, IntelliPak, and conveyor system scenarios",
      "Generates a branded PDF summary to share or leave behind",
    ],
  },
  {
    icon: "\uD83C\uDFD7\uFE0F",
    title: "Conveyor Proposal Tool",
    accent: REP_GOLD,
    tag: "Rep Portal",
    url: "apps.automatedqs.com",
    urlPath: "/conveyors",
    body: "Configure a custom conveyor system and hand the customer a priced proposal the same day you walk their line. Select conveyor type, dimensions, washdown rating, drive technology, and controls package \u2014 the tool prices it against approved AQS rate tables and generates a formatted proposal.",
    features: [
      "Full configurator: belt, MDR, chain, incline, arctic, merge/divert",
      "Select material grade (304/316), IP rating, drive, and controls package",
      "Instant pricing from approved AQS rate tables",
      "Outputs a formatted project proposal ready for customer review",
    ],
  },
];

// ─── Downloads ───
export const downloads = [
  { title: "VeriPak\u00AE Rep Sell Sheet 2026",  desc: "Two-page overview for customer-facing conversations. SCADA positioning, configs, pricing tiers, and add-ons.", file: "VeriPak_Rep_Sell_Sheet_2026.pdf", accent: REP_CYAN, tag: "Sales Tool", ext: "PDF" },
  { title: "VeriPak\u00AE Product Memo",          desc: "Technical memo on VeriPak as a standalone SCADA. Built for plant engineers and QA managers.", file: "AQS__VeriPak_Product_Memo_2026.pdf", accent: REP_CYAN, tag: "Technical", ext: "PDF" },
  { title: "IntelliPak\u00AE Systems Brochure",   desc: "Two-page sell sheet \u2014 IntelliPak features, Mag-Drive technology, and feed system applications.", file: "IntelliPak_Systems_by_AQS.pdf", accent: REP_GOLD, tag: "Sales Tool", ext: "PDF" },
  { title: "Sanitary Conveyors Brochure",        desc: "AQS conveyor capabilities \u2014 construction standards, drive technology, compliance ratings.", file: "Sanitary_Conveyors_by_AQS__Final.pdf", accent: "#94A3B8", tag: "Sales Tool", ext: "PDF" },
  { title: "Washdown Palletizing \u2014 Dairy",   desc: "KUKA KR Quantec case palletizing brief with MDR conveyors, washdown specs, and arctic options.", file: "Washdown_Palletizing_L1_Brochure_20240208_23_34_13.png", accent: REP_BLUE, tag: "App Brief", ext: "IMG" },
  { title: "VeriPak\u00AE Pricing Reference",     desc: "All VeriPak tiers and add-on option pricing. Confirm current pricing with AQS before quoting.", file: "Approved_Pricing_Star_PKG_121525.pdf", accent: REP_GREEN, tag: "Rep Only", ext: "PDF" },
];

// ─── Product pill strip in hero ───
export const productPills = [
  { label: "VeriPak\u00AE SCADA", accent: REP_CYAN },
  { label: "IntelliPak\u00AE Feed Systems", accent: REP_GOLD },
  { label: "Custom Conveyors", accent: "#94A3B8" },
  { label: "Sanitary Robotics", accent: REP_BLUE },
];
