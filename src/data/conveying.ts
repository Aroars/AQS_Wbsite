// "What are you conveying?" — hover a product and see the conveyor types that
// carry it. Links resolve to the type page when one exists, otherwise to the
// family-page anchor.

export interface ConveyingPick {
  family: "belt" | "mdr" | "pallet";
  typeSlug: string;
  why: string;
}

export interface ConveyingItem {
  id: string;
  label: string;
  hint: string;
  picks: ConveyingPick[];
}

export const conveyingItems: ConveyingItem[] = [
  {
    id: "trays",
    label: "Trays",
    hint: "MAP trays, clamshells, thermoformed packs",
    picks: [
      { family: "belt", typeSlug: "flat-top-belt", why: "Smooth surface keeps trays flat and oriented between machines." },
      { family: "belt", typeSlug: "modular-belt", why: "Side-flexing modules carry trays through curves; perforated modules drain." },
      { family: "belt", typeSlug: "radius", why: "Turn the line without a transfer that catches a tray edge." },
      { family: "mdr", typeSlug: "accumulation", why: "Buffer trays on belt accumulation ahead of the packer." },
    ],
  },
  {
    id: "pouches",
    label: "Pouches",
    hint: "flow-wrapped, vacuum, stand-up pouches",
    picks: [
      { family: "belt", typeSlug: "flat-top-belt", why: "A smooth belt does not mark or snag film." },
      { family: "belt", typeSlug: "incline-decline", why: "Cleated belts lift pouches to a mezzanine or packer infeed." },
      { family: "belt", typeSlug: "freezer-arctic", why: "Frozen pouches out of the tunnel on a freezer-rated belt." },
      { family: "mdr", typeSlug: "merge-divert", why: "Lane dividing and reject lanes after inspection." },
    ],
  },
  {
    id: "cartons",
    label: "Cartons",
    hint: "folding cartons, chipboard, sleeves",
    picks: [
      { family: "belt", typeSlug: "flat-top-belt", why: "Stable transport from the cartoner to inspection and casing." },
      { family: "belt", typeSlug: "modular-belt", why: "Grip and drainage where cartons meet a wet room." },
      { family: "mdr", typeSlug: "merge-divert", why: "Merge lines into one case packer and divert by count or barcode." },
      { family: "mdr", typeSlug: "accumulation", why: "Hold cartons through a downstream stop without crushing." },
    ],
  },
  {
    id: "bottles",
    label: "Bottles",
    hint: "bottles, jars, cans, tubs",
    picks: [
      { family: "belt", typeSlug: "flat-top-belt", why: "Flat-top belt with adjustable or auto-adjusting guide rails for container changes." },
      { family: "belt", typeSlug: "modular-belt", why: "Wet-area transport with drainage under the containers." },
      { family: "belt", typeSlug: "radius", why: "Single-file turns without a dead plate to tip a bottle." },
      { family: "mdr", typeSlug: "accumulation", why: "Buffer ahead of the filler or labeler." },
    ],
  },
  {
    id: "bulk",
    label: "Bulk product",
    hint: "loose pieces, granules, frozen product",
    picks: [
      { family: "belt", typeSlug: "incline-decline", why: "Cleated and sidewall belts lift loose product into hoppers, weighers, and baggers." },
      { family: "belt", typeSlug: "modular-belt", why: "Perforated and raised-rib modules drain and carry loose pieces." },
      { family: "belt", typeSlug: "freezer-arctic", why: "Frozen product on belts rated for the freezer." },
      { family: "belt", typeSlug: "flat-top-belt", why: "Smooth transport where product must not catch." },
    ],
  },
  {
    id: "cases",
    label: "Cases",
    hint: "shipping cases, shrink packs, bundles",
    picks: [
      { family: "mdr", typeSlug: "mdr-zones", why: "One 24V roller per zone; cases queue without contact." },
      { family: "mdr", typeSlug: "accumulation", why: "Minutes of buffer ahead of the palletizer." },
      { family: "mdr", typeSlug: "merge-divert", why: "Route cases by count, barcode, or inspection result." },
      { family: "belt", typeSlug: "incline-decline", why: "Carry cases between floor and mezzanine." },
    ],
  },
  {
    id: "totes",
    label: "Totes & bins",
    hint: "reusable totes, crates, combos",
    picks: [
      { family: "mdr", typeSlug: "mdr-zones", why: "Totes accumulate on 24V MDR zones without back-pressure." },
      { family: "mdr", typeSlug: "accumulation", why: "Stage totes between fill and pickup." },
      { family: "pallet", typeSlug: "chain", why: "Flat-bottom bins and combos on single-strand chain." },
    ],
  },
  {
    id: "pallets",
    label: "Pallets",
    hint: "loaded pallets, bulk containers",
    picks: [
      { family: "pallet", typeSlug: "washdown-pallet", why: "Stainless 24V MDR pallet zones with zero-pressure accumulation." },
      { family: "pallet", typeSlug: "chain", why: "Palletizer discharge, wrapper infeed, and rough pallets on chain." },
      { family: "mdr", typeSlug: "accumulation", why: "Stage loaded pallets ahead of wrapping or forklift pickup." },
    ],
  },
];
