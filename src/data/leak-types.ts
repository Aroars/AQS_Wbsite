export const leakTypes = [
  {
    name: "Film Pinholes",
    description:
      "Micro-punctures from burrs on rollers, exit chutes, or lazy susans. Often invisible to camera systems — too small to resolve at line speed.",
  },
  {
    name: "Board Cuts",
    description:
      "L-board edges puncturing forming film from inside the package. Occurs along board edges or flaps when boards aren't lying flat.",
  },
  {
    name: "Board in Seal",
    description:
      "L-board material encroaching into seal area, creating incomplete seals. Caused by misalignment, timing issues, or infeed plate angles.",
  },
  {
    name: "Fat / Meat / Scrap in Seal",
    description:
      "Product contamination in the seal zone — from bacon length variance, cold meat creating scrap, or wafer slices from the slicer.",
  },
  {
    name: "Grease in Seal",
    description:
      "Bacon grease trapped in seal from earlier contamination events. Foreign material on the die seal area creates cascading failures across multiple packages.",
  },
  {
    name: "Initial & Final Seal Leaks",
    description:
      "Compromised seals from foreign material on seal bars, incorrect heat settings, or worn bushings creating insufficient overlap between initial and final seals.",
  },
  {
    name: "Film Wrinkle / Misalignment",
    description:
      "Insufficient film tension or misalignment creating wrinkles that prevent proper seal formation. Partial rolls without brake pressure are common culprits.",
  },
  {
    name: "Low Vacuum",
    description:
      "Trapped atmosphere from insufficient vacuum pressure, leaking hoses, or incorrect seal timing. Package lacks vacuum-tight appearance.",
  },
];

export const visionMisses = [
  "Sub-pixel pinholes in forming film",
  "Grease trapped inside seal zones",
  "L-board edge micro-punctures from inside",
  "Incomplete initial/final seal overlap",
  "Fat or scrap contamination in seal area",
  "Film wrinkle defects under the seal surface",
  "Low vacuum without visible seal defect",
  "Cascading die contamination from prior packages",
];
