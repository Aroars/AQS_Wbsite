/**
 * Help panel content — one entry per tab, expanded from the title strip above
 * the tabs. Tab-level text says what the tab is for; tool entries walk through
 * the calculators that need more than their labels to use well.
 */
import type { TabId } from './types'

export interface ToolHelp {
    /** Registry tool id (or a chart id) */
    id: string
    label: string
    summary: string
    steps: string[]
    notes?: string[]
}

export interface TabHelp {
    title: string
    description: string
    tips: string[]
    tools: ToolHelp[]
}

export const tabHelp: Record<TabId, TabHelp> = {
    home: {
        title: 'Home',
        description:
            'Your workbench. The converters you keep, plus any calculator or chart you pin, in one place. Everything is saved in this browser — no login — so a pinned belt pull setup is still there next week on the same machine.',
        tips: [
            'Pin any calculator or chart with the pin icon in its title bar; unpin it here or there.',
            'Move pinned cards up or down with the arrows that appear on hover — the order is yours.',
            'Press ⌘K (Ctrl K on Windows) anywhere to jump to a tool, a bolt size, a thread, a wire gauge, or a fit class by name.',
            'Each tool also has its own address, such as /toolbox/belt-pull-calculator, that opens the toolbox on that tool. The address bar follows you as you switch tools, so a link you copy lands where you were.',
        ],
        tools: [],
    },
    convert: {
        title: 'Convert',
        description:
            'Unit converters across length, mass, force, pressure, flow, temperature, speed, torque, and more. Add as many as you like; each one remembers its last pair of units.',
        tips: [
            'Type in either box — conversion runs both ways.',
            'Duplicate a converter to compare two unit pairs side by side; delete the ones you never use.',
            'Categories with odd scales (temperature, gauge pressure) convert by formula, not by factor.',
        ],
        tools: [],
    },
    calculators: {
        title: 'Calculators',
        description: 'Plant economics and general engineering arithmetic: product giveaway and line downtime cost, an expression calculator with variables, an area calculator with a running memory, and a panel-load calculator.',
        tips: ['The expression calculator keeps a history; "ans" is always the previous result.'],
        tools: [
            {
                id: 'giveaway',
                label: 'Product Giveaway Calculator',
                summary: 'What overfill costs per package, per hour, and per year, and what a checkweigher feedback loop saves.',
                steps: [
                    'Enter the declared weight and the average actual fill in the same unit, the packages per minute, and the hours and days the line runs.',
                    'Add the product cost per lb or kg for dollars. Enter the overfill a checkweigher-to-filler loop holds (1–2 g is typical) and the installed cost to see savings and payback.',
                ],
            },
            {
                id: 'downtime',
                label: 'Line Downtime Cost Calculator',
                summary: 'Dollars per minute, per shift, and per year when the line stops, and what a reduction is worth.',
                steps: [
                    'Enter the line output and the contribution margin per unit, the crew and loaded labor rate, and any line overhead per hour.',
                    'Enter the downtime minutes per shift with the shifts and days; the card reports cost per minute, shift, day, and year, the value of the reduction you enter, and what one point of availability is worth.',
                ],
            },
            {
                id: 'expression',
                label: 'Expression Calculator',
                summary: 'Two modes. Flow chains results (ans = previous answer). Formula lets you define variables and evaluate an expression against them.',
                steps: [
                    'Flow: type an expression such as 2+3*4 or sqrt(16) and press Enter. The result becomes ans for the next line.',
                    'Formula: set variables (w = 12, L = 20) then evaluate expressions that use them. Edit a variable and re-run.',
                    'Supported: + − × ÷ ^, parentheses, sqrt, sin, cos, tan, π, e, and ans.',
                ],
            },
            {
                id: 'area',
                label: 'Area Calculator',
                summary: 'Rectangle, circle, half circle, triangle, ellipse, and trapezoid areas, with a memory that totals what you add.',
                steps: ['Pick a shape, enter its dimensions, and add the result to memory. The memory totals everything added, in the unit you chose.'],
            },
            {
                id: 'power',
                label: 'Electrical Power Calculator',
                summary: 'Watts, amps, and volts for DC, single-phase, and three-phase AC, plus an equipment list that totals a panel load.',
                steps: [
                    'Enter any two of volts, amps, and watts; the third is solved. Three-phase uses √3 and the power factor you set.',
                    'Add equipment lines with quantity to build a panel total in watts and amps.',
                ],
            },
        ],
    },
    conveyor: {
        title: 'Conveyor',
        description:
            'The conveyor sizing chain, in the order a quote gets built: what the plant said (Line Throughput), what the conveyor has to do (Conveyor Speed), and what the belt and drive need to be (Belt Pull). Each card sends its result to the next, so the product is entered once.',
        tips: [
            'Work left to right: Line Throughput → Conveyor Speed → Belt Pull → Torque & Motor → Drive Shaft. The Incline solver sits between speed and pull when the path has a slope; Belt Pull also works alone for radius and S-conveyors.',
            'Cyan values with an auto tag are solved from what you entered. Type over one and the oldest value it depends on is re-derived and flashes — nothing is ever cleared.',
            'Every card starts independent. A card that needs another card\'s numbers has a From bar: Pull copies them once, Link follows the source live until you edit a pulled value. Pin a copy to Home to compare configurations side by side.',
            'Belt Pull\'s card menu (the three dots) has Load example configuration — a known-good starting point to edit. The same menu on every card saves, loads, copies, and clears it, and the letter tag next to it (A, B, C…) names a card so two Home copies are easy to tell apart — From bars list them as Belt Load A, Belt Load B.',
        ],
        tools: [
            {
                id: 'beltLoad',
                label: 'Belt Load (lb/ft)',
                summary: 'Turns what the plant quotes into the numbers the conveyor needs — packages per minute, belt speed, and belt load in lb/ft — solving every field from the others as you type, in either direction.',
                steps: [
                    'Pick Packages or Bulk first, then enter what you know. Line throughput is optional: enter it in the unit the plant quoted (lb/hr, lb/day, lb/shift, kg/hr, kg/day) and, for per-day or per-shift rates, the hours the line actually runs.',
                    'Packages: any two of throughput, package weight, and packages per minute give the third. Product length and gap give the belt speed for that rate, or enter belt speed directly. Belt load (lb/ft) is a field of its own: it solves from throughput ÷ speed or from package weight ÷ pitch, and you can type it to back out the speed or the gap instead.',
                    'Amber fields are the ones that would unlock a result; cyan auto fields are solved. Type over a solved field and the oldest entry it depends on is re-derived and flashes so you can see what moved. Lock the knowns a job starts from — the padlock in each box — and the solver never touches them; locking a solved value pins it where it is.',
                    'Bulk: density, bed depth (average product height), and belt width give lb/ft; with belt speed that is the throughput, or enter throughput and speed to get the depth the demand needs. A downstream packager section backs lb/hr out of bags per minute × bag weight — or the fill box (settled density × bag volume) — when that is all you have. Enter a maximum bed depth to check the bed against a side guard or flight height.',
                    'Conveyor Speed and Belt Pull pull from this card: open their From bar and choose Pull for a one-time copy or Link to follow this card live. The packager headroom check appears once a line throughput and a packages-per-minute rate exist.',
                ],
                notes: ['Use loose, as-conveyed density for bulk — product bulks up off the pile. The settled density in a box is a different number and belongs to the Package Fill section, which derives the package weight from the box.'],
            },
            {
                id: 'conveyorFlow',
                label: 'Conveyor Speed & Throughput',
                summary: 'Belt speed from rate and product pitch — or the rate a speed delivers, or the gap it leaves — with the answer big and live.',
                steps: [
                    'Pick what to solve for: belt speed (default), rate, or gap. The chosen field becomes the result; the other three are the inputs.',
                    'Enter packages per minute, product length, and gap. Belt speed, pitch, products per foot, packages per hour, and gap time update on every keystroke. A conveyor length adds transit time.',
                    'Belt speed from drive RPM: enter RPM and pulley pitch diameter and use the result as the belt speed.',
                    'Enter a package weight and Belt Pull can pull lb/ft and speed from this card through its From bar. For splits, merges, rejects, dwell stations, and accumulation, open the Line Flow Simulator — it starts from this same infeed.',
                ],
            },
            {
                id: 'accumulation',
                label: 'Accumulation Buffer',
                summary: 'Feet of zero-pressure accumulation for seconds of downstream stoppage, or the seconds a given length absorbs.',
                steps: [
                    'Enter the incoming rate, the product length, and the gap products settle to when they close up (0 for touching). The From bar pulls the rate, length, and belt speed from the Conveyor Speed infeed, or links to it.',
                    'Length from time gives the conveyor length for the stoppage you must absorb; Time from length gives the seconds a conveyor you already have will buffer. Products round up for length and down for time.',
                    'Add a zone length for the MDR zero-pressure zone count, and a belt speed for the time to fill the buffer from empty.',
                ],
            },
            {
                id: 'conveyorSpec',
                label: 'Incline Conveyor Calculator (Spec Solver)',
                summary: 'Solves straight, incline, L, and Z conveyor geometry from any two known values and hands the path to Belt Pull.',
                steps: [
                    'Pick the layout. For incline, L, and Z enter any two of floor length, height change, angle, and belt length; the rest is solved and drawn.',
                    'Read the angle advice. For packages it suggests cleats or a textured belt as the slope grows. For bulk it tells you when the slope is past the plain-belt limit and flights are required.',
                    'If a product is defined on Line Throughput it shows here; otherwise enter piece length, spacing, and weight for a simple loading estimate.',
                    'Send path to Belt Pull builds the section chain (infeed straight, incline, discharge straight) with the product attached.',
                ],
            },
            {
                id: 'beltPull',
                label: 'Belt Pull & Drive Calculator',
                summary: 'The sizing instrument. One chain of sections covers straight, incline, L, Z, radius, and S conveyors; the result is belt pull, belt and motor checks, and a drive pick.',
                steps: [
                    'Conveyor path: set the infeed straight and add sections. Turn + Straight adds a curve with angle, inside radius, and the straight after it. Incline adds a rise; any two of belt length, rise, angle, and floor run define it. Straight adds a flat leg (a Z discharge).',
                    'Slip flag: when an incline is steeper than a plain belt holds the product, the section turns red. For bulk, Add flights opens the pocket editor (flight height, pitch, optional measured lb per pocket); for packages it notes cleats. Engineer override accepts the plain belt and logs it as an assumption.',
                    'Belt & Load: pick a catalog belt to fill weight, rating, build, collapse factor, and sprocket pitch, or enter them. Choose Packages or Bulk, then Rate (lb/hr), Direct (total lb on the belt), or, for bulk, Bed (capacity from width × depth × density). Bulk shows loose density, repose, pocket fill, and the plain-belt limit.',
                    'Return path & ordering: split the return into slider-bed and bearinged-roller segments; a blank length takes the loop remainder. Worst-case ordering (all friction before the turns) is the quoting default; Actual marches the real sequence.',
                    'Wear scenario: Clean, Vendor-Rec, Worn, and Degraded scale the wearstrip friction. Size on Central × scenario × service factor — Worn for one or two turns, Degraded for three or more. Friction & Tension (advanced) exposes materials, back tension, and the corner drag model.',
                    'Service factors: bearinged nose bars carry no adder; static noses, speed over 30 m/min, start-stop duty, bi-directional drive, and elevation add to the factor.',
                    'Results: running and startup pull with the Low / Central / High band, the scenario table, tension through each turn, load by section when pockets or overrides are in play, the curve edge-capacity screen, the corner speed ceiling with the DG-321 rule, and the sign-off list of assumptions.',
                    'Drive: the card shows the sizing floors and the smallest passing OneMotion series. The Torque & Motor card pulls the pulls, speed, width, and every scenario\'s floors from here — or links to follow this card live — for torque, power, motor size, gear ratio, the auto-pick table, and the manual sign-off entry.',
                ],
                notes: [
                    'Central is the exact curve solution reconciled to the OneMotion A1 sign-off. Low is the vendor hand method; High is a sensitivity ceiling with no manufacturer basis.',
                    'Copy card code in the card menu gives a string that reloads this exact configuration on any Belt Pull card.',
                    'Calibration log: enter a measured pull and the solver back-solves the rail friction it implies.',
                ],
            },
            {
                id: 'driveMotor',
                label: 'Torque & Motor',
                summary: 'Belt pull in, drive out: torque at the sprocket or drum, shaft rpm, power, a standard motor size, gear ratio, and the OneMotion pick.',
                steps: [
                    'Pull or link from Belt Pull in the From bar, or type the running pull, startup pull, sizing floors, speed, and belt width. The floors are Central × scenario × service factor; blank floors fall back to the running pull and 1.25× for peak.',
                    'Pick the drive: sprocket teeth and belt pitch give the chordal pitch diameter (override from the drawing), or a drum diameter. Torque, shaft rpm, power at the belt, the motor size at your drive efficiency, and the gear ratio for the motor speed update live.',
                    'The OneMotion auto-pick lists every series at this width against the floors; the manual entry under it is the sign-off path with utilisation per wear scenario and the optional cool-ambient allowance.',
                    'Drive Shaft pulls the pull, torque, belt width, and pitch diameter from this card through its From bar, or links to it.',
                ],
                notes: ['Drum motors are verdicted on the vendor belt-pull rating at the belt width, not torque ÷ radius. Catalog N·m values are ambiguous between continuous and peak — confirm the AMO row with the vendor.'],
            },
            {
                id: 'driveShaft',
                label: 'Drive Shaft Deflection & Twist',
                summary: 'Checks a square or round drive shaft between its bearings for deflection under belt pull and twist under drive torque.',
                steps: [
                    'Pull or link from Torque & Motor in the From bar, or enter the shaft size and material, bearing span, belt width, belt pull, and drive torque (or a pitch diameter to derive it).',
                    'Deflection uses the pull spread across the belt width on a simply supported span; twist uses the torque over the driven-to-far-sprocket length. Both show against editable limits, with bending and torsional stress against half the yield.',
                    'Exceeded limits say what to change: a larger shaft, a shorter bearing span, or an intermediate support.',
                ],
                notes: ['The 0.10 in deflection and 1° twist defaults are common belt-maker guidance; the belt manufacturer\'s design guide governs the numbers you sign off.'],
            },
            {
                id: 'wearstrip',
                label: 'Wearstrip Span Calculator',
                summary: 'Support spacing and end overhang for the plastic rails under a modular belt, sized on an operator pressing on the belt, not the product.',
                steps: [
                    'Pick the strip material (virgin UHMW, UltraLube, HDPE, acetal, PET-P) and its cross-section. Acetal is never used under an acetal belt.',
                    'Enter the point load and the stiffness class you want to hold; the calculator reports the longest support span and the overhang you can run before the cantilever sags or overstresses.',
                    'Set the washdown temperature. Hot UHMW is softer, and the modulus is knocked down accordingly; the creep check covers sustained belt-plus-product load.',
                    'The material\'s friction feeds the belt pull calculator: send it across to update the carryway base μ.',
                ],
            },
            {
                id: 'lineFlow',
                label: 'Line Flow Simulator',
                summary: 'A chain of cards that follows product through a line: the infeed, then splits, merges, dwell stations, rejects, stacking, batching, and accumulation.',
                steps: [
                    'The infeed is the Conveyor Speed card — edit it in either place. Add cards downstream: Split and Reject remove a percentage; Merge adds another line\'s flow; Process applies a dwell time that consumes gap; Stacking and Batching combine products.',
                    'Accumulation converts seconds of downstream stoppage into feet of zero-pressure buffer at the incoming rate, or a fixed length into the seconds it absorbs.',
                    'Every card recalculates the whole chain when an upstream value changes; the badge in the header shows the worst feasibility in the chain.',
                ],
            },
        ],
    },
    charts: {
        title: 'Charts',
        description: 'Reference data with a search box in front of it: friction, fasteners, gauges, fits, wire, pneumatics, connectors, belts, MDR motors, and machine safety distances. Click a chart to open it; search inside the tab filters across all of them.',
        tips: [
            'Values are engineering references. Verify against the manufacturer datasheet and the applicable code before a final design.',
            'Pin a chart to keep it on Home.',
        ],
        tools: [
            {
                id: 'beltspecs',
                label: 'Belt Specs',
                summary: 'The belts AQS runs, side by side, live from the AQS catalog: pitch, thickness, weight, allowable tension, radius capability, curve rating, open area, speed and temperature limits.',
                steps: [
                    'Enter a belt width and every radius belt shows its minimum inside turn radius (collapse factor × width).',
                    'Filter by brand, build, or radius belts only; sort any column; click a row for sprockets and temperature range.',
                    'Pick the same belt in Belt Pull\'s Catalog Belt dropdown to load its values into the solver.',
                ],
            },
            {
                id: 'hubmotor',
                label: 'MDR Hub Motor Selection',
                summary: 'OneMotion series interpolated at your belt width: torque, peak torque, belt pull, and RPM range, with a recommendation for a required torque.',
                steps: [
                    'Enter the conveyor width (mm or in). Specs interpolate between the series\' minimum and maximum tube length; outside that range the motor does not fit.',
                    'Enter the required torque to get the smallest series that meets it with a 1.5× thermal safety factor, plus near misses and alternatives.',
                ],
            },
            {
                id: 'safety',
                label: 'Safety Distance & Guarding',
                summary: 'Five sections: light curtain safety distance (ISO 13855 / OSHA), guard openings and reach distances (ISO 13857), clearances, performance level (PLr), and noise exposure.',
                steps: [
                    'Safety Distance: enter the machine stopping time and device response, pick the approach (hand/arm 2000 mm/s or walking 1600 mm/s) and the detection capability; S = K × T + C.',
                    'Guard Openings: opening size against distance to the hazard by body part, and reach-over distances by barrier height versus hazard height.',
                    'Risk (PLr): answer severity, frequency, and avoidance to get the required performance level per ISO 13849.',
                ],
            },
            {
                id: 'tolerance',
                label: 'ISO Fit Tolerance',
                summary: 'Hole and shaft deviations from ISO 286 for a nominal size and fit class, with the resulting clearance, transition, or interference.',
                steps: ['Enter the nominal size and pick the hole and shaft classes (H7/g6, H7/k6, H7/p6 …). Limits and the fit type are shown.'],
            },
        ],
    },
}
