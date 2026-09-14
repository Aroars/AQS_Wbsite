// Per-type conveyor pages at /solutions/conveyors/<family>/<slug>.
// Each entry is one page; the family page and hub link to it when it exists.

import { TODO, type FAQItem, type ImageRef, type SpecRow } from "./conveyors";

export interface ConveyorTypePage {
  family: "belt" | "mdr" | "pallet";
  /** URL segment */
  slug: string;
  /** `ConveyorType.slug` — the anchor on the family page this page expands */
  typeSlug: string;
  h1: string;
  /** ≤ 60 characters, keyword first */
  title: string;
  /** ≤ 155 characters */
  description: string;
  /** The term the page is built around, plus the alias stated once in the definition */
  primaryTerm: string;
  alias?: string;
  /** First sentence: entity + attributes, in plain words */
  definition: string;
  intro: string[];
  whereUsed: { context: string; detail: string }[];
  construction: { title: string; body: string }[];
  /** Rows valued TODO are hidden until AQS supplies them */
  specs: SpecRow[];
  /** Tier to highlight in the protection table */
  ipTier?: string;
  hero: ImageRef;
  secondary?: ImageRef[];
  /** Spotlight slug; the card shows only if that project has a spotlight body */
  relatedProject?: string;
  faq: FAQItem[];
  /** Toolbox page slugs for the "Size It Yourself" strip */
  tools: string[];
}

/* Claims used below are the ones AQS stands behind today: designed to 3-A
   Sanitary Standards (never "Certified"), USDA accepted, FDA-approved contact
   materials, IP69K, −40 °F freezer builds, 24V MDR, continuous TIG welds.
   Widths, lengths, speeds, and loads are TODO until AQS supplies ranges. */

export const conveyorTypePages: ConveyorTypePage[] = [
  {
    family: "belt",
    slug: "radius",
    typeSlug: "radius",
    h1: "Radius, S-Curve & 180° Belt Conveyors",
    title: "Radius, S-Curve & 180° Curved Belt Conveyors | AQS",
    description:
      "Food-grade radius belt conveyors: 45°, 90°, 180° and S-curve turns on one side-flexing belt, TIG-welded stainless frames, IP69K washdown, Intralox or Habasit belting.",
    primaryTerm: "radius belt conveyor",
    alias: "curved belt conveyor",
    definition:
      "A radius belt conveyor (also called a curved belt conveyor) carries product around a turn on a single continuous belt, so a 45°, 90°, 180°, or S-curve path needs no transfer plate, no gap, and no second drive.",
    intro: [
      "AQS builds radius conveyors on continuous TIG-welded 304 or 316 stainless frames with side-flexing modular belt from Intralox or Habasit, or a radius flat belt where the product needs a smooth surface. The frame is sloped to shed water, the guide rails are curved sanitary stainless, and the belt rides on curved UHMW wearstrips — the same construction standard as every other AQS conveyor, designed to 3-A Sanitary Standards with FDA-approved contact materials.",
      "The inside radius is set by the belt's collapse factor, not by the frame, so the tightest turn a line can make depends on the belt AQS selects for the product. That choice, and the pull the drive has to overcome through the turn, is worked in the belt pull calculator below.",
    ],
    whereUsed: [
      { context: "Line reversals", detail: "A 180° turn brings product back alongside the infeed, so a long line fits a short room and one operator can reach both ends." },
      { context: "Wrapping around equipment", detail: "S-curves and 90° turns route product around fillers, checkweighers, and columns without a transfer at every corner." },
      { context: "Mezzanine and packaging returns", detail: "Curved sections connect straight runs on different walls of a packaging area with one belt and one drive." },
      { context: "Tight sanitary footprints", detail: "Where washdown access matters, one curved conveyor replaces two straight conveyors and a transfer that would need its own cleaning." },
    ],
    construction: [
      { title: "Side-flexing belt", body: "Modular side-flexing belt from Intralox or Habasit flexes through the turn while the outside edge is held by the frame; a radius flat belt is used where the product needs a closed surface." },
      { title: "Curved wearstrips and rails", body: "The belt runs on curved UHMW wearstrips machined to the turn, with curved stainless guide rails that keep product on the belt through the corner." },
      { title: "Inside radius by belt", body: "The minimum inside radius is the belt's collapse factor times its width. AQS selects the belt for the product first, then sets the turn." },
      { title: "Welded, sloped frame", body: "Continuous TIG welds on 304 or 316 stainless with sloped frame members so water sheds through the turn instead of pooling on a flat ledge." },
      { title: "Drive at the outfeed", body: "The drive pulls the belt through the turn from the discharge end, keeping the tight side of the belt where the load is and the return path clear for cleaning." },
      { title: "Washdown components", body: "IP65 washdown as standard, IP69K frames and components where the room is hosed at high pressure and temperature; freezer-rated builds to −40 °F are available." },
    ],
    specs: [
      { label: "Turn angles", value: "45°, 90°, 180°, and S-curve (two opposed turns on one belt)" },
      { label: "Inside radius", value: "Set by the belt's collapse factor — engineered per belt and width" },
      { label: "Belt", value: "Side-flexing modular (Intralox, Habasit) or radius flat belt; FDA-approved materials" },
      { label: "Belt width", value: TODO },
      { label: "Length", value: TODO },
      { label: "Belt speed", value: TODO },
      { label: "Load", value: TODO },
      { label: "Frame", value: "304 or 316 stainless, continuous TIG-welded, sloped for drainage, mirror polish" },
      { label: "Temperature", value: "Ambient; freezer-rated build to −40 °F available" },
      { label: "Protection", value: "IP65 washdown standard; IP69K available" },
      { label: "Controls", value: "Gear motor with VFD or One Motion Mag-Drive; Allen-Bradley controls on request" },
    ],
    ipTier: "IP69K",
    hero: { src: "/images/conveyors/curved-conveyor.jpg", alt: "Curved modular belt conveyor on a stainless steel frame rounding a turn in a food plant" },
    secondary: [
      { src: "/images/conveyors/renders/s-curve-radius-belt-conveyor-stainless.png", alt: "Engineering render of a stainless S-curve radius belt conveyor with side-flexing belt and drive at the outfeed", caption: "S-curve: two opposed turns on one continuous belt.", kind: "render" },
      { src: "/images/conveyors/renders/180-degree-radius-belt-conveyor-food-grade.png", alt: "Engineering render of a 180° radius belt conveyor with curved guide rails and a discharge chute", caption: "180° return with curved guide rails and discharge chute.", kind: "render" },
    ],
    faq: [
      { q: "Why use a curve instead of a transfer between two straight conveyors?", a: "A transfer is a gap, a dead plate, and usually a second drive — three things that catch product, collect residue, and need their own cleaning. A radius belt conveyor carries product through the turn on one belt with one drive, so there is nothing to tumble on and nothing extra to wash." },
      { q: "How tight can the turn be?", a: "The minimum inside radius is the belt's collapse factor multiplied by its width. A 12 in side-flexing belt with a collapse factor of 2.2 needs a 26.4 in inside radius. AQS picks the belt for the product first, then sets the turn; the belt pull calculator flags a radius below the belt's minimum." },
      { q: "Can a radius belt conveyor be washdown-rated?", a: "Yes. AQS builds radius conveyors on continuous TIG-welded 304 or 316 stainless frames with sloped members, IP65 washdown components as standard and IP69K where the room is hosed at high pressure, designed to 3-A Sanitary Standards." },
      { q: "Will it run in a freezer?", a: "Yes — freezer-rated builds use low-temperature seals and lubricants and manage condensation where the belt crosses into ambient air, rated to −40 °F." },
    ],
    tools: ["belt-pull-calculator", "conveyor-speed-calculator", "uhmw-wearstrip-span-calculator", "modular-belt-drive-shaft-calculator"],
  },
  {
    family: "belt",
    slug: "incline",
    typeSlug: "incline-decline",
    h1: "Sanitary Incline & Decline Conveyors",
    title: "Incline & Decline Conveyors for Food Processing | AQS",
    description:
      "Sanitary incline and decline conveyors: cleated and sidewall belts, Z-frame and nosebar designs, continuous TIG-welded stainless, IP69K washdown, −40 °F freezer option.",
    primaryTerm: "incline conveyor",
    alias: "decline conveyor",
    definition:
      "An incline conveyor (or decline conveyor, running the other way) moves product between elevations on a cleated, textured, or sidewall belt, with a nosebar or Z-frame transition so product is not dropped at either end.",
    intro: [
      "AQS builds inclines as straight ramps, L-frames with a horizontal infeed, and Z-frames with horizontal infeed and discharge, on continuous TIG-welded 304 or 316 stainless frames designed to 3-A Sanitary Standards. Cleated and sidewall modular belts from Intralox or Habasit carry packaged product and loose bulk product up angles a plain belt cannot hold, and the frame is sloped so washdown water runs off instead of following the belt.",
      "The angle, the cleat height and pitch, and the belt pull through the transitions are the numbers that decide whether the conveyor works. The incline calculator below solves the geometry from the rise and the floor space available; the belt pull calculator sizes the drive.",
    ],
    whereUsed: [
      { context: "Floor to mezzanine", detail: "Lift product from a floor-level packer to an elevated inspection, casing, or palletizing level in the footprint of a ramp." },
      { context: "Freezer tunnel infeed and discharge", detail: "Carry product into and out of spiral and tunnel freezers on a freezer-rated belt with condensation managed at the transition." },
      { context: "Bulk elevators", detail: "Sidewall belts with cleats lift loose product — pieces, granules, frozen product — into hoppers, baggers, and weighers." },
      { context: "Packer infeed at height", detail: "Feed a vertical form-fill-seal or a case packer whose infeed sits above the line, with a horizontal discharge that meters product in." },
    ],
    construction: [
      { title: "Cleat and sidewall selection", body: "Cleat height and pitch are chosen for the product's size and the angle; corrugated sidewalls keep loose product on the belt at steep angles. All belting is FDA-approved." },
      { title: "Z-frame or straight", body: "A Z-frame keeps the infeed and discharge horizontal so product loads and unloads flat; a straight incline or L-frame is shorter where the ends can be angled." },
      { title: "Nosebar transitions", body: "Small-diameter nosebars at the transitions let small product transfer without falling into a gap, on both the infeed and the discharge." },
      { title: "Welded, sloped frame", body: "Continuous TIG welds on 304 or 316 stainless with sloped members and open sides, so the frame drains and the underside of the belt can be reached for cleaning." },
      { title: "Hold-downs and guides", body: "Return-side hold-downs keep a cleated belt tracking through the bends of a Z-frame; sanitary guide rails keep product centred on the incline." },
      { title: "Freezer-rated option", body: "Freezer builds use low-temperature seals and lubricants and manage condensation where the belt crosses from freezer to ambient, rated to −40 °F." },
    ],
    specs: [
      { label: "Configurations", value: "Straight incline, L-frame, Z-frame, decline" },
      { label: "Belt", value: "Cleated or sidewall modular belt (Intralox, Habasit); FDA-approved materials" },
      { label: "Incline angle", value: TODO },
      { label: "Belt width", value: TODO },
      { label: "Rise", value: TODO },
      { label: "Belt speed", value: TODO },
      { label: "Load", value: TODO },
      { label: "Frame", value: "304 or 316 stainless, continuous TIG-welded, sloped for drainage, mirror polish" },
      { label: "Temperature", value: "Ambient; freezer-rated build to −40 °F available" },
      { label: "Protection", value: "IP65 washdown standard; IP69K available" },
      { label: "Controls", value: "Gear motor with VFD; Allen-Bradley controls on request" },
    ],
    ipTier: "IP69K",
    hero: { src: "/images/conveyors/incline-conveyor.jpg", alt: "Stainless steel incline conveyor with cleated belt for positive product control at elevation changes" },
    secondary: [
      { src: "/images/conveyors/full-line.jpg", alt: "Elevated stainless incline conveyor feeding a mezzanine in a food production facility", caption: "Floor-to-mezzanine incline on a packaging line." },
      { src: "/images/conveyors/renders/cleated-incline-z-conveyor-bulk-elevator.png", alt: "Engineering render of a cleated sidewall Z-frame incline conveyor elevating bulk product with a nosebar discharge", caption: "Z-frame bulk elevator with cleated sidewall belt.", kind: "render" },
    ],
    faq: [
      { q: "How steep can an incline conveyor run without cleats?", a: "It depends on the product's friction on the belt — a plain belt holds most packaged product only to a modest angle before it slides. Cleated belts carry product up much steeper angles and sidewall belts take loose product nearly vertical. The incline calculator works the geometry; AQS confirms the belt against the product." },
      { q: "Z-frame or straight incline?", a: "A Z-frame keeps both ends horizontal, so product loads flat off an upstream conveyor and discharges flat into the next machine. A straight incline or L-frame is shorter and cheaper where one end can sit at the angle." },
      { q: "Can it carry loose bulk product?", a: "Yes. Sidewall belts with cleats carry pieces, granules, and frozen product up to hoppers, weighers, and baggers; the belt is selected for the product's density and angle of repose." },
      { q: "Will it run in a freezer?", a: "Yes. Freezer-rated inclines use low-temperature seals and lubricants and manage condensation at the freezer-to-ambient transition, rated to −40 °F." },
    ],
    tools: ["incline-conveyor-calculator", "belt-pull-calculator", "conveyor-motor-sizing-calculator", "conveyor-throughput-calculator"],
  },
  {
    family: "mdr",
    slug: "zones",
    typeSlug: "mdr-zones",
    h1: "24V MDR Zone Conveyors",
    title: "24V MDR Zone Conveyors — Washdown Motorized Roller | AQS",
    description:
      "Stainless 24V MDR conveyors with one motorized roller and drive card per zone: zero-pressure accumulation, PulseRoller washdown rollers, IP69K-capable frames, Allen-Bradley ready.",
    primaryTerm: "24V MDR conveyor",
    alias: "motorized roller conveyor",
    definition:
      "A 24V MDR conveyor (motorized roller conveyor) drives each zone with its own low-voltage roller and local drive card, so cases, trays, and pallets accumulate without touching and only occupied zones draw power.",
    intro: [
      "AQS builds MDR on continuous TIG-welded stainless frames with washdown-rated PulseRoller options, IP67 drive cards, and sealed quick-disconnects, designed to 3-A Sanitary Standards and engineered to IP69K where the room demands it. Zone logic — singulate, slug release, sleep when empty — lives in the drive cards, so the conveyor manages its own traffic and the line PLC only has to say go and stop.",
      "Because there is no line shaft and no chain, a stainless MDR conveyor has no drive train to lubricate and nothing turning in a zone that is empty. That is what makes it the case-handling conveyor of choice for washdown rooms, and it scales: the same architecture moves loaded pallets on heavier hub-motor rollers.",
    ],
    whereUsed: [
      { context: "Case packer discharge", detail: "Accumulate cases behind a labeler or palletizer without back-pressure, so a downstream stop never crushes the case at the front of the queue." },
      { context: "Palletizer infeed", detail: "Singulate and meter cases to a robotic palletizing cell, one zone per case, with the release timed by the cell." },
      { context: "Tote and pallet loops", detail: "Staging, fill, and discharge zones on a pallet circuit, each zone indexing forward on its own drive card." },
      { context: "Warehouse-to-plant transitions", detail: "Bridge a dry warehouse and a washdown room with a conveyor that is rated for the wet side and quiet on the dry side." },
    ],
    construction: [
      { title: "One roller, one card per zone", body: "Each zone has a 24 VDC motorized roller and a local drive card; zones communicate with their neighbours for zero-pressure accumulation and slug release." },
      { title: "PulseRoller washdown rollers", body: "Sealed washdown-rated motorized rollers from PulseRoller, with zinc-coated or stainless carrier rollers to hold off surface rust." },
      { title: "IP67 drive cards and quick-connects", body: "Drive cards and M12 or Meltric connections are sealed for washdown, mounted where they can be reached without tools for replacement." },
      { title: "Welded stainless frame", body: "Continuous TIG welds on 304 stainless with sloped members; IP69K-capable frames and NEMA 4X enclosures where the room is hosed at high pressure." },
      { title: "Logic in the conveyor", body: "Accumulation and release logic run in the cards; the Allen-Bradley PLC handles line control and can report zone status to VeriPak SCADA." },
      { title: "Pallet-capable", body: "Heavier hub-motor rollers and dual-drive zones carry loaded pallets — AQS has built 24V pallet loops moving 1,800 lb loads." },
    ],
    specs: [
      { label: "Drive", value: "24 VDC motorized roller per zone; PulseRoller washdown options" },
      { label: "Zone control", value: "Local drive card per zone; zero-pressure singulation or slug release; sleep when empty" },
      { label: "Roller pitch", value: TODO },
      { label: "Conveyor width", value: TODO },
      { label: "Zone length", value: TODO },
      { label: "Speed", value: TODO },
      { label: "Load per zone", value: TODO },
      { label: "Frame", value: "304 stainless, continuous TIG-welded, sloped for drainage" },
      { label: "Temperature", value: "Ambient; freezer-rated rollers, cards, and sensors available" },
      { label: "Protection", value: "IP65 washdown standard; IP67 drive cards; IP69K-capable frames" },
      { label: "Controls", value: "Allen-Bradley CompactLogix ready; VeriPak SCADA reporting on request" },
    ],
    ipTier: "IP67",
    hero: { src: "/images/conveyors/mdr-tilt-gates.jpg", alt: "Motorized drive roll conveyor with tilt-up gate mechanism for zone-controlled product accumulation" },
    secondary: [
      { src: "/images/conveyors/installed-conveyor.jpg", alt: "Stainless roller conveyor installed in a food plant with washdown-rated drives", caption: "Installed washdown MDR conveyance." },
      { src: "/images/conveyors/renders/24v-mdr-pallet-conveyor-tapered-curve-stainless.png", alt: "Engineering render of a 24V MDR pallet conveyor loop with tapered-roller curves and a stainless control panel", caption: "24V MDR pallet loop with tapered-roller curves — see the tote filling spotlight.", kind: "render" },
    ],
    relatedProject: "stainless-24v-pallet-tote-filling-system",
    faq: [
      { q: "MDR or line-shaft conveyor for a washdown room?", a: "MDR. A line-shaft conveyor has a shaft, belts, and bearings turning under every roller whether or not product is there, all of it collecting water. An MDR conveyor has one sealed roller per zone, runs only where product is, and has no drive train to lubricate." },
      { q: "Can a 24V MDR conveyor carry pallets?", a: "Yes. Heavier hub-motor rollers and dual-drive zones move loaded pallets; AQS has built a stainless 24V pallet loop carrying 1,800 lb totes with one drive card per zone." },
      { q: "Is MDR conveyor washdown-rated?", a: "Yes. AQS builds MDR on continuous TIG-welded stainless frames with washdown-rated PulseRoller options, IP67 drive cards, and sealed connections, with IP69K-capable frames where the room is hosed at high pressure and temperature." },
      { q: "How much power does an MDR conveyor use?", a: "Only occupied zones run, so a long accumulation conveyor draws power in proportion to the product on it rather than its length. Each zone is a low-voltage 24 VDC drive, so the conveyor needs no motor starters or VFDs." },
    ],
    tools: ["mdr-motorized-roller-selection", "accumulation-conveyor-calculator", "line-flow-simulator", "conveyor-throughput-calculator"],
  },
];

export const typePageHref = (p: Pick<ConveyorTypePage, "family" | "slug">) =>
  `/solutions/conveyors/${p.family}/${p.slug}`;

/** By family-page anchor (what the family page and hub know) */
export function getTypePage(family: string, typeSlug: string) {
  const p = conveyorTypePages.find((x) => x.family === family && x.typeSlug === typeSlug);
  return p ? { ...p, href: typePageHref(p) } : undefined;
}

/** By URL segment (what the route knows) */
export function getTypePageBySlug(family: string, slug: string) {
  return conveyorTypePages.find((x) => x.family === family && x.slug === slug);
}

export { TODO };
