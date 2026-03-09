// ─── VeriPak Hub + Sub-Page Data ───

export const VERIPAK_ACCENT = "#00c2ff";

// ─── Core features for hub (condensed bullet list) ───
export const coreFeatures = [
  { icon: "\uD83D\uDCCA", title: "Real-Time Trending", desc: "Monitor all connected devices from one dashboard" },
  { icon: "\uD83D\uDEA8", title: "Alarm Escalation", desc: "Visible/Audible Alarm \u2192 Text/Email Notification \u2192 RACI Routing" },
  { icon: "\uD83D\uDC64", title: "Operator Tracking", desc: "Multi-level permissions with activity logging" },
  { icon: "\uD83D\uDCCB", title: "Audit-Ready Reports", desc: "Shift, SKU, and QC event reports on demand" },
  { icon: "\uD83D\uDD10", title: "Dual-Network Security", desc: "Allen-Bradley secure dual-network architecture keeps your machine network fully isolated. HMI data transfers to your user network without bridging the firewall \u2014 satisfying most enterprise IT security requirements." },
  { icon: "\uD83C\uDF10", title: "VPN Remote Support", desc: "Physical gateway port requires customer-side activation \u2014 outside access is impossible without your permission. 24/7 remote support available on demand." },
];

// ─── Hub stats bar ───
export const hubStats = [
  { value: "60+", label: "Ethernet Devices Supported" },
  { value: "100%", label: "Package-Level Traceability" },
  { value: "3 Tiers", label: "Scalable Pricing" },
  { value: "24/7", label: "VPN Remote Support" },
];

// ─── Module cards for carousel ───
export interface VeriPakModule {
  slug: string;
  href?: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

export const veripakModules: VeriPakModule[] = [
  {
    slug: "full-inspection",
    icon: "\uD83D\uDD0D",
    title: "Full Inspection Suite",
    subtitle: "MD + Checkweigh + Code Date + Vision",
    description:
      "VeriPak connected to the full third-party QC suite: metal detection, checkweighing, code date printing, and vision inspection.",
    features: [
      "Catch contaminants, weight errors & mislabeled product",
      "Every package logged with time, SKU & operator",
      "One-click audit reports across all inspection stations",
      "Eliminate the scramble when an auditor walks in",
    ],
  },
  {
    slug: "leak-detection",
    icon: "\uD83E\uDDEA",
    title: "Leak Detection Module",
    subtitle: "Dual-Pull Aspiration Testing",
    description:
      "Mechanical dual-pull suction detects micro-leaks and pinholes that vision physically cannot see.",
    features: [
      "Detect leaking packages before they reach retail",
      "Identify seal obstructions and film integrity failures",
      "Reduce retailer credits and consumer complaints",
      "Binary pass/fail \u2014 no ML drift, no false-positive fatigue",
    ],
  },
  {
    slug: "intellipak",
    href: "/solutions/intellipak",
    icon: "\u26A1",
    title: "IntelliPak Feed Integration",
    subtitle: "Intelligent Product Handling",
    description:
      "Verified product only \u2014 batching happens after inspection. Precise feed control integrated into the VeriPak data engine.",
    features: [
      "Verified product only \u2014 batching happens after inspection",
      "Precise gap, merge & timing control up to 500 PPM",
      "Same VeriPak data engine underneath",
      "Plug-in upgrade to existing line architecture",
    ],
  },
];

// ─── Network architecture data ───
export const machineDevices = [
  "CompactLogix PLC",
  "Metal Detectors",
  "Checkweighers",
  "VFDs & Sensors",
  "Keyence Vision",
];

export const userServices = [
  "Operator Dashboards",
  "Shift & SKU Reports",
  "ERP / SAP / Maximo",
  "Email / Text Alerts",
  "Remote VPN Access",
];

// ─── Full Inspection sub-page data ───
export const visionCapabilities = [
  {
    title: "Defect Detection",
    desc: "Keyence vision cameras inspect every package for surface defects, dents, tears, and deformations at production speed.",
  },
  {
    title: "Label Verification",
    desc: "Confirms correct label placement, content match, and barcode readability for every package on the line.",
  },
  {
    title: "Seal Inspection",
    desc: "Visual seal-zone analysis detects misalignment, wrinkles, and contamination in heat-sealed packages.",
  },
  {
    title: "Code Date Verification",
    desc: "OCR reads and validates printed code dates against expected values \u2014 catching misprints before they ship.",
  },
];

export const imageHistorianFeatures = [
  "Every package image saved to customer server",
  "Filterable by code date, SKU, shift, operator",
  "View pass and fail images side-by-side",
  "Visual proof of inspection for audits",
  "Recall investigation support",
];

export const rejectFeatures = [
  {
    title: "Pneumatic Reject",
    desc: "Air-actuated diverter removes individual packages at production speed with no line stoppage.",
  },
  {
    title: "Lane-Specific Removal",
    desc: "Multi-lane thermoformer output? VeriPak rejects the specific package, not the entire row.",
  },
  {
    title: "Full Traceability",
    desc: "Every reject logged with timestamp, reason, operator, SKU, and associated inspection data.",
  },
];

// ─── Leak Detection sub-page data ───
export const leakDetectionSteps = [
  {
    step: "01",
    title: "Controlled Aspiration",
    desc: "Calibrated suction cup engages the package surface. System measures the force required to achieve target deflection and records the package\u2019s resistance profile.",
    color: VERIPAK_ACCENT,
  },
  {
    step: "02",
    title: "Differential Aspiration",
    desc: "Identical suction applied immediately after. A sealed package reproduces the same force/deflection curve. A leaking package \u2014 even with a pinhole \u2014 shows measurable atmosphere ingress.",
    color: VERIPAK_ACCENT,
  },
  {
    step: "03",
    title: "Delta-Z Analysis",
    desc: "The force differential and deflection delta between pulls are compared against known-good baselines. Any deviation beyond threshold triggers reject. Binary pass/fail \u2014 no interpretation needed.",
    color: "#00d4aa",
  },
];

export const physicsAdvantages = [
  {
    title: "Physics, Not Pixels",
    desc: "Detects actual atmosphere ingress through any breach \u2014 pinholes, grease in seal, board cuts, micro-tears \u2014 regardless of visual appearance.",
  },
  {
    title: "Self-Referencing",
    desc: "Each package is its own baseline. The first pull establishes the reference. No calibration drift, no ambient light issues.",
  },
  {
    title: "Binary Output",
    desc: "Force delta exceeds threshold \u2192 reject. No ML model interpretation, no confidence scores, no false-positive tuning.",
  },
  {
    title: "Line-Speed Compatible",
    desc: "Mechanical actuation at production speed. No image processing latency or frame-rate limitations.",
  },
];

// ─── Specifications sub-page data ───
export const hardwareSpecs = [
  {
    category: "Enclosure",
    items: [
      { label: "Rating", value: "NEMA 4X Stainless Steel" },
      { label: "Design", value: "Sloped top, fully washdown-rated" },
      { label: "Feet", value: "Sanitary feet by NGI" },
      { label: "Power", value: "Meltric switch-rated receptacle" },
    ],
  },
  {
    category: "PLC / Controller",
    items: [
      { label: "Platform", value: "Allen-Bradley CompactLogix" },
      { label: "I/O", value: "Expandable for additional devices" },
      { label: "Communication", value: "Ethernet/IP native" },
    ],
  },
  {
    category: "HMI / Interface",
    items: [
      { label: "Display", value: 'Allen-Bradley Optix 12" Touchscreen' },
      { label: "Network", value: "Dual-network \u2014 no firewall bridge" },
      { label: "Access", value: "Web-based dashboards + local HMI" },
    ],
  },
  {
    category: "Connectivity",
    items: [
      { label: "Protocols", value: "Ethernet/IP, Modbus-TCP, Digital I/O" },
      { label: "Optional", value: "I/O Link integration" },
      { label: "Remote", value: "VPN-ready for AQS support" },
    ],
  },
];

export const compatibleDevices = [
  "Checkweighers (Ethernet/IP or digital output)",
  "Metal Detectors (Ethernet/IP or digital output)",
  "X-Ray Inspection Systems",
  "Code Date Printers",
  "Label Verification Systems",
  "OneMotion\u00AE PM Motors",
  "VFDs & Servo Drives",
  "Ethernet/IP Devices",
  "I/O Link Devices",
];

// ─── VeriPak-specific FAQs (revised) ───
export const veripakFAQs = [
  {
    q: "Do I need to replace my existing inspection equipment?",
    a: "No. VeriPak connects to any QC device with Ethernet/IP, Modbus-TCP, or digital I/O \u2014 regardless of manufacturer. It centralizes data from your existing metal detectors, checkweighers, X-ray systems, and other devices without replacing them.",
  },
  {
    q: "What if I only want monitoring and data logging \u2014 no AQS inspection modules?",
    a: "That\u2019s Config A. VeriPak works as a standalone SCADA for monitoring and trending your existing Ethernet-connected equipment. You can add vision, leak detection, and reject modules later.",
  },
  {
    q: "How does VeriPak handle operator tracking?",
    a: "Every product is logged under the operator on duty. Login can be manual entry or optional RFID/HID badge scanning for streamlined access. Multi-level permissions separate Operator, Maintenance, and QC roles.",
  },
  {
    q: "What happens when something goes wrong on the line?",
    a: "VeriPak uses configurable alarm escalation. First a visual/audible alert on the floor. If no response, email or text notification. If still unresolved, RACI-based routing escalates to the next tier. You define the rules.",
  },
  {
    q: "Can VeriPak integrate with our ERP system?",
    a: "The Enterprise tier includes historian export to MES/ERP systems like SAP and Maximo for OEE tracking, downtime logging, and system status monitoring.",
  },
  {
    q: "Is VeriPak secure for our IT environment?",
    a: "Yes. VeriPak uses a dual-network architecture. The machine network stays isolated. The HMI connects to your user network for reporting without bridging the firewall \u2014 no new attack surface.",
  },
];
