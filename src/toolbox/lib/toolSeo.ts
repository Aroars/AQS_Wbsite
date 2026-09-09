/**
 * Per-tool landing pages under /toolbox/<slug>: title, meta, intro, and a short
 * "how it works" so each tool is a real indexable page. The calculator itself is
 * the same single app; the page just opens it on that tool.
 *
 * Intros state AQS's method in public — keep them accurate to the calculators
 * they describe (lib/calculators/*) and have an engineer read changes.
 */

export interface ToolPage {
    slug: string
    /** Registry tool id the page opens */
    toolId: string
    /** Sub-section inside the tool (charts with tabs) */
    section?: string
    title: string
    description: string
    h1: string
    intro: string[]
    howItWorks?: string[]
    /** Slugs of tools worth linking from this page */
    related?: string[]
    /** Unpublished pages render noindex and stay out of the sitemap (thin until data exists) */
    published: boolean
}

export const toolPages: ToolPage[] = [
    {
        slug: 'belt-pull-calculator',
        toolId: 'beltPull',
        title: 'Conveyor Belt Pull & Drive Calculator — Straight, Incline, Radius & Z | AQS Toolbox',
        description: 'Free conveyor belt pull calculator for modular plastic belts: straight, incline, L, Z, radius and S-conveyors. Turn tension with the capstan effect, startup pull, service factors, belt strength check, and OneMotion drum motor selection.',
        h1: 'Conveyor Belt Pull & Drive Calculator',
        intro: [
            'Size the drive for a modular plastic belt conveyor from the layout you actually have: an infeed run, inclines, straight legs, and any number of turns for radius and S-conveyors. The calculator marches tension along the belt section by section, so a Z conveyor, a 90° radius belt, and a three-turn S path all use the same physics instead of a hand rule.',
            'Enter the product as packages or bulk. Bulk on an incline steeper than a plain belt can hold turns into flight pockets, and the pocket capacity is sized from flight height, pitch, angle of repose, and loose density. Wear scenarios show how the pull grows as wearstrips age, and the result carries a curve edge-capacity screen, a corner speed ceiling, and a per-turn tension table.',
            'The output is a running pull, a startup pull, and continuous and peak torque floors that the OneMotion auto-pick uses to name the smallest drum motor that passes at your belt width and speed. Every assumption the model leans on is listed in the sign-off summary.',
        ],
        howItWorks: [
            'Straight and incline runs: friction = μ × (belt + product weight per foot) × horizontal length; lift = weight × rise. The return path is split into slider and roller segments.',
            'Turns: T_out = T_in · e^(μθ) + (μ · w · r_c / μ_rail)(e^(μθ) − 1), the exact curve solution, with a hand-method floor and a width-ratio ceiling around it.',
            'Startup pull = running pull × static ratio + acceleration of the moving mass over the ramp time.',
            'Service factors are additive (static nose bars, speed over 30 m/min, start-stop duty, bi-directional, elevation); peak torque floor = 1.25 × continuous.',
            'Belt check: running pull against the belt\'s allowable working tension; in-curve tension against the derated curve capacity.',
            'Drive check: vendor belt-pull rating at the belt width for drum motors, torque at the sprocket pitch radius for shaft drives, and RPM against the motor range.',
        ],
        related: ['belt-load-calculator', 'incline-conveyor-calculator', 'mdr-hub-motor-selection', 'wearstrip-span-calculator', 'modular-belt-specs'],
        published: true,
    },
    {
        slug: 'wearstrip-span-calculator',
        toolId: 'wearstrip',
        title: 'UHMW Wearstrip Span Calculator — Deflection, Overhang & Creep | AQS Toolbox',
        description: 'Free wearstrip span calculator for slider-bed conveyors: UHMW, UltraLube, HDPE, acetal and PET-P rails on steel cross-supports. Point-load deflection, derived end overhang, washdown temperature knockdown, and creep check.',
        h1: 'UHMW Wearstrip Span Calculator',
        intro: [
            'Wearstrips under a modular belt are beams on steel cross-supports, and the case that sizes them is not the product load. It is an operator leaning on the belt. This calculator solves the point-load deflection of a rectangular plastic rail continuous over its supports, tells you the longest support spacing that meets your stiffness class, and derives the end overhang you can run before the cantilever tip sags or the rail overstresses at the last support.',
            'Material matters more than most people expect. Virgin UHMW loses stiffness in a hot washdown and creeps under sustained load, so the solver applies a temperature knockdown to the flexural modulus and runs a separate creep stress check on the distributed belt-plus-product load. Lubricated UHMW keeps the stiffness and cuts friction by roughly forty-five percent, which the belt pull calculator picks up directly.',
        ],
        howItWorks: [
            'Continuous over supports: δ_point = P·L³ / (110·E·I) for the operator load and δ_UDL = w·L⁴ / (185·E·I) for belt and product.',
            'End overhang is solved, not entered: the cantilever length whose tip deflection (including back-span rotation) meets the stiffness class, then capped by bending stress at the last support.',
            'Temperature knockdown reduces E for washdown conditions; a creep allowable governs sustained loading.',
            'Material table: virgin UHMW, UltraLube #321, food-grade HDPE, acetal (never under an acetal belt), and PET-P with typical handbook values to verify against the supplier datasheet.',
        ],
        related: ['belt-pull-calculator', 'friction-coefficient-chart', 'modular-belt-specs'],
        published: true,
    },
    {
        slug: 'mdr-hub-motor-selection',
        toolId: 'hubmotor',
        title: 'MDR Hub Motor Selection Chart — Torque, Belt Pull & RPM by Series | AQS Toolbox',
        description: 'Motorized drive roller (MDR) selection chart: OneMotion 45 to 215 series hub motors with continuous and peak torque, belt pull, and RPM interpolated at your belt width. Enter a required torque to get the smallest motor that fits with a thermal safety factor.',
        h1: 'MDR Hub Motor Selection Chart',
        intro: [
            'Hub motors and motorized drive rollers are rated by tube length, so the torque and belt pull a series delivers depend on the width of your conveyor. This chart interpolates each OneMotion series between its minimum and maximum length at the belt width you enter, shows whether the series physically fits, and lists continuous torque, peak torque, belt pull, and speed range side by side.',
            'Type the torque your application needs and the chart recommends the smallest series that meets it with a thermal safety factor, flags near misses, and shows the alternatives. Belt pull for the required torque comes from the belt pull calculator, which can hand its result straight to this selection.',
        ],
        howItWorks: [
            'Specs interpolate linearly between the series\' minimum and maximum tube length; outside that range the motor does not fit.',
            'Required torque = belt pull × roller pitch radius; the recommendation applies a 1.5× thermal safety factor to continuous torque.',
            'RPM = belt speed × 12 / (π × sprocket diameter) is checked against the series\' minimum and 60 Hz RPM.',
        ],
        related: ['belt-pull-calculator', 'conveyor-speed-calculator'],
        published: true,
    },
    {
        slug: 'modular-belt-specs',
        toolId: 'beltspecs',
        title: 'Modular & Flat Belt Comparison Chart — Pitch, Tension, Radius & Speed | AQS Toolbox',
        description: 'Cross-brand modular plastic and flat belt comparison: pitch, thickness, weight, allowable working tension, radius capability and minimum inside radius, curve rating, open area, and speed limits for the belts AQS runs.',
        h1: 'Modular & Flat Belt Comparison Chart',
        intro: [
            'One table for the belts we run across brands, with the numbers that decide a conveyor design side by side: pitch, thickness, weight per square foot, allowable working tension per unit width, whether the belt can turn, its minimum inside radius as a multiple of belt width, curve rating, open area, and vendor speed limits. Enter a belt width and every radius belt shows its minimum inside turn radius.',
            'The chart reads live from the AQS engineering catalog, and any belt in it can be picked inside the belt pull calculator to fill weight, rating, build, collapse factor, and sprocket pitch in one click.',
        ],
        howItWorks: [
            'Minimum inside turn radius = collapse factor × belt width.',
            'Rating = the vendor\'s allowable working tension at room temperature, shown per foot of width or per metre.',
            'Curve capacity = straight rating × the vendor curve fraction, or the toolbox default when the vendor does not publish one.',
        ],
        related: ['belt-pull-calculator', 'wearstrip-span-calculator'],
        published: false,
    },
    {
        slug: 'conveyor-speed-calculator',
        toolId: 'conveyorFlow',
        title: 'Conveyor Speed & Throughput Calculator — PPM, Product Spacing & Accumulation | AQS Toolbox',
        description: 'Free conveyor speed calculator: belt speed from packages per minute and product spacing, throughput through merges, splits, rejects and dwell stations, and accumulation buffer length in feet for a given number of seconds.',
        h1: 'Conveyor Speed & Throughput Calculator',
        intro: [
            'Work a packaging line as a chain of cards: an infeed sets packages per minute, product length, gap, and speed, and every card after it (split, merge, process dwell, reject, accumulation) recalculates the flow downstream. Enter any two of rate, spacing, and speed and the card solves the third, so you can answer "how fast does this belt need to run" and "how much gap does that leave" in the same place.',
            'The accumulation card sizes a buffer: seconds of downstream stoppage at the incoming rate become feet of zero-pressure accumulation, or a fixed length becomes the seconds it can absorb. That is the number an IntelliPak or MDR accumulation zone is built around.',
        ],
        howItWorks: [
            'Belt speed (ft/min) = packages per minute × pitch (in) / 12, where pitch = product length + gap.',
            'Accumulation length (ft) = rate (pkg/min) × buffer time (s) / 60 × pitch / 12, at the incoming rate with product closed up.',
            'Merges add flows, splits and rejects remove a percentage, and a process station\'s dwell time consumes gap at the running speed.',
        ],
        related: ['belt-load-calculator', 'belt-pull-calculator', 'mdr-hub-motor-selection'],
        published: true,
    },
    {
        slug: 'incline-conveyor-calculator',
        toolId: 'conveyorSpec',
        title: 'Incline Conveyor Calculator — Angle, Length, Rise & Z Conveyor Geometry | AQS Toolbox',
        description: 'Free incline conveyor angle calculator: enter any two of floor length, rise, angle, and belt length to solve straight, incline, L, and Z conveyor geometry, with product retention advice and a hand-off to the belt pull calculator.',
        h1: 'Incline Conveyor Calculator',
        intro: [
            'Solve the geometry of an incline, L, or Z conveyor from whichever two numbers you know: floor length, height change, angle, or actual belt length. The solver draws the profile, reports total floor and belt length, and tells you when the angle is past what a plain belt will carry for packages or loose product.',
            'When the product is defined on the Belt Load card, the solved path and the product go straight to the belt pull calculator, where a steep bulk incline opens the flight-pocket solver.',
        ],
        howItWorks: [
            'tan θ = rise / floor run; belt length = floor run / cos θ; L and Z add horizontal infeed and discharge legs.',
            'Plain-belt limits: loose product slides back past roughly 20°, packages past roughly 25°; beyond that the belt needs flights or cleats.',
        ],
        related: ['belt-pull-calculator', 'belt-load-calculator'],
        published: true,
    },
    {
        slug: 'belt-load-calculator',
        toolId: 'beltLoad',
        title: 'Conveyor Belt Load Calculator — lb/hr, Packages per Minute & Bulk Bed Capacity | AQS Toolbox',
        description: 'Free belt load and throughput calculator for packages or bulk product: pounds per hour from packages per minute and piece weight or from lb/day and operating hours, belt loading in lb/ft, and bulk bed capacity from belt width, depth, and loose density.',
        h1: 'Conveyor Belt Load & Throughput Calculator',
        intro: [
            'Turn what the plant quotes into what the conveyor engineer needs. For packages: pounds per hour, pounds per day with real operating hours, or packages per minute times piece weight, giving belt loading in pounds per foot, package pitch, and how hard the packager has to run. For bulk product: a rate by weight or volume with loose density, and a bed capacity check from belt width, bed depth, and edge margin at belt speed.',
            'The definition publishes to the incline calculator and the belt pull calculator, so the product is entered once.',
        ],
        howItWorks: [
            'Belt loading (lb/ft) = lb/hr ÷ (belt speed ft/min × 60).',
            'Packages: lb/hr = packages/min × piece weight × 60; pitch = speed × 12 / packages per minute.',
            'Bulk bed capacity (lb/hr) = (width − 2 × margin) × depth / 144 × loose density × speed × 60.',
        ],
        related: ['conveyor-speed-calculator', 'incline-conveyor-calculator', 'belt-pull-calculator'],
        published: true,
    },
    {
        slug: 'light-curtain-safety-distance-calculator',
        toolId: 'safety',
        section: 'distance',
        title: 'Light Curtain Safety Distance Calculator — ISO 13855 & OSHA 1910.217 | AQS Toolbox',
        description: 'Free light curtain safety distance calculator per ISO 13855 and OSHA 1910.217: minimum distance from the sensing field to the hazard from stopping time, approach speed, and detection capability, with penetration factors.',
        h1: 'Light Curtain Safety Distance Calculator',
        intro: [
            'How far from the hazard does a light curtain have to be? The answer is the machine\'s total stopping time times the approach speed, plus a penetration allowance that depends on the curtain\'s resolution. This calculator applies the ISO 13855 and OSHA 1910.217 formulas with the standard approach speeds and penetration factors, so the mounting distance is a number rather than a guess.',
        ],
        howItWorks: [
            'S = K × T + C: K = 2000 mm/s for hand and arm approach (1600 mm/s for walking approach), T = machine stopping time plus device response, C = 8 × (d − 14) mm for detection capability d up to 40 mm.',
            'Guard openings and reach-over distances per ISO 13857 are on the same tool under Guard Openings.',
        ],
        related: ['guard-opening-distance', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'guard-opening-distance',
        toolId: 'safety',
        section: 'guard',
        title: 'Guard Opening & Reach Distance Calculator — ISO 13857 | AQS Toolbox',
        description: 'Guard opening safety distance per ISO 13857: allowed opening size versus distance to the hazard for fingers, hands, and arms, plus reach-over distances by barrier height and hazard height.',
        h1: 'Guard Opening & Reach Distance (ISO 13857)',
        intro: [
            'A mesh guard is only a guard if the openings are small enough for how close they sit to the hazard. This tool gives the ISO 13857 opening size limits by body part and distance, and the reach-over table for barrier height against hazard height, so fixed guarding is checked before it is fabricated.',
        ],
        related: ['light-curtain-safety-distance-calculator'],
        published: true,
    },
    {
        slug: 'm12-m8-connector-pinouts',
        toolId: 'connector',
        title: 'M12 & M8 Connector Pinouts — Ethernet/IP, PROFINET, IO-Link & DeviceNet | AQS Toolbox',
        description: 'Reference chart of M12 A, B, D and X-coded and M8 connector pinouts for Ethernet/IP, PROFINET, EtherCAT, IO-Link, DeviceNet, and sensor wiring, with RJ45, DB9 and USB pin references.',
        h1: 'M12 & M8 Connector Pinouts and Protocols',
        intro: ['Pin assignments and coding for the connectors on a packaging line, from M12 industrial Ethernet to M8 IO-Link sensors, in one chart.'],
        related: ['wire-gauge-ampacity-chart', 'electrical-power-calculator'],
        published: true,
    },
    {
        slug: 'pneumatic-cylinder-force-calculator',
        toolId: 'pneumatic',
        title: 'Pneumatic Cylinder Force Calculator — Bore, Pressure, Extend & Retract | AQS Toolbox',
        description: 'Pneumatic cylinder force from bore, rod diameter, and air pressure in psi or bar, for extend and retract strokes, with standard bore size references.',
        h1: 'Pneumatic Cylinder Force Calculator',
        intro: ['Force = pressure × piston area on extend, minus the rod area on retract. Enter bore, rod, and pressure to size a cylinder or check one on a reject or divert.'],
        related: ['air-fitting-thread-chart'],
        published: true,
    },
    {
        slug: 'iso-fit-tolerance-calculator',
        toolId: 'tolerance',
        title: 'ISO 286 Fit Tolerance Calculator — H7/g6, Clearance, Transition & Press Fits | AQS Toolbox',
        description: 'Hole and shaft tolerance calculator per ISO 286: limits and fit class for common combinations such as H7/g6, H7/k6, and H7/p6 across nominal sizes.',
        h1: 'ISO 286 Hole / Shaft Fit Tolerance Calculator',
        intro: ['Look up the upper and lower deviations for a hole and shaft pair at a nominal size and see whether the result is a clearance, transition, or interference fit.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'wire-gauge-ampacity-chart',
        toolId: 'wiregauge',
        title: 'Wire Gauge & Ampacity Chart — AWG to mm², Voltage Drop | AQS Toolbox',
        description: 'AWG and metric wire gauge chart with ampacity by insulation type and a voltage drop calculator for panel and field wiring.',
        h1: 'Wire Gauge & Ampacity Chart',
        intro: ['AWG to mm² conversions, ampacity by insulation, and voltage drop over a run length for control panel and field wiring.'],
        related: ['electrical-power-calculator', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'bolt-tap-drill-chart',
        toolId: 'bolt',
        title: 'Bolt, Tap & Drill Size Chart — Metric and Imperial | AQS Toolbox',
        description: 'Tap drill and clearance drill sizes for metric and imperial threads from M3 to M30 and #4 to 3/4 inch.',
        h1: 'Bolt, Tap & Drill Size Chart',
        intro: ['Tap drill, clearance drill, and pilot sizes for common metric and UNC threads.'],
        related: ['iso-fit-tolerance-calculator', 'sheet-metal-gauge-chart'],
        published: true,
    },
    {
        slug: 'sheet-metal-gauge-chart',
        toolId: 'sheetmetal',
        title: 'Sheet Metal Gauge Chart — Steel, Stainless, Aluminum & Galvanized | AQS Toolbox',
        description: 'Sheet metal gauge to thickness chart for steel, stainless steel, aluminum, and galvanized sheet in inches and millimetres.',
        h1: 'Sheet Metal Gauge Chart',
        intro: ['Gauge to thickness for the sheet materials a sanitary frame shop uses every day.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'friction-coefficient-chart',
        toolId: 'friction',
        title: 'Friction Coefficient Chart — Static & Kinetic for Steel, Plastics, Rubber | AQS Toolbox',
        description: 'Static and kinetic coefficients of friction for common material pairs including steel, aluminum, UHMW, rubber, and lubricated surfaces.',
        h1: 'Friction Coefficient Chart',
        intro: ['Static and kinetic friction for common pairs, the starting point for belt pull and wearstrip calculations.'],
        related: ['belt-pull-calculator', 'wearstrip-span-calculator'],
        published: true,
    },
    {
        slug: 'air-fitting-thread-chart',
        toolId: 'airfitting',
        title: 'Air Fitting & Thread Chart — NPT, BSPP, BSPT, Push-In | AQS Toolbox',
        description: 'Pneumatic fitting thread reference: NPT, NPTF, BSPP (G), BSPT (R/Rc) sizes and sealing methods, plus push-in tube sizes.',
        h1: 'Air Fittings & Thread Chart',
        intro: ['Thread forms, sizes, and sealing methods for pneumatic fittings and tube.'],
        related: ['pneumatic-cylinder-force-calculator'],
        published: true,
    },
    {
        slug: 'expression-calculator',
        toolId: 'expression',
        title: 'Engineering Expression Calculator — Formulas with Variables | AQS Toolbox',
        description: 'Evaluate engineering expressions with variables, trig, roots, and a running answer history.',
        h1: 'Expression Calculator',
        intro: ['A formula calculator with variables and history for the arithmetic between the other tools.'],
        published: true,
    },
    {
        slug: 'area-calculator',
        toolId: 'area',
        title: 'Area Calculator — Rectangles, Circles, Triangles & Totals | AQS Toolbox',
        description: 'Area of rectangles, circles, half circles, triangles, ellipses, and trapezoids with a running memory total.',
        h1: 'Area Calculator',
        intro: ['Shape areas with a memory total for footprints, guards, and sheet layouts.'],
        published: true,
    },
    {
        slug: 'electrical-power-calculator',
        toolId: 'power',
        title: 'Electrical Power Calculator — Watts, Amps, Volts & Panel Load | AQS Toolbox',
        description: 'Watts, amps, and volts for AC single and three phase and DC loads, with an equipment list that totals a panel load.',
        h1: 'Electrical Power Calculator',
        intro: ['Power, current, and voltage for single-phase, three-phase, and DC loads, plus a running panel total.'],
        related: ['wire-gauge-ampacity-chart'],
        published: true,
    },
]

export function getToolPage(slug: string): ToolPage | undefined {
    return toolPages.find((t) => t.slug === slug)
}

/** Published pages only — the sitemap and the "more tools" lists use this */
export const publishedToolPages = toolPages.filter((t) => t.published)
