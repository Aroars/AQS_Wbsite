export const veripakSpecs = [
  {
    label: "Controls Enclosure",
    description:
      "NEMA 4X stainless-steel, sloped top, fully washdown-rated with sanitary NGI feet and Meltric switch-rated power receptacle.",
  },
  {
    label: "PLC / SCADA Controller",
    description:
      "Allen-Bradley CompactLogix processor — real-time scan cycle, expandable I/O for additional devices or reject systems. This is your line's brain.",
  },
  {
    label: "HMI / Live Dashboard",
    description:
      "Allen-Bradley Optix touchscreen with live production dashboards. Connects to user networks without bridging the machine network firewall.",
  },
  {
    label: "Real-Time Data Engine",
    description:
      "Every product recorded live: timestamp, SKU, operator ID, inspection result, weight, pass/fail, code date, lot number. No post-shift processing required.",
  },
  {
    label: "OneMotion® Integration",
    description:
      "Native AOP for permanent magnet motors — live amperage monitoring, operating hours, energy cost tracking, and spike detection alarms in real time.",
  },
  {
    label: "Instant Notifications",
    description:
      "Sub-second email and text alerts for errors, reject accumulation, amperage spikes, and configurable thresholds — sent to the right person immediately.",
  },
  {
    label: "Operator Control",
    description:
      "Multi-level permissions for Operators, Maintenance, QC. Optional RFID/HID badge scanner. Every login, SKU change, and override is timestamped.",
  },
  {
    label: "Device Connectivity",
    description:
      "Ethernet/IP, Modbus-TCP, digital I/O, optional I/O Link. Connects checkweighers, metal detectors, X-ray, printers — all feeding one live SCADA view.",
  },
];

export type ComparisonValue = boolean | "opt";

export interface ComparisonRow {
  feature: string;
  statusQuo: ComparisonValue;
  veripak: ComparisonValue;
  veripakInspection: ComparisonValue;
}

export const comparisonTable: ComparisonRow[] = [
  { feature: "Product QC Checkpoint MD/Weight", statusQuo: true, veripak: true, veripakInspection: true },
  { feature: "SKU Selection / Setpoint Control", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Operator Tracking & Permissions", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Data Logging (Weight, Pass/Fail, SKU)", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Automated Data Export & Reporting", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Centralized Alarm / Status Reporting", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Remote VPN Support", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Audit-Ready QC Recordkeeping", statusQuo: false, veripak: true, veripakInspection: true },
  { feature: "Native Comms to OneMotion® Motors", statusQuo: false, veripak: false, veripakInspection: true },
  { feature: "Email/Text Based Notifications", statusQuo: false, veripak: false, veripakInspection: "opt" },
  { feature: "Visual Package / Product Inspection", statusQuo: false, veripak: false, veripakInspection: true },
  { feature: "Defect or Packaging Error Detection", statusQuo: false, veripak: false, veripakInspection: true },
  { feature: "Label / Code Date Verification", statusQuo: false, veripak: false, veripakInspection: true },
  { feature: "Feed Control / Batching / Merging", statusQuo: false, veripak: "opt", veripakInspection: "opt" },
  { feature: "Product Reject", statusQuo: false, veripak: false, veripakInspection: "opt" },
  { feature: "Product Lot or Line Traceability", statusQuo: false, veripak: true, veripakInspection: true },
];

export const feedbackLoop = [
  {
    step: "01",
    title: "Detect",
    description:
      "Connected devices (checkweighers, vision, metal detectors) feed live inspection data to VeriPak continuously.",
  },
  {
    step: "02",
    title: "Decide",
    description:
      "CompactLogix PLC evaluates pass/fail criteria in real time against SKU-specific setpoints. No batch processing.",
  },
  {
    step: "03",
    title: "Act",
    description:
      "Automatic reject, line stop, or operator alert fires instantly. Configurable escalation — from HMI popup to email/text.",
  },
  {
    step: "04",
    title: "Record",
    description:
      "Every event logged with timestamp, operator, SKU, device ID, and result. Audit-ready before the shift ends.",
  },
];
