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
    /** The AQS product page this tool sizes or supports */
    product?: { href: string; label: string }
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
        h1: 'Conveyor Belt Pull & Drive Calculator — Straight, Incline, L, Z, Radius & S',
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
            'Worked example, straight run: a 24 in belt weighing 2.4 lb/ft carrying 1 lb/ft of product over a 40 ft carryway at μ = 0.25 needs 0.25 × 3.4 × 40 = 34 lbf on the carryway plus 0.25 × 2.4 × 40 = 24 lbf on a slider-bed return — about 58 lbf running pull before service factors. At 60 ft/min that is 58 × 60 / 33,000 = 0.11 hp at the belt; startup adds the static friction ratio and the acceleration of the moving mass.',
        ],
        faq: [
            { q: 'How is belt pull calculated for a radius or S-conveyor?', a: 'Each turn uses the exact curve solution, T_out = T_in × e^(μθ) plus a rail-drag term (μ × w × r_c / μ_rail)(e^(μθ) − 1), so tension compounds through every turn in sequence. Straight and incline runs add friction (μ × weight per foot × length) and lift (weight × rise). The result is the running pull at the drive, bracketed by a hand-method floor and a width-ratio ceiling.' },
            { q: 'What is startup pull and why is it higher than running pull?', a: 'Startup pull is the running pull multiplied by the static-to-kinetic friction ratio, plus the force to accelerate the moving belt and product mass over the ramp time. Drives are checked on both: continuous torque for running and peak torque for startup, with a peak floor of 1.25 times continuous.' },
            { q: 'How do I pick a drum motor from the belt pull?', a: 'Send to Torque & Motor carries the pulls, speed, and belt width to the drive card, where the OneMotion auto-pick names the smallest series whose belt-pull rating at your belt width passes the continuous pull, the peak pull, and the RPM at your belt speed, and a manual drum or sprocket-driven shaft entry shows utilisation for each wear scenario.' },
        ],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        related: ['conveyor-motor-sizing-calculator', 'modular-belt-drive-shaft-calculator', 'conveyor-throughput-calculator', 'incline-conveyor-calculator', 'mdr-motorized-roller-selection', 'uhmw-wearstrip-span-calculator'],
        published: true,
    },
    {
        slug: 'uhmw-wearstrip-span-calculator',
        toolId: 'wearstrip',
        title: 'UHMW Wearstrip Span Calculator | AQS Toolbox',
        description: 'Free UHMW wearstrip span calculator: support spacing and end overhang from point-load deflection, washdown temperature knockdown, and creep check.',
        h1: 'UHMW Wearstrip Span Calculator — Deflection, Overhang & Creep',
        intro: [
            'Wearstrips under a modular belt are beams on steel cross-supports, and the case that sizes them is not the product load. It is an operator leaning on the belt. This calculator solves the point-load deflection of a rectangular plastic rail continuous over its supports, tells you the longest support spacing that meets your stiffness class, and derives the end overhang you can run before the cantilever tip sags or the rail overstresses at the last support.',
            'Material matters more than most people expect. Virgin UHMW loses stiffness in a hot washdown and creeps under sustained load, so the solver applies a temperature knockdown to the flexural modulus and runs a separate creep stress check on the distributed belt-plus-product load. Lubricated UHMW keeps the stiffness and cuts friction by roughly forty-five percent, which the belt pull calculator picks up directly. Stiffness scales with the cube of rail thickness, so a thicker strip buys far more span than a wider one, and a hot washdown takes part of that back.',
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
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        related: ['belt-pull-calculator', 'friction-coefficient-table', 'modular-belt-comparison-chart'],
        published: true,
    },
    {
        slug: 'mdr-motorized-roller-selection',
        toolId: 'hubmotor',
        title: 'MDR Motorized Drive Roller Selection Chart | AQS',
        description: 'Free MDR motorized drive roller selection chart: torque, belt pull and RPM per OneMotion series at your roller length, and the smallest series that fits.',
        h1: 'MDR Motorized Drive Roller Selection Chart — Torque, Belt Pull, RPM',
        intro: [
            'Motorized drive rollers and hub motors are rated by tube length, so the torque and belt pull a series delivers depend on the width of your conveyor. This chart interpolates each OneMotion series between its minimum and maximum length at the roller length you enter, shows whether the series physically fits, and lists continuous torque, peak torque, belt pull, and speed range side by side.',
            'Worked example: a 24 in roller carrying 60 lbf of belt pull at 100 ft/min on a 1.9 in diameter roller needs 60 × 0.95 = 57 lb·in, about 6.4 N·m, at the roller; with the 1.5× thermal safety factor the series must offer 9.7 N·m continuous, and it has to turn 100 × 12 / (π × 1.9) = 201 rpm within its speed range. Type the torque your application needs and the chart recommends the smallest series that meets it, flags near misses, and shows the alternatives.',
            'Belt pull for the required torque comes from the belt pull calculator, which can hand its result straight to this selection; the Torque & Motor card does the same for shaft-driven belts.',
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
        product: { href: '/solutions/conveyors/mdr', label: 'MDR sanitary conveyors' },
        related: ['belt-pull-calculator', 'conveyor-speed-calculator'],
        published: true,
    },
    {
        slug: 'modular-belt-comparison-chart',
        toolId: 'beltspecs',
        title: 'Modular & Flat Belt Comparison Chart | AQS Toolbox',
        description: 'Compare modular plastic belt specs across brands: pitch, tension rating, weight, minimum radius, collapse factor, and open area.',
        h1: 'Modular & Flat Belt Comparison Chart — Pitch, Tension, Radius, Speed Limits',
        intro: [
            'One table for the modular and flat belts we run, across brands, with the numbers that decide a conveyor design side by side: pitch, thickness, weight per square foot, allowable working tension per unit width, whether the belt can turn, its minimum inside radius as a multiple of belt width, curve rating, open area, and vendor speed limits. Enter a belt width and every radius belt shows its minimum inside turn radius.',
            'Below the table, the sprocket calculator turns a belt pitch and a tooth count into the chordal pitch diameter the drive math needs: PD = pitch / sin(180° / teeth). Worked example: a 50 mm pitch belt on an 11-tooth sprocket has a pitch diameter of 50 / sin(16.36°) = 177.5 mm, about 6.99 in, so at 100 ft/min the shaft turns 54.7 rpm. Fewer teeth means a smaller radius and less torque for the same pull, which is why 10-tooth sprockets are common where the bore allows.',
            'The chart reads live from the AQS engineering catalog, and any belt in it can be picked inside the belt pull calculator to fill weight, rating, build, collapse factor, and sprocket pitch in one click.',
        ],
        howItWorks: [
            'Minimum inside turn radius = collapse factor × belt width.',
            'Rating = the vendor\'s allowable working tension at room temperature, shown per foot of width or per metre.',
            'Curve capacity = straight rating × the vendor curve fraction, or the toolbox default when the vendor does not publish one.',
            'Sprocket pitch diameter = belt pitch / sin(180° / teeth); shaft rpm = belt speed × 12 / (π × PD in inches).',
        ],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        faq: [
            { q: 'How do I find the sprocket pitch diameter for a modular belt?', a: 'Divide the belt pitch by the sine of 180° over the tooth count. A 2 in (50.8 mm) pitch belt on a 12-tooth sprocket has PD = 2 / sin(15°) = 7.73 in. Vendors sometimes dimension sprockets non-chordally, so take the drawing figure when you have one.' },
            { q: 'What is a belt\'s collapse factor?', a: 'The smallest inside turn radius the belt can make, as a multiple of its width. A collapse factor of 2.2 on a 24 in belt means a 52.8 in minimum inside radius. Tighter turns overload the inside edge and hinge rods.' },
            { q: 'What does allowable working tension mean?', a: 'The pull per unit of belt width the vendor rates the belt for in continuous service at room temperature, before curve derating and temperature and chemical factors. The belt pull calculator checks the running pull against it.' },
        ],
        related: ['belt-pull-calculator', 'conveyor-motor-sizing-calculator', 'uhmw-wearstrip-span-calculator'],
        published: false,
    },
    {
        slug: 'conveyor-speed-calculator',
        toolId: 'conveyorFlow',
        title: 'Conveyor Speed Calculator — FPM, Packages per Minute | AQS',
        description: 'Free conveyor speed calculator: belt speed in ft/min from packages per minute, product length and gap, or solve for rate or gap. Gap time and transit time.',
        h1: 'Conveyor Speed & Throughput Calculator — FPM, Packages per Minute, Pitch',
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
        product: { href: '/solutions/conveyors', label: 'Sanitary conveyors by AQS' },
        related: ['conveyor-throughput-calculator', 'belt-pull-calculator', 'line-flow-simulator', 'mdr-motorized-roller-selection'],
        published: true,
    },
    {
        slug: 'incline-conveyor-calculator',
        toolId: 'conveyorSpec',
        title: 'Incline Conveyor Length & Angle Calculator | AQS',
        description: 'Free incline conveyor calculator: solve length, rise, and angle for straight, incline, L and Z conveyors, with plain-belt limits and cleat advice.',
        h1: 'Incline Conveyor Length & Angle Calculator — Straight, L and Z',
        intro: [
            'Solve the geometry of an incline, L, or Z conveyor from whichever two numbers you know: floor length, height change, angle, or actual belt length. The solver draws the profile, reports total floor and belt length, and tells you when the angle is past what a plain belt will carry for packages or loose product.',
            'Worked example: a 10 ft rise over a 30 ft floor run is an 18.4° incline (tan θ = 10 / 30) with a 31.6 ft belt (30 / cos 18.4°). An L layout adds a horizontal infeed leg before the slope; a Z layout adds a discharge leg at the top so the product leaves level, and both legs count toward floor and belt length. On a plain belt, packages start to slide back at roughly 25° and loose product at roughly 20°, so anything steeper is flagged with a note to add cleats, a textured belt, or flights.',
            'When the product is defined on the Line Throughput card, the solved path and the product go straight to the belt pull calculator, where a steep bulk incline opens the flight-pocket solver.',
        ],
        howItWorks: [
            'tan θ = rise / floor run; belt length = floor run / cos θ; L and Z add horizontal infeed and discharge legs.',
            'Plain-belt limits: loose product slides back past roughly 20°, packages past roughly 25°; beyond that the belt needs flights or cleats.',
        ],
        faq: [
            { q: 'How do I calculate the length of an incline conveyor?', a: 'Belt length = floor run / cos θ and rise = floor run × tan θ. A 30 ft run rising 10 ft is an 18.4° incline with a 31.6 ft belt. L and Z layouts add the horizontal infeed and discharge legs to both the floor length and the belt length.' },
            { q: 'What is the maximum angle for an incline conveyor?', a: 'On a plain belt, packages start to slide back at roughly 25° and loose product at roughly 20°, depending on the product\'s friction on the belt surface. Beyond that the belt needs cleats, a textured surface, or flights, which the solver flags at the angle you enter.' },
            { q: 'What is the difference between an L conveyor and a Z conveyor?', a: 'An L conveyor has a horizontal infeed leg followed by the incline. A Z conveyor adds a horizontal discharge leg at the top so the product leaves level, which is what a packer or palletizer usually needs. The solver includes each leg in the floor and belt lengths it reports.' },
        ],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
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
        product: { href: '/solutions/conveyors', label: 'Sanitary conveyors by AQS' },
        related: ['belt-pull-calculator', 'conveyor-speed-calculator', 'incline-conveyor-calculator', 'line-flow-simulator'],
        published: true,
    },
    {
        slug: 'line-flow-simulator',
        toolId: 'lineFlow',
        title: 'Packaging Line Flow Simulator | AQS Toolbox',
        description: 'Free packaging line flow simulator: chain splits, merges, rejects, dwell stations, stacking and batching, and size accumulation buffers in feet or seconds.',
        h1: 'Packaging Line Flow Simulator — Splits, Merges, Accumulation, Rejects',
        intro: [
            'Work a packaging line as a chain of cards. The infeed sets packages per minute, product length, gap, and belt speed — the same card as the conveyor speed calculator — and every card after it recalculates the flow downstream: a split or reject removes a share of the product, a merge adds another line\'s flow, a process station\'s dwell time consumes gap at the running speed, and stacking or batching combine several products into one.',
            'The accumulation card sizes a buffer: seconds of downstream stoppage at the incoming rate become feet of zero-pressure accumulation, or a fixed length becomes the seconds it can absorb. Worked example: at 40 packages per minute with a 12 in product closed up to zero gap, 30 seconds of stoppage is 20 products of buffer, or 20 ft of accumulation conveyor. That is the number an IntelliPak or MDR accumulation zone is built around. A feasibility flag on each card and on the whole chain catches negative gaps and speeds outside the practical range.',
        ],
        howItWorks: [
            'Accumulation length (ft) = rate (pkg/min) × buffer time (s) / 60 × pitch / 12, at the incoming rate with product closed up.',
            'Merges add flows, splits and rejects remove a percentage, and a process station\'s dwell time consumes gap at the running speed.',
            'After a split or merge, choose whether to keep speed (the gap changes) or keep gap (the speed changes), or specify one directly.',
        ],
        faq: [
            { q: 'How long does an accumulation conveyor need to be?', a: 'Length = rate × buffer time / 60 × pitch, where pitch is the product length plus the minimum gap when products close up. Buffering 30 seconds at 40 packages per minute with a 12 in closed-up pitch is 20 products, or 20 ft of conveyor.' },
            { q: 'What happens to the gap after a split or a merge?', a: 'A split or reject removes a share of the flow. Keeping the belt speed opens the gap; keeping the gap lets the belt slow down. A merge does the opposite. Each card lets you choose which to hold, or specify a new speed or gap directly.' },
            { q: 'Why does a process station consume gap?', a: 'A device that holds a product for its dwell time while the belt keeps moving eats into the space behind it. At the running speed the dwell time becomes inches of gap; when it exceeds the gap available, the card flags the station as a bottleneck.' },
        ],
        product: { href: '/solutions/conveyors/mdr', label: 'MDR accumulation conveyors' },
        related: [
            'conveyor-speed-calculator',
            'conveyor-throughput-calculator',
            'accumulation-conveyor-calculator',
            'belt-pull-calculator',
        ],
        published: true,
    },
    {
        slug: 'conveyor-motor-sizing-calculator',
        toolId: 'driveMotor',
        title: 'Conveyor Motor & Gearbox Sizing Calculator | AQS',
        description: 'Free conveyor motor sizing calculator: torque at the sprocket or drum, shaft RPM, hp and kW, standard motor size, and gear ratio from belt pull and speed.',
        h1: 'Conveyor Motor & Gearbox Sizing Calculator — Torque, HP, Gear Ratio',
        intro: [
            'A conveyor drive is sized from the belt pull, not guessed from the belt width. Enter the running pull, the startup pull, and the belt speed — or send them straight from the belt pull calculator — and this card turns them into what the drive has to deliver: torque at the sprocket or drum, shaft speed, power at the belt, the motor size at your drive efficiency, and the gear ratio for the motor speed you plan to use. Give it the sprocket teeth and belt pitch, or a drum diameter, and it does the geometry.',
            'Worked example: 500 lbf of sizing pull at 100 ft/min is 500 × 100 / 33,000 = 1.52 hp at the belt. At 85% drive efficiency the motor needs 1.78 hp, so the next standard size is 2 hp. On a 6 in pitch diameter the shaft turns 100 × 12 / (π × 6) = 63.7 rpm and carries 500 × 3 = 1,500 lb·in (169 N·m); a 1750 rpm motor needs a 27.5:1 reduction. The OneMotion auto-pick then lists every drum motor series at your belt width against the continuous and peak floors, and the manual entry checks a sprocket-driven shaft motor or a drum you already own, scenario by scenario, with an optional cool-ambient allowance.',
            'Send to Drive Shaft carries the pull, torque, belt width, and pitch diameter into the shaft deflection and twist check.',
        ],
        howItWorks: [
            'Power at the belt (hp) = belt pull (lbf) × belt speed (ft/min) / 33,000; kW = hp × 0.746. The motor requirement is that power divided by the drive efficiency, rounded up to a catalog size.',
            'Torque = belt pull × pitch radius; chordal pitch diameter = belt pitch / sin(180° / teeth). N·m = lb·in × 0.113.',
            'Shaft rpm = belt speed × 12 / (π × pitch diameter); gear ratio = motor rpm / shaft rpm.',
            'Drum motors are verdicted on the vendor belt-pull rating at the belt width, with the peak-to-continuous torque ratio for startup, because drum motors are derated below torque ÷ radius.',
            'Worked example: 500 lbf at 100 ft/min → 1.52 hp at the belt, 1.78 hp at the motor, 2 hp standard; 6 in PD → 63.7 rpm, 1,500 lb·in, 27.5:1 from 1750 rpm.',
        ],
        faq: [
            { q: 'How do I calculate conveyor motor horsepower?', a: 'Multiply the belt pull in pounds by the belt speed in feet per minute and divide by 33,000 for the power at the belt, then divide by the drive efficiency (about 0.85 for a gearmotor) and round up to a standard motor size. 500 lbf at 100 ft/min is 1.52 hp at the belt and a 2 hp motor.' },
            { q: 'How do I find the gear ratio for a conveyor?', a: 'Shaft rpm = belt speed × 12 / (π × sprocket pitch diameter). The ratio is the motor speed divided by that shaft speed: a 1750 rpm motor driving a 6 in pitch diameter at 100 ft/min needs 1750 / 63.7 ≈ 27.5:1.' },
            { q: 'Why is a drum motor rated in belt pull rather than torque?', a: 'A drum motor is a gearmotor inside a shell, and its usable pull is limited by heat and gearing rather than by torque ÷ radius. Vendors publish the belt pull at each tube length, so the auto-pick compares your sizing floors with that rating and applies the peak-to-continuous torque ratio for startup.' },
            { q: 'What is the difference between running pull, startup pull, and the sizing floor?', a: 'Running pull is the steady tension at the drive. Startup pull adds the static-friction ratio and the acceleration of the moving mass. The sizing floors are the running pull scaled by the wear scenario and the service factor, and the drive is verdicted on those, not on the bare running number.' },
        ],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        related: ['belt-pull-calculator', 'modular-belt-drive-shaft-calculator', 'mdr-motorized-roller-selection', 'conveyor-speed-calculator'],
        published: true,
    },
    {
        slug: 'modular-belt-drive-shaft-calculator',
        toolId: 'driveShaft',
        title: 'Modular Belt Drive Shaft Deflection & Twist Calculator | AQS',
        description: 'Free modular belt drive shaft calculator: square or round shaft deflection under belt pull, torsional twist, and stress against editable limits.',
        h1: 'Modular Belt Drive Shaft Deflection & Twist Calculator — Square Shaft',
        intro: [
            'The drive shaft on a modular belt conveyor is a beam between its bearings and a torsion bar from the driven end to the far sprocket. Belt pull bends it; drive torque twists it. Too much of either and the sprockets walk, the belt tracks off, and the far side of a wide belt loads late. This calculator solves both for a square or round shaft in stainless or carbon steel from the bearing span, belt width, belt pull, and torque, and shows each against a limit you can edit.',
            'Worked example: a 1.5 in square 304 stainless shaft on a 40 in bearing span carrying 500 lbf of belt pull spread across a 30 in belt deflects 500 × (8 × 40³ − 4 × 40 × 30² + 30³) / (384 × 28,000,000 × 0.422) = 0.044 in, under the 0.10 in guidance. With 1,500 lb·in of torque over the 30 in width it twists 1500 × 30 / (11,200,000 × 0.712) = 0.0056 rad, or 0.32°. The stresses are checked against half the yield strength of the material.',
            'Send from the Torque & Motor card and the pull, torque, belt width, and pitch diameter arrive filled in; change the shaft size or the span and the result updates live.',
        ],
        howItWorks: [
            'Deflection for a load W spread over the belt width w on a bearing span L: δ = W (8L³ − 4L·w² + w³) / (384·E·I). With w = L this is the familiar 5WL³ / 384EI.',
            'Square shaft a: I = a⁴/12, torsion constant J = 0.1406·a⁴, torsional shear τ = T / (0.208·a³). Round shaft d: I = πd⁴/64, J = πd⁴/32.',
            'Twist θ = T·L_t / (G·J) over the torqued length L_t (driven end to far sprocket, the belt width by default), reported in degrees.',
            'Bending stress σ = M·c / I with M = W (2L − w) / 8; combined stress √(σ² + 3τ²) is checked against yield ÷ 2.',
            'Default limits: 0.10 in deflection and 1.0° twist. Both are editable — the belt manufacturer\'s design guide governs.',
        ],
        faq: [
            { q: 'How much can a modular belt drive shaft deflect?', a: 'Belt makers generally limit drive shaft deflection to about 0.10 in (2.5 mm) between bearings so the sprockets stay in line and the belt tracks. The calculator uses that as the editable default; check your belt\'s design guide for the figure it specifies.' },
            { q: 'Why does a square shaft twist matter?', a: 'The driven end of the shaft turns first and the far sprocket lags by the twist angle. On a wide belt that means the far edge is driven late and the belt loads unevenly across its width. Keeping twist under about a degree keeps the sprockets pulling together.' },
            { q: 'Should I use stainless or carbon steel for the shaft?', a: 'Stainless is standard in washdown food plants for corrosion, but 304 is about 4% less stiff and has roughly half the yield strength of cold-drawn 1045, so the same size stainless shaft deflects a little more and reaches its stress limit sooner. The material table carries E, G, and yield for each.' },
            { q: 'What load goes on the shaft?', a: 'The belt pull at the drive: tight side plus slack side. With a catenary take-up the slack side is near zero, so the running pull from the belt pull calculator is the load; add back tension if the return is tensioned.' },
        ],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        related: ['conveyor-motor-sizing-calculator', 'belt-pull-calculator', 'modular-belt-comparison-chart'],
        published: true,
    },
    {
        slug: 'accumulation-conveyor-calculator',
        toolId: 'accumulation',
        title: 'Accumulation Conveyor Length & Buffer Calculator | AQS',
        description: 'Free accumulation conveyor calculator: buffer length in feet for seconds of stoppage, or the time a length absorbs, with zero-pressure zone counts.',
        h1: 'Accumulation Conveyor Length & Buffer Calculator',
        intro: [
            'How long does an accumulation conveyor have to be? Long enough to hold every package that arrives while the machine downstream is stopped. Enter the incoming rate, the product length, and the gap products settle to when they close up, then either the seconds of stoppage you must absorb or the conveyor length you already have. The calculator returns the length in feet or the seconds of buffer, the number of products it holds, the count of zero-pressure zones for an MDR accumulation conveyor, and the time to fill the buffer from empty.',
            'Worked example: 40 packages per minute of a 12 in product that closes up to no gap needs 40 × 30 / 60 = 20 products to cover a 30 second stoppage, so 20 × 12 in = 20 ft of accumulation. If the packages settle with a 2 in gap the pitch is 14 in and the length is 23.3 ft. Products round up for length and down for time so the buffer is never short. A 24 in zone length gives ten zero-pressure zones, and at 60 ft/min the belt fills the 20 ft from empty in 20 seconds.',
            'The same math runs the Accumulation card in the Line Flow Simulator, where it uses the rate that survives the splits, merges, and rejects upstream; here it stands alone, and the Use Conveyor Speed infeed button pulls the rate and product length from the infeed card.',
        ],
        howItWorks: [
            'Accumulated pitch = product length + the gap products settle to when closed up.',
            'Length = ⌈rate (pkg/min) × stoppage (s) / 60⌉ products × pitch. Time = ⌊length / pitch⌋ products / rate × 60.',
            'Zero-pressure zones = ⌈length / zone length⌉; time to fill from empty = length / belt speed.',
            'Worked example: 40 pkg/min, 12 in product, 30 s → 20 products, 20 ft; with a 2 in settled gap → 23.3 ft.',
        ],
        faq: [
            { q: 'How do I size an accumulation conveyor?', a: 'Multiply the incoming rate by the seconds of stoppage you need to absorb, round up to whole products, and multiply by the accumulated pitch (product length plus the settled gap). 40 packages per minute for 30 seconds at a 12 in pitch is 20 products, or 20 ft.' },
            { q: 'What is zero-pressure accumulation?', a: 'An accumulation conveyor whose zones stop individually as product backs up, so packages queue without pushing on each other. Each zone holds one product, so the zone length has to be at least the accumulated pitch, and the zone count is the buffer length divided by the zone length.' },
            { q: 'How long will my existing conveyor buffer?', a: 'Divide its length by the accumulated pitch, round down to whole products, and divide by the rate. A 24 ft conveyor at a 12 in pitch holds 24 products, which is 36 seconds at 40 packages per minute.' },
        ],
        product: { href: '/solutions/conveyors/mdr', label: 'MDR accumulation conveyors' },
        related: ['line-flow-simulator', 'conveyor-speed-calculator', 'mdr-motorized-roller-selection'],
        published: true,
    },
    {
        slug: 'product-giveaway-calculator',
        toolId: 'giveaway',
        title: 'Product Giveaway & Overfill Cost Calculator | AQS',
        description: 'Free product giveaway calculator: what overfill costs per package, hour, and year, and what a checkweigher feedback loop saves, with payback.',
        h1: 'Product Giveaway & Overfill Cost Calculator',
        intro: [
            'Every package filled above its declared weight gives product away, and at line rates a few grams becomes tonnes. This calculator turns your target weight, average actual fill, packages per minute, and running hours into giveaway per package, per hour, per day, and per year, and, with a product cost, into dollars. Enter the tighter overfill a checkweigher-to-filler feedback loop holds and it shows the savings and the payback on the system.',
            'Worked example: a 200 g package running 3 g over at 100 packages per minute, 16 hours a day, 250 days a year fills 24 million packages and gives away 72,000 kg, about 158,700 lb. At $1.50 per lb that is $238,000 a year. Hold the overfill to 1 g with feedback control and the giveaway drops to 24,000 kg, saving roughly $159,000 a year, so a $60,000 checkweigher installation pays back in about four and a half months.',
            'VeriPak watches every checkweigher on the line in real time and can trim the filler target automatically, which is where the number this calculator produces turns into margin.',
        ],
        howItWorks: [
            'Giveaway per package = average actual fill − declared weight; giveaway percentage = that ÷ declared weight.',
            'Packages per year = packages/min × 60 × production hours/day × production days/year; giveaway per year = per package × packages per year.',
            'Cost per year = giveaway (lb) × product cost per lb; savings = the difference against the overfill a feedback loop holds; payback (months) = system cost ÷ annual savings × 12.',
            'Worked example: 200 g target, 203 g actual, 100 pkg/min, 16 h, 250 d, $1.50/lb → 158,700 lb and $238,000 a year; at 1 g overfill, $159,000 saved.',
        ],
        faq: [
            { q: 'What is product giveaway?', a: 'The product a package contains above its declared weight. Fillers run above target to avoid underfills, and every gram of that margin is product sold at zero price. Giveaway is measured by a checkweigher as the average overfill across the run.' },
            { q: 'How much does 1 gram of overfill cost?', a: 'At 100 packages per minute, 16 hours a day and 250 days a year, one gram per package is 24 tonnes a year. Multiply by your product cost per kilogram or pound; at $3.30 per kg that is about $79,000 a year for a single gram.' },
            { q: 'How does a checkweigher reduce giveaway?', a: 'A checkweigher feeding weights back to the filler lets the target sit just above the legal minimum instead of far above it, typically holding overfill at one to two grams. The calculator compares your current overfill with that controlled figure to show the savings and payback.' },
            { q: 'What if the average fill is below the declared weight?', a: 'That is underfill, a compliance problem under weights-and-measures rules rather than giveaway. The calculator flags a negative overfill; the fix is a higher target and a checkweigher rejecting the light packages.' },
        ],
        product: { href: '/solutions/veripak', label: 'VeriPak packaging SCADA' },
        related: ['packaging-line-downtime-cost-calculator', 'conveyor-throughput-calculator'],
        published: true,
    },
    {
        slug: 'packaging-line-downtime-cost-calculator',
        toolId: 'downtime',
        title: 'Packaging Line Downtime Cost Calculator — $/Minute | AQS',
        description: 'Free packaging line downtime cost calculator: cost per minute, shift, and year from lost margin, crew labor, and overhead, and what a reduction is worth.',
        h1: 'Packaging Line Downtime Cost Calculator — $/Minute, $/Shift',
        intro: [
            'What does a stopped packaging line cost? Three things at once: the margin on the units that did not get made, the crew standing at the line, and the overhead the line still carries. This calculator adds them into a cost per minute, then multiplies by the downtime you log per shift and the shifts and days you run for the cost per shift, per day, and per year, and it values the reduction you are targeting.',
            'Worked example: a line making 60 units a minute at $0.50 contribution margin loses $30 a minute in margin. A crew of four at a $25 loaded rate adds $1.67 a minute, and $200 an hour of line overhead adds $3.33, for $35 a minute. Thirty minutes of downtime per shift on two shifts for 250 days is 15,000 minutes, or $525,000 a year. Cutting that downtime by a quarter is worth $131,000 a year, and every point of availability on 8-hour shifts is worth about $84,000.',
            'Where the minutes go matters as much as how many there are. VeriPak alarms shorten the minutes between a fault and a response, and IntelliPak infeeds remove the misfeeds and jams that cause many of them in the first place.',
        ],
        howItWorks: [
            'Lost margin per minute = units per minute × contribution margin per unit.',
            'Labor per minute = crew × loaded labor rate / 60; overhead per minute = line overhead per hour / 60.',
            'Cost per minute = lost margin + labor + overhead; per year = cost per minute × minutes per shift × shifts per day × days per year.',
            'Value of a reduction = per year × reduction %; one availability point = cost per minute × 1% of scheduled 8-hour shift minutes.',
            'Worked example: $35 a minute × 15,000 minutes = $525,000 a year; a 25% reduction is worth $131,250.',
        ],
        faq: [
            { q: 'How do I calculate the cost of downtime per minute?', a: 'Add the contribution margin on the units not produced (units per minute × margin per unit), the crew cost (crew × loaded rate ÷ 60), and any line overhead per minute. A 60-unit-a-minute line at $0.50 margin with four people at $25 an hour and $200 an hour of overhead costs $35 a minute.' },
            { q: 'Should I use revenue or margin per unit?', a: 'Contribution margin. Downtime on a line that can catch up later costs the crew and overhead only; downtime on a sold-out line costs the margin as well. Using revenue overstates the loss because the ingredients not used are not lost.' },
            { q: 'What is a point of availability worth?', a: 'One percent of the scheduled production minutes at the cost per minute. On two 8-hour shifts for 250 days that is 2,400 minutes a year; at $35 a minute one point is worth $84,000.' },
        ],
        product: { href: '/solutions/veripak', label: 'VeriPak packaging SCADA' },
        related: ['product-giveaway-calculator', 'line-flow-simulator'],
        published: true,
    },
    {
        slug: 'light-curtain-safety-distance-calculator',
        toolId: 'safety',
        section: 'distance',
        title: 'Light Curtain Safety Distance Calculator (ISO 13855) | AQS',
        description: 'Free light curtain safety distance calculator per ISO 13855: S = K × T + C from stopping time, response time, and detection capability.',
        h1: 'Light Curtain Safety Distance Calculator (ISO 13855)',
        intro: [
            'How far from the hazard does a light curtain have to be? The answer is the machine\'s total stopping time times the approach speed, plus a penetration allowance that depends on the curtain\'s resolution. This calculator applies the ISO 13855 and OSHA 1910.217 formulas with the standard approach speeds and penetration factors, so the mounting distance is a number rather than a guess.',
            'Worked example: a machine that stops 250 ms after the stop signal, protected by a curtain with a 20 ms response time, has T = 0.27 s. With a 14 mm resolution curtain the penetration allowance C is zero, so S = 2000 mm/s × 0.27 s = 540 mm. Swap in a 30 mm resolution curtain and C = 8 × (30 − 14) = 128 mm, so S = 668 mm. Because the first result is over 500 mm, ISO 13855 allows a recalculation at 1600 mm/s, but never below 500 mm. Use a measured stop time from a stop-time test, not the drive\'s nominal figure.',
            'The same tool carries the ISO 13857 guard opening and reach-over tables, an e-stop reference, clearance distances, a PLr risk assessment guide, and a noise exposure calculator, so a robotic cell or an inspection station can be checked in one place.',
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
        product: { href: '/solutions/robotics', label: 'Sanitary robotic cells' },
        related: ['machine-guard-opening-distance', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'machine-guard-opening-distance',
        toolId: 'safety',
        section: 'guard',
        title: 'Machine Guard Opening Distance Chart (ISO 13857) | AQS',
        description: 'Machine guard opening distance chart per ISO 13857: safe reach through slots and square openings by body part, reach-over tables, and a PLr reference.',
        h1: 'Machine Guard Opening Distance Chart (ISO 13857) & PLr Reference',
        intro: [
            'A mesh guard is only a guard if the openings are small enough for how close they sit to the hazard. This tool gives the ISO 13857 opening size limits by body part and distance, and the reach-over table for barrier height against hazard height, so fixed guarding is checked before it is fabricated.',
        ],
        product: { href: '/solutions/robotics', label: 'Sanitary robotic cells' },
        related: ['light-curtain-safety-distance-calculator'],
        published: true,
    },
    {
        slug: 'm12-m8-connector-pinouts',
        toolId: 'connector',
        title: 'M12, M8, RJ45 & DB9 Connector Pinouts | AQS Toolbox',
        description: 'M12 A, D and X-coded, M8, RJ45, DB9 and USB pinouts for PROFINET, EtherNet/IP, EtherCAT, IO-Link, DeviceNet and Modbus on one chart.',
        h1: 'M12, M8, RJ45 & DB9 Connector Pinouts — Ethernet/IP, PROFINET, IO-Link',
        intro: [
            'Pin assignments and coding for the connectors on a packaging line, in one chart. M12 A-coded for sensors, actuators, IO-Link and DeviceNet; M12 D-coded for 100 Mbit industrial Ethernet, which is what PROFINET, EtherNet/IP and EtherCAT run on at the device; M12 X-coded for gigabit Ethernet; M8 for compact sensors and IO-Link; and RJ45, DB9 and USB for the panel side.',
            'The coding is the keyway that stops the wrong plug from mating, and it is the first thing to check when a drop cable does not fit. Worked example: an IO-Link sensor on an A-coded M12 uses pin 1 for L+ (24 V), pin 3 for L− (0 V) and pin 4 for C/Q, the communication line; a D-coded Ethernet drop uses pin 1 TX+, pin 2 RX+, pin 3 TX− and pin 4 RX−, and the same cable serves PROFINET and EtherNet/IP because the protocol lives in the controller, not the connector.',
            'The chart is the reference our controls engineers use when wiring VeriPak device networks: checkweighers, metal detectors, OneMotion drives and IO-Link sensors on one Allen-Bradley backbone.',
        ],
        faq: [
            { q: 'What is the difference between A-coded, D-coded and X-coded M12 connectors?', a: 'The coding is the keyway that stops the wrong plug from mating. A-coded carries sensors, actuators, DeviceNet and IO-Link; D-coded is 4-pin 100 Mbit industrial Ethernet for PROFINET, EtherNet/IP and EtherCAT; X-coded is 8-pin gigabit Ethernet.' },
            { q: 'Which pins does IO-Link use on an M12 or M8 connector?', a: 'IO-Link uses the standard A-coded sensor pinout: pin 1 is L+ (24 V), pin 3 is L− (0 V) and pin 4 is C/Q, the communication line. Pin 2 is a second input or output on Class A ports; on Class B ports pins 2 and 5 carry the separate actuator supply.' },
            { q: 'Can the same M12 cable be used for PROFINET and EtherNet/IP?', a: 'Yes, for 100 Mbit links. Both use the same 4-pin D-coded pinout: pin 1 TX+, pin 2 RX+, pin 3 TX−, pin 4 RX−. The protocols differ in the controller and the device firmware, not in the connector or the cable.' },
        ],
        product: { href: '/solutions/veripak', label: 'VeriPak packaging SCADA' },
        related: [
            'wire-gauge-ampacity-chart',
            'panel-load-kw-to-amps-calculator',
            'light-curtain-safety-distance-calculator',
        ],
        published: true,
    },
    {
        slug: 'pneumatic-cylinder-force-calculator',
        toolId: 'pneumatic',
        title: 'Pneumatic Cylinder Force Calculator — Bore, Rod, PSI | AQS',
        description: 'Free pneumatic cylinder force calculator: extend and retract force from bore, rod diameter, and air pressure in psi or bar.',
        h1: 'Pneumatic Cylinder Force Calculator — Bore, Rod, PSI & Bar',
        intro: ['Force = pressure × piston area on extend, minus the rod area on retract. Enter bore, rod, and pressure to size a cylinder or check one on a reject or divert.'],
        related: ['pipe-thread-air-fitting-reference'],
        published: true,
    },
    {
        slug: 'iso-fit-tolerance-calculator',
        toolId: 'tolerance',
        title: 'ISO 286 Hole & Shaft Fit Tolerance Calculator | AQS',
        description: 'Free ISO 286 fit calculator: hole and shaft limits for H7, h6, g6, f7, k6, n6, p6 and more, with clearance, transition and interference fits.',
        h1: 'ISO 286 Hole & Shaft Fit Tolerance Calculator — H7, g6, k7, p6',
        intro: ['Look up the upper and lower deviations for a hole and shaft pair at a nominal size and see whether the result is a clearance, transition, or interference fit.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'wire-gauge-ampacity-chart',
        toolId: 'wiregauge',
        title: 'AWG Wire Gauge & Ampacity Chart — THHN, XHHW | AQS',
        description: 'AWG to mm² wire gauge chart with copper ampacity and voltage drop for THHN, THWN and XHHW conductors.',
        h1: 'AWG Wire Gauge & Ampacity Chart — THHN, XHHW, Voltage Drop',
        intro: ['AWG to mm² conversions, ampacity by insulation, and voltage drop over a run length for control panel and field wiring.'],
        related: ['panel-load-kw-to-amps-calculator', 'm12-m8-connector-pinouts'],
        published: true,
    },
    {
        slug: 'bolt-tap-drill-chart',
        toolId: 'bolt',
        title: 'Bolt, Tap Drill & Clearance Hole Chart | AQS Toolbox',
        description: 'Bolt, tap drill, and clearance hole chart for metric M2 to M30 and UNC #0 to 3/4 in, with pilot and tap sizes.',
        h1: 'Bolt, Tap Drill & Clearance Hole Chart — Metric & Imperial',
        intro: ['Tap drill, clearance drill, and pilot sizes for common metric and UNC threads.'],
        related: ['iso-fit-tolerance-calculator', 'sheet-metal-gauge-chart'],
        published: true,
    },
    {
        slug: 'sheet-metal-gauge-chart',
        toolId: 'sheetmetal',
        title: 'Sheet Metal Gauge to Thickness Chart | AQS Toolbox',
        description: 'Sheet metal gauge to thickness chart in inches and millimeters for steel, stainless, aluminum, and galvanized.',
        h1: 'Sheet Metal Gauge to Thickness Chart — Steel, Stainless, Aluminum',
        intro: ['Gauge to thickness for the sheet materials a sanitary frame shop uses every day.'],
        related: ['bolt-tap-drill-chart'],
        published: true,
    },
    {
        slug: 'friction-coefficient-table',
        toolId: 'friction',
        title: 'Coefficient of Friction Table — Steel, UHMW, Rubber | AQS',
        description: 'Static and kinetic coefficient of friction table for steel, UHMW, rubber, plastics, aluminum, wood and brass, dry and lubricated.',
        h1: 'Coefficient of Friction Table — Steel, UHMW, Rubber, Plastics',
        intro: ['Static and kinetic friction for common pairs, the starting point for belt pull and wearstrip calculations.'],
        product: { href: '/solutions/conveyors/belt', label: 'Sanitary belt conveyors' },
        related: ['belt-pull-calculator', 'uhmw-wearstrip-span-calculator'],
        published: true,
    },
    {
        slug: 'pipe-thread-air-fitting-reference',
        toolId: 'airfitting',
        title: 'NPT, BSPP & BSPT Pipe Thread Reference | AQS Toolbox',
        description: 'Air fitting and pipe thread chart: NPT, NPTF, BSPP, BSPT and G threads, sealing methods, and push-in tube sizes.',
        h1: 'NPT, BSPP & BSPT Pipe Thread Reference — Air Fittings',
        intro: ['Thread forms, sizes, and sealing methods for pneumatic fittings and tube.'],
        related: ['pneumatic-cylinder-force-calculator'],
        published: true,
    },
    {
        slug: 'engineering-expression-calculator',
        toolId: 'expression',
        title: 'Scientific Expression Calculator | AQS Toolbox',
        description: 'Free engineering expression calculator with variables, chained results, square roots, and trig functions.',
        h1: 'Scientific Expression Calculator',
        intro: ['A formula calculator with variables and history for the arithmetic between the other tools.'],
        published: true,
    },
    {
        slug: 'area-calculator',
        toolId: 'area',
        title: 'Area Calculator — Rectangles, Circles, Trapezoids | AQS',
        description: 'Free area calculator for rectangles, circles, triangles, ellipses, trapezoids and half circles, with a running total.',
        h1: 'Area Calculator — Rectangles, Circles, Trapezoids',
        intro: ['Shape areas with a memory total for footprints, guards, and sheet layouts.'],
        published: true,
    },
    {
        slug: 'panel-load-kw-to-amps-calculator',
        toolId: 'power',
        title: 'Panel Load & kW-to-Amps Calculator | AQS Toolbox',
        description: 'Free panel load and kW-to-amps calculator: supply amps from total watts at single- or three-phase voltage, with an equipment list that totals the load.',
        h1: 'Panel Load & kW-to-Amps Calculator — Single & Three Phase',
        intro: ['Power, current, and voltage for single-phase, three-phase, and DC loads, plus a running panel total.'],
        product: { href: '/solutions/veripak', label: 'VeriPak packaging SCADA' },
        related: ['wire-gauge-ampacity-chart'],
        published: true,
    },
]

export function getToolPage(slug: string): ToolPage | undefined {
    return toolPages.find((t) => t.slug === slug)
}

/** Published pages only — the sitemap and the "more tools" lists use this */
export const publishedToolPages = toolPages.filter((t) => t.published)
