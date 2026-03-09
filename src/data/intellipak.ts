export const intellipakStats = [
  { value: "500", label: "Products / Min" },
  { value: "7", label: "Independent Belt Zones" },
  { value: "320", label: "PPM Per Lane" },
  { value: "On-the-fly", label: "Batch Size Changes" },
];

export const intellipakFAQs = [
  {
    q: "How many belt zones does an IntelliPak system use?",
    a: "It depends on the application. A basic gapping system typically uses 2 independently controlled belts. More complex batching configurations can run up to 7 belt zones. We engineer the belt count to your specific product, speed, and batch requirements.",
  },
  {
    q: "Can I change batch sizes without stopping the line?",
    a: "Yes. Batch groupings are configured through the Allen-Bradley Optix HMI and can be adjusted on the fly — switch from groups of 4 to groups of 6 without mechanical changeover or line downtime.",
  },
  {
    q: "Why does IntelliPak batch AFTER inspection and reject?",
    a: "If you reject a product after batching, you break the group. The downstream case packer or wrapper receives an incomplete batch, which means manual re-staging or a short-packed case. By rejecting while product is still individually spaced, removal is clean. IntelliPak then batches only verified product, so every group is complete.",
  },
  {
    q: "What types of packaging equipment does IntelliPak feed?",
    a: "Thermoformers, case packers (drop-pack and robotic), flow wrappers (HFFS/VFFS), tray sealers, cartoners, hand-pack stations, and robotic pick-and-place cells. The system synchronizes to your machine's specific cycle timing.",
  },
  {
    q: "What products can IntelliPak handle?",
    a: "Any product that can ride on a sanitary flat-belt conveyor — dairy cups, protein patties, baked goods, fresh produce, snack packages, nutraceutical bottles, and more. We engineer belt speed, zone length, and sensor placement for your specific product geometry.",
  },
  {
    q: "How does IntelliPak know where each product is?",
    a: "Keyence photo-eye sensors measure actual product position on the belt — not assumed timing from an encoder. Each belt zone adjusts speed dynamically based on real sensor data, which is why the system maintains accuracy at high speeds.",
  },
];
