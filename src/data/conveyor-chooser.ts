// "What are you moving, and where?" — the second way into the conveyor section.
// Each answer pair maps to the types that fit; links resolve to the type page
// when one exists, otherwise to the family-page anchor.

export type ProductKind = "packages" | "cases" | "totes" | "pallets" | "bulk";
export type RoomKind = "dry" | "washdown" | "freezer";

export const productOptions: { id: ProductKind; label: string; hint: string }[] = [
  { id: "packages", label: "Packages & trays", hint: "pouches, cartons, tubs, bottles" },
  { id: "cases", label: "Cases", hint: "shipping cases, shrink packs" },
  { id: "totes", label: "Totes & bins", hint: "reusable totes, crates" },
  { id: "pallets", label: "Pallets", hint: "loaded pallets, bulk containers" },
  { id: "bulk", label: "Loose product", hint: "pieces, granules, frozen product" },
];

export const roomOptions: { id: RoomKind; label: string; hint: string }[] = [
  { id: "dry", label: "Dry room", hint: "wipe-down, IP54–65" },
  { id: "washdown", label: "Washdown", hint: "hosed daily, IP66–69K" },
  { id: "freezer", label: "Freezer", hint: "sub-zero, to −40 °F" },
];

export interface ChooserPick {
  family: "belt" | "mdr" | "pallet";
  typeSlug: string;
  why: string;
}

/** Types by what is moved; the room adds or reorders below */
const byProduct: Record<ProductKind, ChooserPick[]> = {
  packages: [
    { family: "belt", typeSlug: "flat-top-belt", why: "Stable surface for cartons, pouches, and bottles between process stages." },
    { family: "belt", typeSlug: "modular-belt", why: "Drainage, grip, and side-flexing for wet or curved paths." },
    { family: "belt", typeSlug: "radius", why: "Turn the line without a transfer." },
    { family: "mdr", typeSlug: "merge-divert", why: "Lane dividing, merging, and reject lanes ahead of the packer." },
  ],
  cases: [
    { family: "mdr", typeSlug: "mdr-zones", why: "Zone control and zero-pressure queues for cases and shrink packs." },
    { family: "mdr", typeSlug: "accumulation", why: "Buffer minutes of production ahead of the palletizer." },
    { family: "mdr", typeSlug: "merge-divert", why: "Route cases by count, barcode, or inspection result." },
    { family: "belt", typeSlug: "incline-decline", why: "Carry cases between floor and mezzanine." },
  ],
  totes: [
    { family: "mdr", typeSlug: "mdr-zones", why: "Totes accumulate without contact on 24V MDR zones." },
    { family: "mdr", typeSlug: "accumulation", why: "Staging between fill and pickup." },
    { family: "pallet", typeSlug: "chain", why: "Flat-bottom bins and combos on single-strand chain." },
  ],
  pallets: [
    { family: "pallet", typeSlug: "washdown-pallet", why: "Stainless roller and 24V MDR pallet conveyance with zone control." },
    { family: "pallet", typeSlug: "chain", why: "Palletizer discharge, wrapper infeed, and rough pallets on chain." },
    { family: "mdr", typeSlug: "accumulation", why: "Zero-pressure pallet staging ahead of wrapping or forklift pickup." },
  ],
  bulk: [
    { family: "belt", typeSlug: "incline-decline", why: "Cleated and sidewall belts lift loose product into hoppers and baggers." },
    { family: "belt", typeSlug: "modular-belt", why: "Perforated and raised-rib belts drain and carry loose pieces." },
    { family: "belt", typeSlug: "flat-top-belt", why: "Smooth transport for bulk product that must not catch." },
  ],
};

/** The room adds the freezer type in front, or notes the washdown build */
export function choose(product: ProductKind, room: RoomKind): { picks: ChooserPick[]; note: string } {
  const base = byProduct[product];
  if (room === "freezer") {
    return {
      picks: [{ family: "belt", typeSlug: "freezer-arctic", why: "Every type below is available freezer-rated to −40 °F; start here for the cold-room details." }, ...base],
      note: "Freezer-rated builds use low-temperature seals, lubricants, motors, and drive cards, and manage condensation at the transition.",
    };
  }
  if (room === "washdown") {
    return { picks: base, note: "All of these are built washdown-rated: continuous TIG-welded stainless, sloped frames, IP65 standard and IP69K where the room is hosed at pressure." };
  }
  return { picks: base, note: "Dry rooms still get the same welded stainless construction — it just does not have to be hosed." };
}
