export const intellipakStats = [
  { value: "500", label: "Products / Min" },
  { value: "320", label: "PPM Per Lane" },
  { value: "55%", label: "Energy Savings" },
  { value: "50%", label: "Faster Sanitation" },
];

export const intellipakCapabilities = [
  {
    icon: "\u26A1",
    title: "High-Speed Infeed & Gapping",
    accent: "#F5A623",
    items: [
      "Mag-Drive precision at up to 500 ppm",
      "Photo-eye sensing measures actual product position",
      "Pull gaps and batch for seamless case packing",
      "Feeds flow wrappers, tray sealers, thermoformers",
    ],
  },
  {
    icon: "\u21C4",
    title: "Multi-Lane Collation & Merging",
    accent: "#00C6D7",
    items: [
      "Convert singulated items into stacks",
      "Synchronous motion minimizes product damage",
      "Multi-lane configurable \u2014 scalable to your application",
      "High rate feed up to 320 ppm per lane",
    ],
  },
  {
    icon: "\u25CE",
    title: "Gentle Accumulation",
    accent: "#34D399",
    items: [
      "Zero-pressure systems queue without touching",
      "Buffer for downstream stoppages",
      "Belt velocity determined by real product position",
      "Worry-free packing for delicate products",
    ],
  },
  {
    icon: "\uD83D\uDEE1",
    title: "Sanitary Construction",
    accent: "#E6F1FF",
    items: [
      "304/316 stainless steel, continuous TIG-welded frames",
      "IP54 wipe-down through full IP69K washdown",
      "Tool-less disassembly with quick-release belt lifters",
      "Sloped design reduces sanitation time by up to 50%",
    ],
  },
  {
    icon: "\uD83E\uDD16",
    title: "Robotics & Vision Ready",
    accent: "#3B82F6",
    items: [
      "Vision-driven lane balancing & defect sorting",
      "Robotic pick-and-place infeed presentation",
      "QR-coded traceability from product to pallet",
      "Integration with KUKA KR Quantec palletizers",
    ],
  },
  {
    icon: "\uD83D\uDCCA",
    title: "Intelligent Controls",
    accent: "#F5A623",
    items: [
      "Allen-Bradley CompactLogix PLC + Optix HMI",
      "Keyence sensor feedback loops",
      "Secure dual-network architecture",
      "VeriPak SCADA integration for audit-ready data",
    ],
  },
];

export const intellipakApplications = [
  { machine: "Flow Wrappers", desc: "Tight pitch control for HFFS/VFFS" },
  { machine: "Tray Sealers", desc: "Multi-lane presentation & grouping" },
  { machine: "Thermoformers", desc: "Cycle-synchronized infeed" },
  { machine: "Cartoners", desc: "Accurate count & orientation" },
  { machine: "Case Packers", desc: "Batching & collation at speed" },
  { machine: "Robotic Cells", desc: "Pick-and-place ready staging" },
];

export const magDriveSpecs = [
  ["IP69K washdown safe", "Fully sealed, no oil leak risk"],
  ["3-year drive warranty", "Industry-leading reliability"],
  ["Open-loop control", "No servo amplifier or motion controller needed"],
  ["3A / USDA compliant", "Above the sanitary surface, zero external drivetrain"],
  ["55% energy savings", "No energy lost through gears"],
];
