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
    /** Visible questions-and-answers on the page, also emitted as FAQPage schema */
    faq?: { q: string; a: string }[]
    /** Slugs of tools worth linking from this page */
    related?: string[]
    /** Unpublished pages render noindex and stay out of the sitemap (thin until data exists) */
    published: boolean
}

export const toolPages: ToolPage[] = [
    {
        slug: 'belt-pull-calculator',
        toolId: 'beltPull',
        title: 'Belt Pull Calculator for Modular Belt Conveyors | AQS',
        description: 'Free belt pull calculator for modular plastic belt conveyors: straight, incline, L, Z, radius and S paths, startup pull, belt check, and drum motor pick.',
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
        faq: [
            { q: 'How is belt pull calculated for a radius or S-conveyor?', a: 'Each turn uses the exact curve solution, T_out = T_in × e^(μθ) plus a rail-drag term (μ × w × r_c / μ_rail)(e^(μθ) − 1), so tension compounds through every turn in sequence. Straight and incline runs add friction (μ × weight per foot × length) and lift (weight × rise). The result is the running pull at the drive, bracketed by a hand-method floor and a width-ratio ceiling.' },
            { q: 'What is startup pull and why is it higher than running pull?', a: 'Startup pull is the running pull multiplied by the static-to-kinetic friction ratio, plus the force to accelerate the moving belt and product mass over the ramp time. Drives are checked on both: continuous torque for running and peak torque for startup, with a peak floor of 1.25 times continuous.' },
            { q: 'How do I pick a drum motor from the belt pull?', a: 'The OneMotion auto-pick names the smallest series whose belt-pull rating at your belt width passes the continuous pull, the peak pull, and the RPM at your belt speed. Enter a manual drum or a sprocket-driven shaft instead to see utilisation for each wear scenario.' },
        ],
        related: ['conveyor-throughput-calculator', 'incline-conveyor-calculator', 'mdr-hub-motor-selection', 'wearstrip-span-calculator', 'modular-belt-specs'],
        published: true,
    },
    {
        slug: 'wearstrip-span-calculator',
        toolId: 'wearstrip',
        title: 'UHMW Wearstrip Span Calculator | AQS Toolbox',
        description: 'Free UHMW wearstrip span calculator: support spacing and end overhang from point-load deflection, washdown temperature knockdown, and creep check.',
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
        faq: [
            { q: 'Why is wearstrip span sized on an operator rather than the product?', a: 'The governing load on a slider-bed rail is a person leaning on the belt: a point load far larger than the distributed belt-plus-product weight. The calculator solves point-load deflection for a rail continuous over its supports, then checks the sustained belt-plus-product load against creep.' },
            { q: 'How far apart can the supports be under UHMW wearstrip?', a: 'It depends on the rail cross-section, the stiffness class you hold, and the temperature. Virgin UHMW loses stiffness in a hot washdown, so the calculator knocks down the flexural modulus before solving the longest span and the end overhang.' },
            { q: 'Can acetal wearstrip run under an acetal belt?', a: 'No. Like-on-like acetal wears quickly, and the material table flags it as never used under an acetal belt. Virgin UHMW, lubricated UHMW, food-grade HDPE, and PET-P are the usual choices.' },
        ],
        related: ['belt-pull-calculator', 'friction-coefficient-chart', 'modular-belt-specs'],
        published: true,
    },
    {
        slug: 'mdr-hub-motor-selection',
        toolId: 'hubmotor',
        title: 'MDR Hub Motor Selection Calculator | AQS Toolbox',
        description: 'Free MDR hub motor selection: torque from belt pull and roller diameter, RPM at belt speed, and the smallest series that fits your tube length.',
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
        faq: [
            { q: 'How much torque does an MDR hub motor need?', a: 'Required torque equals belt pull times the roller pitch radius. The selection applies a 1.5 times thermal safety factor to the continuous torque rating so the motor runs at the duty with margin rather than at its limit.' },
            { q: 'How is the hub motor RPM checked?', a: 'RPM = belt speed × 12 / (π × sprocket or roller diameter). The result has to fall between the series\' minimum RPM and its 60 Hz maximum; outside that band the motor is not offered.' },
            { q: 'Will the hub motor fit my roller length?', a: 'Each series lists a minimum and maximum tube length, and the specs interpolate between them. A roller outside that range does not fit the series, and the tool says so.' },
        ],
        related: ['belt-pull-calculator', 'conveyor-speed-calculator'],
        published: true,
    },
    {
        slug: 'modular-belt-specs',
        toolId: 'beltspecs',
        title: 'Modular Belt Specs Comparison | AQS Toolbox',
        description: 'Compare modular plastic belt specs across brands: pitch, tension rating, weight, minimum radius, collapse factor, and open area.',
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
        title: 'Conveyor Speed Calculator — Belt Speed from PPM | AQS',
        description: 'Free conveyor speed calculator: belt speed in ft/min from packages per minute, product length and gap, or solve for rate or gap. Gap time and transit time.',
        h1: 'Conveyor Speed & Throughput Calculator',
        intro: [
            'How fast does the belt need to run? Enter the rate in packages per minute, the product length, and the gap you want between products, and the calculator gives the belt speed in feet per minute as you type. Pick a different solve-for and it answers the other questions instead: the rate a belt at a known speed delivers, or the gap that speed leaves between products.',
            'Alongside the main result you get pitch, products per foot of belt, packages per hour, and the gap time a downstream device has between products. Add a conveyor length for transit time, or start from the drive: RPM and pulley diameter give the belt speed directly. Send to Belt Pull carries the speed and package weight into the belt pull calculator. For a whole line with splits, merges, dwell stations, rejects, and accumulation, open the Line Flow Simulator — it starts from this same infeed.',
        ],
        howItWorks: [
            'Belt speed (ft/min) = packages per minute × pitch (in) / 12, where pitch = product length + gap.',
            'Rate (packages/min) = belt speed × 12 / pitch; gap = belt speed × 12 / rate − product length.',
            'Products per foot = 12 / pitch; gap time (s) = gap ÷ belt speed; transit time = conveyor length ÷ belt speed.',
            'Belt speed from a drive: ft/min = π × pulley pitch diameter (in) × RPM / 12.',
        ],
        faq: [
            { q: 'How do I calculate conveyor belt speed from packages per minute?', a: 'Belt speed in ft/min = packages per minute × pitch in inches / 12, where pitch is the product length plus the gap between products. At 20 packages per minute with a 12 in product and a 6 in gap the belt runs 30 ft/min.' },
            { q: 'What gap does a given belt speed leave between products?', a: 'Gap = belt speed × 12 / rate − product length. Solve for gap when the belt speed is fixed by the drive and you need the space a downstream device gets between products.' },
            { q: 'How do I get belt speed from motor RPM?', a: 'ft/min = π × pulley or sprocket pitch diameter in inches × RPM / 12. A 6 in pitch diameter at 60 RPM gives about 94 ft/min.' },
        ],
        related: ['conveyor-throughput-calculator', 'belt-pull-calculator', 'line-flow-simulator', 'mdr-hub-motor-selection'],
        published: true,
    },
    {
        slug: 'incline-conveyor-calculator',
        toolId: 'conveyorSpec',
        title: 'Incline Conveyor Calculator — Angle, Length, Rise | AQS',
        description: 'Free incline conveyor calculator: solve length, rise, and angle for straight, incline, L and Z conveyors, with plain-belt limits and cleat advice.',
        h1: 'Incline Conveyor Calculator',
        intro: [
            'Solve the geometry of an incline, L, or Z conveyor from whichever two numbers you know: floor length, height change, angle, or actual belt length. The solver draws the profile, reports total floor and belt length, and tells you when the angle is past what a plain belt will carry for packages or loose product.',
            'When the product is defined on the Belt Load card, the solved path and the product go straight to the belt pull calculator, where a steep bulk incline opens the flight-pocket solver.',
        ],
        howItWorks: [
            'tan θ = rise / floor run; belt length = floor run / cos θ; L and Z add horizontal infeed and discharge legs.',
            'Plain-belt limits: loose product slides back past roughly 20°, packages past roughly 25°; beyond that the belt needs flights or cleats.',
        ],
        related: ['belt-pull-calculator', 'conveyor-throughput-calculator'],
        published: true,
    },
    {
        slug: 'conveyor-throughput-calculator',
        toolId: 'beltLoad',
        title: 'Conveyor Throughput Calculator — lb/hr to PPM | AQS',
        description: 'Free conveyor throughput calculator: lb/hr, lb/day or kg/hr to packages per minute, belt speed, and belt load in lb/ft, plus bulk bed sizing.',
        h1: 'Conveyor Throughput Calculator — lb/hr to Packages per Minute and Belt Load',
        intro: [
            'A plant quotes throughput in the units it thinks in — 15,000 lb/hr, 60,000 lb/day over two shifts, 600 kg/hr — and a conveyor is sized in packages per minute, belt speed, and pounds per foot of belt. This calculator converts between them as you type. Enter any two of line throughput, package weight, and packages per minute and the third fills in; add product length and gap and it estimates the belt speed that carries that rate, or enter belt speed directly. The result is the belt load in lb/ft the belt pull calculator needs, with pitch and products per foot alongside.',
            'Every field solves in both directions. Overwrite a derived number and the calculator releases the oldest value you entered and re-derives it, so the numbers on the card always agree. Bulk mode does the same for loose product: density, bed depth, and belt width give the lb/ft a bed presents at speed, or the depth a demanded rate needs. A packager headroom check compares the required packages per minute with the machine\'s nameplate rate.',
        ],
        howItWorks: [
            'Throughput (lb/min) = packages/min × package weight (lb); lb/hr = lb/min × 60. Per-day and per-shift rates divide by the production hours you enter, not by 24.',
            'Belt speed (ft/min) = packages/min × pitch (in) / 12, where pitch = product length + gap; products per foot = 12 / pitch.',
            'Belt load (lb/ft) = throughput (lb/min) ÷ belt speed (ft/min), which is the same as 12 × package weight ÷ pitch.',
            'Worked example: 15,000 lb/hr at 70 lb per package is 250 lb/min, so 250 ÷ 70 = 3.6 packages/min. At a 24 in product with a 12 in gap (36 in pitch) the belt runs 3.6 × 36 ÷ 12 = 10.7 ft/min and carries 250 ÷ 10.7 = 23.3 lb/ft.',
            'Bulk: lb/ft = density × (bed depth ÷ 12) × ((belt width − 2 × edge margin) ÷ 12); throughput = lb/ft × belt speed.',
            'Send to Belt Pull hands lb/ft and belt speed to the belt pull calculator. Send to Conveyor Speed hands packages per minute, weight, length, and gap to the speed calculator to adjust spacing first.',
        ],
        faq: [
            { q: 'How do I convert lb/hr to packages per minute?', a: 'Divide by 60 to get lb/min, then divide by the package weight. 15,000 lb/hr is 250 lb/min; at 70 lb per package that is 3.6 packages per minute.' },
            { q: 'What is belt load in lb/ft and why does it matter?', a: 'Belt load is the product weight on each foot of belt: throughput in lb/min divided by belt speed in ft/min, which is the same as 12 × package weight ÷ pitch. It is the number the belt pull calculator uses to size the belt and the drive.' },
            { q: 'How is lb/day converted when the line runs two shifts?', a: 'The calculator divides by the production hours you enter, not by 24. 60,000 lb/day over 16 hours is 62.5 lb/min; over 24 hours it would be 41.7 lb/min, a 1.5 times difference in belt load.' },
        ],
        related: ['belt-pull-calculator', 'conveyor-speed-calculator', 'incline-conveyor-calculator', 'line-flow-simulator'],
        published: true,
    },
    {
        slug: 'line-flow-simulator',
        toolId: 'lineFlow',
        title: 'Packaging Line Flow Simulator | AQS Toolbox',
        description: 'Free packaging line flow simulator: chain splits, merges, rejects, dwell stations, stacking and batching, and size accumulation buffers in feet or seconds.',
        h1: 'Line Flow Simulator',
        intro: [
            'Work a packaging line as a chain of cards. The infeed sets packages per minute, product length, gap, and belt speed — the same card as the conveyor speed calculator — and every card after it recalculates the flow downstream: a split or reject removes a share of the product, a merge adds another line\'s flow, a process station\'s dwell time consumes gap at the running speed, and stacking or batching combine several products into one.',
            'The accumulation card sizes a buffer: seconds of downstream stoppage at the incoming rate become feet of zero-pressure accumulation, or a fixed length becomes the seconds it can absorb. That is the number an IntelliPak or MDR accumulation zone is built around. A feasibility flag on each card and on the whole chain catches negative gaps and speeds outside the practical range.',
        ],
        howItWorks: [
            'Accumulation length (ft) = rate (pkg/min) × buffer time (s) / 60 × pitch / 12, at the incoming rate with product closed up.',
            'Merges add flows, splits and rejects remove a percentage, and a process station\'s dwell time consumes gap at the running speed.',
            'After a split or merge, choose whether to keep speed (the gap changes) or keep gap (the speed changes), or specify one directly.',
        ],
        related: ['conveyor-speed-calculator', 'conveyor-throughput-calculator', 'belt-pull-calculator'],
        published: true,
    },
    {
        slug: 'light-curtain-safety-distance-calculator',
        toolId: 'safety',
        section: 'distance',
        title: 'Light Curtain Safety Distance Calculator | AQS',
        description: 'Free light curtain safety distance calculator per ISO 13855: S = K × T + C from stopping time, response time, and detection capability.',
        h1: 'Light Curtain Safety Distance Calculator',
        intro: [
            'How far from the hazard does a light curtain have to be? The answer is the machine\'s total stopping time times the approach speed, plus a penetration allowance that depends on the curtain\'s resolution. This calculator applies the ISO 13855 and OSHA 1910.217 formulas with the standard approach speeds and penetration factors, so the mounting distance is a number rather than a guess.',
        ],
        howItWorks: [
            'S = K × T + C: K = 2000 mm/s for hand and arm approach (1600 mm/s for walking approach), T = machine stopping time plus device response, C = 8 × (d − 14) mm for detection capability d up to 40 mm.',
            'Guard openings and reach-over distances per ISO 13857 are on the same tool under Guard Openings.',
        ],
        faq: [
            { q: 'How is light curtain safety distance calculated?', a: 'S = K × T + C per ISO 13855. K is the approach speed (2000 mm/s for hand and arm approach), T is the total stopping time of the machine plus the response time of the light curtain and its controller, and C = 8 × (d − 14) mm for a detection capability d up to 40 mm.' },
            { q: 'What stopping time should I use?', a: 'The machine\'s measured stopping time plus the light curtain\'s response time and the safety relay or controller reaction. Use a value from a stop-time test on the machine, not the drive\'s nominal figure.' },
            { q: 'When does the approach speed drop to 1600 mm/s?', a: 'ISO 13855 starts with K = 2000 mm/s. If the result exceeds 500 mm, the distance may be recalculated with K = 1600 mm/s, but it can never be less than 500 mm.' },
        ],
        related: ['guard-opening-distance', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'guard-opening-distance',
        toolId: 'safety',
        section: 'guard',
        title: 'Guard Opening Distance Calculator (ISO 13857) | AQS',
        description: 'Free guard opening distance calculator per ISO 13857: safe reach distances through openings for fingers, hands, and arms.',
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
        title: 'M12 & M8 Connector Pinouts Chart | AQS Toolbox',
        description: 'M12 and M8 connector pinouts with A, D and X coding, plus RJ45, DB9 and USB, for PROFINET, EtherNet/IP, EtherCAT, IO-Link and DeviceNet.',
        h1: 'M12 & M8 Connector Pinouts and Protocols',
        intro: ['Pin assignments and coding for the connectors on a packaging line, from M12 industrial Ethernet to M8 IO-Link sensors, in one chart.'],
        related: ['wire-gauge-ampacity-chart', 'electrical-power-calculator'],
        published: true,
    },
    {
        slug: 'pneumatic-cylinder-force-calculator',
        toolId: 'pneumatic',
        title: 'Pneumatic Cylinder Force Calculator | AQS Toolbox',
        description: 'Free pneumatic cylinder force calculator: extend and retract force from bore, rod diameter, and air pressure in psi or bar.',
        h1: 'Pneumatic Cylinder Force Calculator',
        intro: ['Force = pressure × piston area on extend, minus the rod area on retract. Enter bore, rod, and pressure to size a cylinder or check one on a reject or divert.'],
        related: ['air-fitting-thread-chart'],
        published: true,
    },
    {
        slug: 'iso-fit-tolerance-calculator',
        toolId: 'tolerance',
        title: 'ISO Fit Tolerance Calculator — H7, g6, p6 | AQS',
        description: 'Free ISO 286 fit calculator: hole and shaft limits for H7, h6, g6, f7, k6, n6, p6 and more, with clearance, transition and interference fits.',
        h1: 'ISO 286 Hole / Shaft Fit Tolerance Calculator',
        intro: ['Look up the upper and lower deviations for a hole and shaft pair at a nominal size and see whether the result is a clearance, transition, or interference fit.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'wire-gauge-ampacity-chart',
        toolId: 'wiregauge',
        title: 'Wire Gauge & Ampacity Chart (AWG to mm²) | AQS',
        description: 'AWG to mm² wire gauge chart with copper ampacity and voltage drop for THHN, THWN and XHHW conductors.',
        h1: 'Wire Gauge & Ampacity Chart',
        intro: ['AWG to mm² conversions, ampacity by insulation, and voltage drop over a run length for control panel and field wiring.'],
        related: ['electrical-power-calculator', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'bolt-tap-drill-chart',
        toolId: 'bolt',
        title: 'Bolt, Tap & Drill Size Chart — Metric & UNC | AQS',
        description: 'Bolt, tap drill, and clearance hole chart for metric M2 to M30 and UNC #0 to 3/4 in, with pilot and tap sizes.',
        h1: 'Bolt, Tap & Drill Size Chart',
        intro: ['Tap drill, clearance drill, and pilot sizes for common metric and UNC threads.'],
        related: ['iso-fit-tolerance-calculator', 'sheet-metal-gauge-chart'],
        published: true,
    },
    {
        slug: 'sheet-metal-gauge-chart',
        toolId: 'sheetmetal',
        title: 'Sheet Metal Gauge Thickness Chart | AQS Toolbox',
        description: 'Sheet metal gauge to thickness chart in inches and millimeters for steel, stainless, aluminum, and galvanized.',
        h1: 'Sheet Metal Gauge Chart',
        intro: ['Gauge to thickness for the sheet materials a sanitary frame shop uses every day.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'friction-coefficient-chart',
        toolId: 'friction',
        title: 'Coefficient of Friction Chart — Static & Kinetic | AQS',
        description: 'Static and kinetic coefficient of friction chart for steel, aluminum, rubber, plastics, wood and brass, dry and lubricated.',
        h1: 'Friction Coefficient Chart',
        intro: ['Static and kinetic friction for common pairs, the starting point for belt pull and wearstrip calculations.'],
        related: ['belt-pull-calculator', 'wearstrip-span-calculator'],
        published: true,
    },
    {
        slug: 'air-fitting-thread-chart',
        toolId: 'airfitting',
        title: 'Air Fitting Thread Chart — NPT, BSPP, BSPT | AQS',
        description: 'Air fitting and pipe thread chart: NPT, NPTF, BSPP, BSPT and G threads, sealing methods, and push-in tube sizes.',
        h1: 'Air Fittings & Thread Chart',
        intro: ['Thread forms, sizes, and sealing methods for pneumatic fittings and tube.'],
        related: ['pneumatic-cylinder-force-calculator'],
        published: true,
    },
    {
        slug: 'expression-calculator',
        toolId: 'expression',
        title: 'Engineering Expression Calculator | AQS Toolbox',
        description: 'Free engineering expression calculator with variables, chained results, square roots, and trig functions.',
        h1: 'Expression Calculator',
        intro: ['A formula calculator with variables and history for the arithmetic between the other tools.'],
        published: true,
    },
    {
        slug: 'area-calculator',
        toolId: 'area',
        title: 'Area Calculator — Shapes with Running Total | AQS',
        description: 'Free area calculator for rectangles, circles, triangles, ellipses, trapezoids and half circles, with a running total.',
        h1: 'Area Calculator',
        intro: ['Shape areas with a memory total for footprints, guards, and sheet layouts.'],
        published: true,
    },
    {
        slug: 'electrical-power-calculator',
        toolId: 'power',
        title: 'Electrical Power & Panel Load Calculator | AQS',
        description: 'Free electrical power calculator: watts, amps and volts for AC and DC circuits, plus an equipment list that totals a panel load.',
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
