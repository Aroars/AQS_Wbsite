// Per-type conveyor pages at /solutions/conveyors/<family>/<slug>.
// Each entry is one page; the family page and hub link to it when it exists.

import { TODO, type FAQItem, type ImageRef, type SpecRow, type VideoRef } from "./conveyors";

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
  /** Omitted when AQS has no photo of the type yet; the page runs single-column */
  hero?: ImageRef;
  secondary?: ImageRef[];
  /** A short loop shown with the secondary images */
  video?: VideoRef;
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
    video: {
      src: "/video/zero-tangent-modular-belt-loop.mp4",
      poster: "/images/conveyors/zero-tangent-modular-belt-loop-poster.jpg",
      alt: "White modular belt running through a zero-tangent radius turn on a sanitary conveyor in a food plant",
      caption: "Zero-tangent modular belt curve running in a washdown plant — one belt, no transfer.",
    },
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
    hero: { src: "/images/conveyors/z-incline-washdown-modular.jpg", alt: "Blue cleated modular belt Z-frame incline conveyor on a stainless frame in a washdown processing room", orientation: "portrait" },
    secondary: [
      { src: "/images/conveyors/incline-conveyor.jpg", alt: "Stainless steel incline conveyor with cleated belt for positive product control at elevation changes", caption: "Cleated belt incline with sanitary guide rails." },
      { src: "/images/conveyors/full-line.jpg", alt: "Elevated stainless incline conveyor feeding a mezzanine in a food production facility", caption: "Floor-to-mezzanine incline on a packaging line." },
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
    hero: { src: "/images/conveyors/mdr-stainless-straight-section.jpg", alt: "Stainless 24V MDR conveyor section with sealed drive card connections in the AQS shop" },
    secondary: [
      { src: "/images/conveyors/mdr-tapered-curve-rollers.jpg", alt: "White tapered rollers of a stainless 24V MDR conveyor curve", caption: "Tapered rollers carry product around the curve without pneumatics." },
      { src: "/images/conveyors/mdr-conveylinx-drive-card.jpg", alt: "PulseRoller ConveyLinx drive card mounted under a stainless MDR conveyor frame with sealed 24V connections", caption: "One sealed drive card per zone, mounted where it can be reached without tools." },
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
  {
    family: "belt",
    slug: "freezer",
    typeSlug: "freezer-arctic",
    h1: "Freezer & Arctic Conveyors (−40 °F)",
    title: "Freezer Conveyors — Arctic-Rated to −40 °F | AQS",
    description:
      "Freezer-rated sanitary conveyors for blast freezers, tunnels, and cold storage: −40 °F seals and lubricants, condensation control at the transition, TIG-welded stainless.",
    primaryTerm: "freezer conveyor",
    alias: "arctic conveyor",
    definition:
      "A freezer conveyor (or arctic conveyor) moves product through and out of sub-zero rooms on components rated for sustained operation to −40 °F, with the freezer-to-ambient transition designed so condensation and frost do not stop the belt.",
    intro: [
      "AQS builds freezer conveyors on the same continuous TIG-welded 304 or 316 stainless frames as every other belt conveyor, designed to 3-A Sanitary Standards, then specifies every moving part for the cold: low-temperature lubricants and seals, freezer-rated motors, drive cards, and photo eyes, and belting that stays flexible at −40 °F. Frost builds on a running belt — the marshmallow line pictured above runs frosted every shift — so the frame is open, sloped, and reachable for a quick de-ice and washdown.",
      "The point where product leaves the freezer is where most freezer conveyors fail: warm, wet air meets a cold belt and the frame sweats onto the floor. AQS manages that transition with drainage geometry and, where the room needs it, insulated frame members that keep ice off the drive.",
    ],
    whereUsed: [
      { context: "Spiral and tunnel freezer discharge", detail: "Carry frozen product out of the freezer and into packaging on a belt that is still running cold, with condensation managed where the room changes." },
      { context: "Blast freezer transport", detail: "Move racks, trays, or loose product inside the blast freezer on conveyors that live at −40 °F around the clock." },
      { context: "Cold storage staging", detail: "Accumulate cases and pallets in the freezer warehouse before shipping on freezer-rated MDR and pallet conveyors." },
      { context: "Ice cream and frozen bakery lines", detail: "Hot product into the tunnel, frozen product out, with belts and cleats chosen for the product at both temperatures." },
    ],
    construction: [
      { title: "Rated to −40 °F", body: "Motors, gearboxes, drive cards, sensors, and belting are specified for sustained sub-zero operation, not derated ambient parts." },
      { title: "Low-temperature seals and lubricants", body: "Bearings and gearboxes use lubricants that stay fluid in the cold; seals stay pliable so they keep water out through freeze–thaw cycles." },
      { title: "Condensation management", body: "Sloped frames and drainage at the freezer-to-ambient transition, with insulated frame options where sweat and ice would otherwise reach the drive." },
      { title: "Frost-tolerant belting", body: "Cleated and flat modular belts from Intralox or Habasit chosen for flexibility and grip at temperature, on nosebars that shed ice." },
      { title: "Welded, open stainless frame", body: "Continuous TIG welds on 304 or 316 stainless, open sides, no closed cavities that can fill with ice — designed to 3-A Sanitary Standards." },
      { title: "Freezer-rated MDR and pallet options", body: "The same cold specification carries into 24V MDR and pallet conveyors for staging cases and pallets inside cold storage." },
    ],
    specs: [
      { label: "Temperature rating", value: "Sustained operation to −40 °F / −40 °C" },
      { label: "Configurations", value: "Straight, incline, Z-frame, radius; MDR and pallet conveyors in freezer-rated builds" },
      { label: "Belt", value: "Freezer-rated flat or cleated modular belt (Intralox, Habasit); FDA-approved materials" },
      { label: "Belt width", value: TODO },
      { label: "Length", value: TODO },
      { label: "Belt speed", value: TODO },
      { label: "Load", value: TODO },
      { label: "Frame", value: "304 or 316 stainless, continuous TIG-welded, sloped for drainage; insulated members optional" },
      { label: "Protection", value: "IP65 washdown standard; IP69K available" },
      { label: "Controls", value: "Freezer-rated motors and sensors; Allen-Bradley controls on request" },
    ],
    ipTier: "IP65",
    hero: { src: "/images/conveyors/freezer-conveyor-marshmallow.jpg", alt: "Frosted blue cleated modular belt at the discharge of a freezer conveyor inside a marshmallow production freezer" },
    relatedProject: "freezer-conveyor-marshmallow-line",
    faq: [
      { q: "What makes a conveyor freezer-rated?", a: "Every moving part is specified for the cold: low-temperature lubricants and seals, freezer-rated motors and drive cards, sensors that read through frost, and belting that stays flexible at −40 °F. A standard washdown conveyor with the same frame will bind, sweat, and ice up." },
      { q: "How do you stop condensation where the belt leaves the freezer?", a: "The transition is designed for it: sloped, drained frame members where warm wet air meets cold steel, and insulated frame options that keep the sweat and ice away from the drive. It is engineered per room, because every transition is different." },
      { q: "Can the belt run frosted?", a: "Yes. A running freezer belt carries frost every shift; the belt and cleats are chosen so frost does not change how they grip the product, and the open frame lets sanitation de-ice and wash it down quickly." },
      { q: "Do you build freezer-rated MDR and pallet conveyors?", a: "Yes. The same cold specification carries into 24V MDR zones and pallet conveyors for staging cases and pallets inside cold storage — AQS has run 24V MDR pallet loops in a 0–20 °F freezer area." },
    ],
    tools: ["belt-pull-calculator", "incline-conveyor-calculator", "conveyor-motor-sizing-calculator", "friction-coefficient-table"],
  },
  {
    family: "mdr",
    slug: "accumulation",
    typeSlug: "accumulation",
    h1: "Zero-Pressure Accumulation Conveyors",
    title: "Zero-Pressure Accumulation Conveyors — ZPA for Food | AQS",
    description:
      "Zero-pressure accumulation conveyors for washdown lines: MDR zones or belt that buffer minutes of production without product contact, sized to your rate and stoppage time.",
    primaryTerm: "accumulation conveyor",
    alias: "ZPA conveyor",
    definition:
      "An accumulation conveyor (zero-pressure accumulation, or ZPA conveyor) buffers product between two machines that do not run at the same speed, holding cases, trays, or pallets in a queue without letting them push on each other.",
    intro: [
      "AQS builds accumulation as 24V MDR zones for cases and pallets — each zone stops its own roller when the zone ahead is full — and as belt or modular-belt accumulation for trays and packages that need a continuous surface. Both run on continuous TIG-welded stainless frames designed to 3-A Sanitary Standards, with washdown-rated PulseRoller options and IP67 drive cards where the room is hosed down.",
      "The buffer is sized in seconds of downstream stoppage at the incoming rate, then turned into feet of conveyor at the product's closed-up pitch. The accumulation calculator below does that arithmetic; the line flow simulator shows what the whole line does when a downstream machine stops.",
    ],
    whereUsed: [
      { context: "Ahead of a case packer or palletizer", detail: "Hold cases through a jam clear or a pallet change so the upstream line never stops." },
      { context: "Between machines of different speeds", detail: "Absorb the difference between a fast filler and a slower labeler, or between two shifts' rates." },
      { context: "Planned stoppages and changeovers", detail: "Give sanitation and changeover crews minutes of runway without shutting down production upstream." },
      { context: "Pallet staging", detail: "Accumulate loaded pallets ahead of a stretch wrapper or forklift pickup so the fill station never waits." },
    ],
    construction: [
      { title: "Zones that manage themselves", body: "Each 24V MDR zone has its own roller, sensor, and drive card; zones talk to their neighbours for singulation or slug release with no PLC code." },
      { title: "Zero pressure by design", body: "A zone stops when the one ahead is occupied, so product queues with a gap and nothing is crushed at the head of the line." },
      { title: "Belt accumulation for trays", body: "Where product needs a continuous surface, low-friction modular belt accumulates against a stop with the belt slipping under the product." },
      { title: "Sized from the stoppage", body: "Buffer time × rate × closed-up pitch = feet of conveyor. AQS sizes it from your worst-case downstream stop, not a catalog length." },
      { title: "Washdown-rated", body: "Continuous TIG-welded stainless frames, PulseRoller washdown rollers, IP67 drive cards, sealed sensors — designed to 3-A Sanitary Standards." },
      { title: "Line integration", body: "Release logic ties into the downstream machine's ready signal; zone status can report to VeriPak SCADA on Allen-Bradley controls." },
    ],
    specs: [
      { label: "Types", value: "24V MDR zone accumulation (cases, pallets); modular belt accumulation (trays, packages)" },
      { label: "Release modes", value: "Singulated (one per zone) or slug (train release), selectable per zone" },
      { label: "Buffer capacity", value: "Sized in seconds of stoppage at the incoming rate — see the accumulation calculator" },
      { label: "Conveyor width", value: TODO },
      { label: "Zone length", value: TODO },
      { label: "Speed", value: TODO },
      { label: "Load per zone", value: TODO },
      { label: "Frame", value: "304 stainless, continuous TIG-welded, sloped for drainage" },
      { label: "Temperature", value: "Ambient; freezer-rated components available" },
      { label: "Protection", value: "IP65 washdown standard; IP67 drive cards; IP69K-capable frames" },
      { label: "Controls", value: "Zone logic in the drive cards; Allen-Bradley CompactLogix ready; VeriPak reporting on request" },
    ],
    ipTier: "IP67",
    hero: { src: "/images/conveyors/accumulation-production.jpg", alt: "Carton accumulation conveyors in a dairy production environment" },
    secondary: [
      { src: "/images/conveyors/eq70-accumulation-dairy.jpg", alt: "EQ70 accumulation conveyor with blue modular belt and stainless guide rails on a washdown dairy production floor", caption: "Belt accumulation on a dairy line." },
      { src: "/images/conveyors/renders/serpentine-accumulation-conveyor-line-layout.png", alt: "Engineering render of a packaging line with a serpentine zero-pressure accumulation section, lane divider, and HMI between the infeed and outfeed", caption: "Serpentine accumulation folds minutes of buffer into a short room.", kind: "render" },
    ],
    faq: [
      { q: "How long does an accumulation conveyor need to be?", a: "Rate × buffer time ÷ 60 × closed-up pitch. Buffering 30 seconds at 40 cases per minute with a 12 in pitch is 20 cases, or 20 ft of conveyor. The accumulation calculator in the toolbox works it from your numbers." },
      { q: "What is zero-pressure accumulation?", a: "A queue in which each product stops before it touches the one ahead. In MDR, each zone stops its own roller when the next zone is occupied; in belt accumulation, a low-friction belt slips under product held against a stop. Either way nothing is crushed at the head of the line." },
      { q: "Singulated or slug release?", a: "Singulated releases one product per zone with a gap, which a labeler or scanner needs. Slug release lets the whole queue move as a train, which is faster into a palletizer. AQS sets it per zone and the downstream machine can switch it." },
      { q: "Is accumulation conveyor washdown-rated?", a: "Yes. AQS builds it on continuous TIG-welded stainless frames with washdown-rated PulseRoller options, IP67 drive cards, and sealed sensors, designed to 3-A Sanitary Standards." },
    ],
    tools: ["accumulation-conveyor-calculator", "line-flow-simulator", "mdr-motorized-roller-selection", "conveyor-speed-calculator"],
  },
  {
    family: "mdr",
    slug: "merge-divert",
    typeSlug: "merge-divert",
    h1: "Merge & Divert Conveyors",
    title: "Merge & Divert Conveyors — Lane Dividers & Sortation | AQS",
    description:
      "Sanitary merge and divert conveyors: combine lines into one case packer or split one line to several destinations with pneumatic or servo diverts, photo-eye tracking, and barcode routing.",
    primaryTerm: "merge and divert conveyor",
    alias: "lane divider",
    definition:
      "A merge and divert conveyor combines several product lanes into one, or splits one line to several destinations, using a lane divider, pusher, or servo divert with photo-eye tracking so every product reaches the right lane.",
    intro: [
      "AQS builds merges and diverts as part of the line, not as a bolt-on sorter: the divert mechanism, its guide rails, and the conveyors on both sides share the same continuous TIG-welded stainless construction designed to 3-A Sanitary Standards, and the routing logic runs on the line's Allen-Bradley PLC with photo-eye tracking from the upstream machine.",
      "Merges hold the gap: after two lines combine, the belt speed or the gap has to change, and the line flow simulator below shows which. Diverts route on a count, a barcode, or a vision result, and the mechanism — pneumatic pusher, servo lane divider, or belt-driven transfer — is chosen for the product's weight, speed, and how gently it has to be handled.",
    ],
    whereUsed: [
      { context: "Multiple lines to one case packer", detail: "Merge two or three packaging lines into a single case packer or palletizer infeed while holding the gap the packer needs." },
      { context: "SKU-based sorting", detail: "Divert cases by barcode or code date to the right palletizer, dock door, or reject lane." },
      { context: "Lane dividing ahead of a packer", detail: "Split one stream into the two or three lanes a multi-lane case packer or tray loader expects." },
      { context: "Reject and inspection lanes", detail: "Pull a failed package off the line after a checkweigher, metal detector, or VeriPak inspection without stopping the belt." },
    ],
    construction: [
      { title: "Divert mechanisms", body: "Pneumatic pushers for light cases at moderate rates, servo lane dividers where the pattern changes every product, belt-driven transfers where product must not be pushed." },
      { title: "Photo-eye tracking", body: "Every product is tracked from the upstream sensor so the divert fires on the product it was meant for, at the belt speed the line is running." },
      { title: "Merge geometry", body: "Merge angle and guide rails set for the product; belt speed or gap recalculated after the merge so nothing collides downstream." },
      { title: "Routing decisions", body: "Count, barcode, vision, or an inspection result from VeriPak — the PLC routes and logs the decision." },
      { title: "Washdown-rated", body: "Continuous TIG-welded stainless frames and guarding, sealed pneumatics and sensors — designed to 3-A Sanitary Standards." },
      { title: "One controls platform", body: "Merge, divert, and the conveyors around them run on the line's Allen-Bradley PLC; no separate sorter controller to integrate." },
    ],
    specs: [
      { label: "Merge types", value: "Angled merge, side-by-side lane merge, alternating merge" },
      { label: "Divert types", value: "Pneumatic pusher, servo lane divider, belt-driven transfer, reject arm" },
      { label: "Routing", value: "Count, barcode, vision, or inspection result" },
      { label: "Rate", value: TODO },
      { label: "Product size and weight", value: TODO },
      { label: "Lanes", value: TODO },
      { label: "Frame", value: "304 or 316 stainless, continuous TIG-welded, sloped for drainage" },
      { label: "Protection", value: "IP65 washdown standard; IP69K available" },
      { label: "Controls", value: "Allen-Bradley CompactLogix; VeriPak SCADA integration on request" },
    ],
    ipTier: "IP65",
    hero: { src: "/images/conveyors/dairy-facility.jpg", alt: "Multi-lane sanitary modular belt conveyors with stainless guide rails merging product in a dairy plant" },
    secondary: [
      { src: "/images/conveyors/renders/serpentine-accumulation-conveyor-line-layout.png", alt: "Engineering render of a packaging line with an inline lane divider station between a serpentine accumulation section and the outfeed", caption: "Inline lane divider between accumulation and the packer.", kind: "render" },
      { src: "/images/conveyors/modular-belt-line.jpg", alt: "Long multi-lane sanitary modular belt line with guide rails staged in the AQS shop", caption: "Multi-lane sanitary line staged before shipment." },
    ],
    faq: [
      { q: "What happens to the gap after a merge?", a: "Two lines' worth of product now share one belt, so either the belt runs faster or the gap closes. AQS sets which one happens for the downstream machine, and the line flow simulator in the toolbox shows the result before anything is built." },
      { q: "Pneumatic or servo divert?", a: "A pneumatic pusher is simple and fast for light cases going to one of two lanes. A servo lane divider positions every product to any lane at high rates with gentle handling, and it changes pattern per SKU without hardware changes." },
      { q: "Can the divert route on an inspection result?", a: "Yes. A VeriPak checkweigher, metal detector, or vision result reaches the PLC before the product reaches the divert, so the failed package is pulled to the reject lane and the event is logged." },
      { q: "Is a merge and divert conveyor washdown-rated?", a: "Yes. The divert mechanism, guarding, and the conveyors around it are continuous TIG-welded stainless with sealed pneumatics and sensors, designed to 3-A Sanitary Standards." },
    ],
    tools: ["line-flow-simulator", "conveyor-speed-calculator", "accumulation-conveyor-calculator", "light-curtain-safety-distance-calculator"],
  },
  {
    family: "pallet",
    slug: "chain",
    typeSlug: "chain",
    h1: "Stainless Chain Pallet Conveyors",
    title: "Stainless Chain Pallet Conveyors — Washdown CDLR | AQS",
    description:
      "Stainless chain conveyors for full pallets, bulk containers, and heavy cases: single-, dual-, and multi-strand, washdown to IP69K, integrated with wrappers, strappers, and palletizers.",
    primaryTerm: "chain pallet conveyor",
    alias: "chain-driven pallet conveyor",
    definition:
      "A chain pallet conveyor (chain-driven pallet conveyor) carries full pallets, bulk containers, and heavy cases on two or more strands of stainless chain, taking the heaviest loads on the line and tolerating rough or damaged pallets that rollers cannot.",
    intro: [
      "AQS builds chain conveyors on continuous TIG-welded stainless frames with stainless chain, designed to 3-A Sanitary Standards for the washdown end of dairy and protein lines where pallets leave the palletizer wet. Single-strand chain handles containers with a flat base; dual- and multi-strand chain carries pallets across their stringers and bridges bad boards.",
      "Chain is the family's heavy lifter: where a 24V MDR pallet loop gives zone control and zero-pressure accumulation, chain conveyors take the transfer from the palletizer, the run to the stretch wrapper, and any pallet that a roller conveyor would not move.",
    ],
    whereUsed: [
      { context: "Palletizer discharge", detail: "Take the finished pallet off a robotic or conventional palletizer and carry its full weight to the wrapper." },
      { context: "Stretch wrapper and strapper infeed", detail: "Index pallets through wrapping and strapping with the handshakes those machines expect." },
      { context: "Bulk containers and totes", detail: "Move combos, bins, and IBC-style containers that have no pallet, on chain that supports them across their base." },
      { context: "Rough pallet handling", detail: "Carry damaged, mixed, or wet pallets that roller conveyors would catch or stall on." },
    ],
    construction: [
      { title: "Strands for the load", body: "Single-strand for flat-bottom containers, dual-strand for standard pallets, multi-strand for wide or bridged loads and pallets of mixed size." },
      { title: "Stainless chain on stainless frame", body: "Chain, sprockets, and wear surfaces in stainless or UHMW, on a continuous TIG-welded 304 or 316 frame designed to 3-A Sanitary Standards." },
      { title: "Washdown drives", body: "Sealed gear motors and IP65 to IP69K components, with drive placement that keeps the motor out of the spray path." },
      { title: "Transfers and turns", body: "Chain-to-roller transfers, pop-up transfers, and turntables where the pallet path changes direction." },
      { title: "Machine handshakes", body: "Wrapper, strapper, labeler, and palletizer signals handled on the line's Allen-Bradley PLC; pallet dispensers integrated on request." },
      { title: "Freezer-rated option", body: "Low-temperature lubricants, seals, and motors for chain conveyors that stage pallets in cold storage." },
    ],
    specs: [
      { label: "Strands", value: "Single, dual, or multi-strand stainless chain" },
      { label: "Loads", value: "Full pallets, bulk containers, heavy cases — the heaviest loads on the line" },
      { label: "Pallet sizes", value: TODO },
      { label: "Capacity", value: TODO },
      { label: "Speed", value: TODO },
      { label: "Length", value: TODO },
      { label: "Frame", value: "304 or 316 stainless, continuous TIG-welded, sloped for drainage" },
      { label: "Temperature", value: "Ambient; freezer-rated build available" },
      { label: "Protection", value: "IP65 washdown standard; IP69K available" },
      { label: "Controls", value: "Allen-Bradley; wrapper, strapper, and palletizer handshakes; VeriPak reporting on request" },
    ],
    ipTier: "IP69K",
    faq: [
      { q: "Chain or roller for a pallet conveyor?", a: "Chain takes the heaviest loads and tolerates rough or wet pallets, so it goes at the palletizer discharge and through the wrapper. Roller and 24V MDR pallet conveyors give zone control and zero-pressure accumulation. Most end-of-line layouts use both." },
      { q: "How many chain strands do I need?", a: "Two for a standard pallet carried across its stringers, one for flat-bottom containers, three or more for wide loads, mixed pallet sizes, or pallets with missing boards." },
      { q: "Can a chain conveyor be washdown-rated?", a: "Yes. Stainless chain and sprockets on a continuous TIG-welded stainless frame with sealed drives from IP65 to IP69K, designed to 3-A Sanitary Standards." },
      { q: "Does it integrate with the stretch wrapper and palletizer?", a: "Yes. The handshakes for the wrapper, strapper, labeler, pallet dispenser, and a KUKA or conventional palletizer run on the line's Allen-Bradley PLC, with VeriPak reporting when the plant wants pallet-level records." },
    ],
    tools: ["conveyor-throughput-calculator", "conveyor-motor-sizing-calculator", "mdr-motorized-roller-selection", "machine-guard-opening-distance"],
  },
  {
    family: "belt",
    slug: "flat-top",
    typeSlug: "flat-top-belt",
    h1: "Sanitary Flat-Top Belt Conveyors",
    title: "Sanitary Flat Belt Conveyors — Food Grade Flat-Top | AQS",
    description:
      "Food-grade flat-top belt conveyors for packaged product: smooth FDA belting on continuous TIG-welded stainless frames, VFD or Mag-Drive speed control, IP69K washdown.",
    primaryTerm: "flat-top belt conveyor",
    alias: "flat belt conveyor",
    definition:
      "A flat-top belt conveyor (flat belt conveyor) carries packaged product on a smooth, continuous belt surface, so cartons, pouches, trays, and bottles ride stable between process stages without the belt itself marking, snagging, or draining the product.",
    intro: [
      "AQS builds flat-top conveyors on continuous TIG-welded 304 or 316 stainless frames designed to 3-A Sanitary Standards, with FDA-approved belting from Intralox, Habasit, or equivalent. The belt runs on UHMW wearstrips or a sanitary slider bed, tensioned at the tail so the drive end stays clean, and the frame is sloped so washdown water leaves instead of pooling under the return.",
      "Flat-top is the general-purpose belt: the choice for anything with a flat base that has to arrive upright and in the same orientation it left. It runs straight, through gentle curves, and up moderate inclines, with speed set by a VFD-driven gear motor or a One Motion Mag-Drive that has no gearbox to leak.",
    ],
    whereUsed: [
      { context: "Packer to inspection", detail: "Carry sealed packages from a thermoformer, flow wrapper, or filler to a checkweigher, metal detector, or VeriPak inspection station." },
      { context: "Between process stages", detail: "General transport of cartons, trays, and pouches anywhere a stable, level surface matters more than drainage." },
      { context: "Bottle and container lines", detail: "Straight runs with adjustable guide rails, including auto-adjusting rails for container changeovers." },
      { context: "Feeding IntelliPak and case packers", detail: "Deliver product to gapping, collation, and case packing at a metered speed." },
    ],
    construction: [
      { title: "Smooth FDA belting", body: "Urethane or PVC flat belts, or a flat-top modular belt where a hinged surface is preferred, from Intralox, Habasit, or equivalent." },
      { title: "Slider bed or wearstrips", body: "The belt rides on a polished stainless slider bed or UHMW wearstrips chosen for the load and the speed." },
      { title: "Tail tensioning", body: "Belt tension is taken at the tail with a sanitary take-up, so the drive stays fixed and the belt tracks true." },
      { title: "Welded, sloped frame", body: "Continuous TIG welds on 304 or 316 stainless with sloped members and open sides for washdown — designed to 3-A Sanitary Standards." },
      { title: "Drive choice", body: "Gear motor with VFD for adjustable speed, or One Motion Mag-Drive: no gearbox, no oil, IP69K sealed." },
      { title: "Guide rails", body: "Sanitary stainless guide rails, fixed or adjustable — including automatic rail adjustment for lines that change container size." },
    ],
    specs: [
      { label: "Belt", value: "Smooth FDA-approved flat belt (urethane, PVC) or flat-top modular belt" },
      { label: "Configurations", value: "Straight, gentle curve, moderate incline or decline" },
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
    hero: { src: "/images/conveyors/flat-top-belt-sanitary.jpg", alt: "Sanitary flat-top belt conveyor with FDA-approved blue urethane belting and TIG-welded stainless steel frame" },
    secondary: [
      { src: "/images/conveyors/flat-top-belt-detail.jpg", alt: "Blue flat belt conveyor with stainless take-up and tensioner at the tail end", caption: "Tail take-up keeps the drive end fixed and the belt tracking." },
      { src: "/images/conveyors/belt-end-motor.jpg", alt: "Drive end of a sanitary flat belt conveyor with sealed motor on a stainless frame", caption: "Sealed drive at the discharge end." },
    ],
    faq: [
      { q: "Flat-top belt or modular belt?", a: "Flat-top for packaged product that must stay upright on a smooth surface: cartons, pouches, trays, bottles. Modular belt where the product is wet, needs grip or drainage, or the path has to curve tightly. Many lines use flat-top between machines and modular through the wet stages." },
      { q: "How is the belt speed set?", a: "A VFD on the gear motor, or a One Motion Mag-Drive hub motor with no gearbox. Either can be recipe-driven from the line PLC so a changeover sets the speed with the product." },
      { q: "Can a flat belt conveyor be washdown-rated?", a: "Yes. Continuous TIG-welded 304 or 316 stainless frames with sloped members, IP65 washdown components as standard and IP69K where the room is hosed at pressure, designed to 3-A Sanitary Standards." },
      { q: "Can the guide rails adjust for different containers?", a: "Yes. AQS builds fixed, hand-adjustable, and automatically adjusting rails; the automatic version resets rail width from the recipe so a bottle change needs no tools." },
    ],
    video: {
      src: "/video/auto-adjusting-rails-loop.mp4",
      poster: "/images/conveyors/auto-adjusting-rails-loop-poster.jpg",
      alt: "Sanitary belt conveyor with automatically adjusting guide rails closing in on a bottle",
      caption: "Auto-adjusting guide rails resetting for a container change.",
    },
    tools: ["conveyor-speed-calculator", "belt-pull-calculator", "conveyor-throughput-calculator", "uhmw-wearstrip-span-calculator"],
  },
  {
    family: "belt",
    slug: "modular",
    typeSlug: "modular-belt",
    h1: "Sanitary Modular Belt Conveyors",
    title: "Modular Belt Conveyors — Food Grade Plastic Modular | AQS",
    description:
      "Sanitary modular plastic belt conveyors: flat, raised-rib, friction-top, and perforated modules from Intralox and Habasit on TIG-welded stainless frames, IP69K washdown, side-flexing curves.",
    primaryTerm: "modular belt conveyor",
    alias: "plastic modular belt conveyor",
    definition:
      "A modular belt conveyor (plastic modular belt conveyor) runs a belt assembled from interlocking plastic modules on hinge rods, so the surface can be flat, raised-rib, friction-top, or perforated, the belt drains and grips, and it can flex sideways through curves.",
    intro: [
      "AQS builds modular belt conveyors on continuous TIG-welded 304 or 316 stainless frames designed to 3-A Sanitary Standards, with sprocket-driven belts from Intralox or Habasit in FDA-approved materials. Because the belt is positively driven by sprockets rather than friction, it tracks itself, runs wet, and comes off in minutes with the hinge rods pulled for a full washdown of the frame.",
      "The module choice is the design: perforated for drainage, raised-rib for transfers and air flow, friction-top for inclines, flat for general transport, and side-flexing for radius turns. AQS picks the belt for the product first, then sets the sprocket pitch, drive, and frame around it.",
    ],
    whereUsed: [
      { context: "Wet and washdown transport", detail: "Product that drips, drains, or is hosed in place — the belt drains and the frame sheds water." },
      { context: "Curved and serpentine paths", detail: "Side-flexing modules carry product through 45°, 90°, 180°, and S-curve turns on one belt." },
      { context: "Transfers and finger plates", detail: "Raised-rib modules mesh with finger transfer plates so small product crosses between conveyors without a gap." },
      { context: "Inclines with grip", detail: "Friction-top and cleated modules carry product up angles a flat belt cannot hold." },
    ],
    construction: [
      { title: "Module selection", body: "Flat, raised-rib, friction-top, perforated, or side-flexing modules from Intralox or Habasit, in FDA-approved acetal, polypropylene, or polyethylene for the product and the temperature." },
      { title: "Sprocket drive", body: "Positively driven by stainless or plastic sprockets on a square shaft, so the belt tracks itself and never depends on friction to move." },
      { title: "Quick belt removal", body: "Pull the hinge rods and the belt lifts off for a full washdown of the wearstrips and frame." },
      { title: "UHMW wearstrips", body: "The belt rides on UHMW carryway and return wearstrips laid out for the load; the wearstrip span calculator sizes them." },
      { title: "Welded, sloped frame", body: "Continuous TIG welds on 304 or 316 stainless with sloped members and open sides — designed to 3-A Sanitary Standards." },
      { title: "Drive choice", body: "Gear motor with VFD or One Motion Mag-Drive hub motor with no gearbox and no oil, IP69K sealed." },
    ],
    specs: [
      { label: "Belt", value: "Plastic modular belt — flat, raised-rib, friction-top, perforated, side-flexing (Intralox, Habasit); FDA-approved materials" },
      { label: "Configurations", value: "Straight, radius, S-curve, incline, Z-frame" },
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
    hero: { src: "/images/conveyors/modular-belt-sanitary.jpg", alt: "Sanitary modular belt conveyor showing interlocking plastic belt modules on stainless steel frame" },
    secondary: [
      { src: "/images/conveyors/modular-clamshell-production.jpg", alt: "Clamshell trays riding a blue modular belt conveyor through a curve with stainless guide rails", caption: "Side-flexing modular belt carrying trays through a curve." },
      { src: "/images/conveyors/modular-belt-conveyor-shop.jpg", alt: "Blue modular belt conveyor on a TIG-welded stainless frame ready to ship from the AQS shop", caption: "Modular belt conveyor ready to ship." },
    ],
    video: {
      src: "/video/zero-tangent-modular-belt-loop.mp4",
      poster: "/images/conveyors/zero-tangent-modular-belt-loop-poster.jpg",
      alt: "White modular belt running through a zero-tangent radius turn on a sanitary conveyor in a food plant",
      caption: "Zero-tangent modular belt curve running in a washdown plant.",
    },
    faq: [
      { q: "Which module do I need?", a: "Perforated for drainage, raised-rib where product transfers over finger plates, friction-top for inclines, flat for general transport, and side-flexing for curves. AQS picks the belt for the product first; the frame and drive follow." },
      { q: "How is a modular belt cleaned?", a: "Pull the hinge rods and the belt lifts off in sections, exposing the wearstrips and the frame. Open module designs also clean in place under washdown, which is why modular belt is the default for wet product." },
      { q: "Does a modular belt need tracking?", a: "No. It is positively driven by sprockets on a square shaft, so it cannot wander the way a friction-driven flat belt can. It does need the right sprocket pitch and wearstrip layout, which AQS sizes for the load." },
      { q: "Can it run through a curve?", a: "Yes. Side-flexing modules carry product through 45°, 90°, 180°, and S-curve turns on one belt; the inside radius is the belt's collapse factor times its width." },
    ],
    tools: ["belt-pull-calculator", "uhmw-wearstrip-span-calculator", "modular-belt-drive-shaft-calculator", "conveyor-speed-calculator"],
  },
  {
    family: "pallet",
    slug: "washdown",
    typeSlug: "washdown-pallet",
    h1: "Washdown Pallet Conveyors",
    title: "Washdown Pallet Conveyors — Stainless Roller & 24V MDR | AQS",
    description:
      "Stainless washdown pallet conveyors for end-of-line food and dairy: 24V MDR and roller pallet conveyance, zero-pressure pallet accumulation, dispensers, wrapper and palletizer integration, IP65 to IP69K.",
    primaryTerm: "washdown pallet conveyor",
    alias: "stainless pallet conveyor",
    definition:
      "A washdown pallet conveyor (stainless pallet conveyor) moves loaded pallets on stainless rollers or 24V motorized-roller zones in rooms that are hosed down, so end-of-line pallet handling gets the same sanitary construction as the rest of the line.",
    intro: [
      "AQS builds pallet conveyors on continuous TIG-welded stainless frames designed to 3-A Sanitary Standards, with sealed drives and components from IP65 to IP69K, NEMA 4X enclosures, and freezer-rated builds for cold storage. On 24V MDR pallet zones each section has its own hub-motor roller and drive card, so pallets accumulate without contact and only occupied zones run — the same architecture as AQS case conveyors, scaled to 1,800 lb loads.",
      "Pallet conveyance is usually the last part of a line to go stainless. AQS treats it as part of the sanitary envelope: tapered-roller curves instead of pneumatic turntables, zone logic in the conveyor, and handshakes to the palletizer, wrapper, strapper, and pallet dispenser on the line's Allen-Bradley PLC.",
    ],
    whereUsed: [
      { context: "Palletizer to wrapper", detail: "Index pallets from a robotic or conventional palletizer through stretch wrapping and strapping in a washdown room." },
      { context: "Tote and pallet filling stations", detail: "Stage, weigh, and discharge pallets around a filling station, with zero-pressure accumulation on both legs." },
      { context: "Dairy and protein end of line", detail: "Pallet handling that gets hosed with the rest of the room instead of being fenced off from it." },
      { context: "Cold storage staging", detail: "Freezer-rated pallet zones that accumulate finished pallets ahead of forklift pickup." },
    ],
    construction: [
      { title: "24V MDR pallet zones", body: "Heavier hub-motor rollers and dual-drive zones with one drive card per zone; zero-pressure accumulation and singulated release built into the conveyor." },
      { title: "Tapered-roller curves", body: "Swept 90° sections with tapered idlers carry pallets around the corner with no pneumatics, and accept pallets fed either side leading." },
      { title: "Stainless rollers and frames", body: "304 stainless frames, continuous TIG-welded, with zinc-coated or stainless rollers to hold off surface rust — designed to 3-A Sanitary Standards." },
      { title: "Sealed drives and enclosures", body: "IP65 to IP69K components, IP67 drive cards, stainless slope-top NEMA 4X enclosures with climate control where the room needs it." },
      { title: "Weighing and stations", body: "Scale zones on weigh modules, densification decks, and dispensers integrated into the loop where the process calls for them." },
      { title: "Machine handshakes", body: "Palletizer, wrapper, strapper, labeler, and dispenser signals handled on the line's Allen-Bradley PLC; VeriPak reporting on request." },
    ],
    specs: [
      { label: "Types", value: "24V MDR pallet zones; stainless roller; chain for the heaviest loads" },
      { label: "Zone control", value: "One hub-motor roller and drive card per zone; zero-pressure accumulation" },
      { label: "Pallet sizes", value: "40\" and 48\" side leading on dual-direction curves; others engineered to order" },
      { label: "Capacity", value: TODO },
      { label: "Speed", value: TODO },
      { label: "Zone length", value: TODO },
      { label: "Frame", value: "304 stainless, continuous TIG-welded, leveling feet with wide adjustment" },
      { label: "Temperature", value: "Ambient; freezer-rated build available (AQS runs 24V pallet loops at 0–20 °F)" },
      { label: "Protection", value: "IP65 washdown standard; IP67 drive cards; IP69K available; NEMA 4X enclosures" },
      { label: "Controls", value: "Allen-Bradley CompactLogix with wrapper, strapper, palletizer, and dispenser handshakes; VeriPak reporting on request" },
    ],
    ipTier: "IP65",
    hero: { src: "/images/conveyors/mdr-pallet-loop-full-system.jpg", alt: "Stainless 24V MDR pallet conveyor loop with tapered-roller curves, a loaded pallet, and a stainless HMI pedestal in the AQS shop" },
    secondary: [
      { src: "/images/conveyors/mdr-pallet-curve-loaded.jpg", alt: "Loaded pallet riding the white tapered rollers of a stainless 24V MDR pallet conveyor curve", caption: "A loaded pallet through the tapered-roller curve." },
      { src: "/images/conveyors/mdr-pallet-section-outdoor.jpg", alt: "Stainless 24V MDR pallet conveyor section with leveling feet and a drive card cable", caption: "One 24V pallet zone with its drive card and leveling feet." },
    ],
    video: {
      src: "/video/mdr-pallet-loop-wrapped-pallet.mp4",
      poster: "/images/conveyors/mdr-pallet-loop-wrapped-pallet-poster.jpg",
      alt: "A stretch-wrapped pallet moving around a stainless 24V MDR pallet conveyor loop",
      caption: "A wrapped pallet indexing through the loop.",
    },
    relatedProject: "stainless-24v-pallet-tote-filling-system",
    faq: [
      { q: "Can a 24V MDR conveyor really carry a loaded pallet?", a: "Yes. Heavier hub-motor rollers and dual-drive zones move 1,800 lb loaded pallets with one drive card per zone; AQS has a seven-zone stainless pallet loop running in a freezer area doing exactly that." },
      { q: "MDR, roller, or chain for pallets?", a: "24V MDR pallet zones give zone control and zero-pressure accumulation with no line shaft; chain takes the heaviest loads and rough pallets at the palletizer discharge. Most end-of-line layouts use MDR or roller through the loop and chain at the transfers." },
      { q: "How do pallets turn a corner?", a: "On swept-radius sections with tapered rollers, driven like any other zone, so the pallet turns 90° without a turntable or pneumatics and can enter 40\" or 48\" side leading." },
      { q: "Is pallet conveyor washdown-rated?", a: "Yes. Continuous TIG-welded stainless frames, sealed drives from IP65 to IP69K, IP67 drive cards, and NEMA 4X enclosures, designed to 3-A Sanitary Standards — and freezer-rated where the room is cold." },
    ],
    tools: ["mdr-motorized-roller-selection", "conveyor-throughput-calculator", "accumulation-conveyor-calculator", "machine-guard-opening-distance"],
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
