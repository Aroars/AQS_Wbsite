import type { TabId } from '@/toolbox/lib/types'

/**
 * One flat index of every tool in the app — the single source for the
 * command palette and the Charts tab list. Keywords hold the content terms
 * an engineer would actually type (sizes, thread types, fit classes), not
 * just titles.
 */
export interface ToolEntry {
    id: string
    label: string
    /** URL slug for the tool's own page: /toolbox/<slug> */
    slug: string
    keywords: string
    tab: TabId
}

export const chartTools: ToolEntry[] = [
    { id: 'friction', slug: 'friction-coefficient-table', label: 'Friction Coefficient Table', keywords: 'friction material coefficient static kinetic steel aluminum rubber plastic wood brass greased lubricated', tab: 'charts' },
    { id: 'bolt', slug: 'bolt-tap-drill-chart', label: 'Bolt, Tap & Drill', keywords: 'bolt tap drill metric imperial thread screw clearance m3 m4 m5 m6 m8 m10 m12 m16 m20 m24 m30 #4 #6 #8 #10 1/4 5/16 3/8 7/16 1/2 5/8 3/4 unc pilot', tab: 'charts' },
    { id: 'sheetmetal', slug: 'sheet-metal-gauge-chart', label: 'Sheet Metal Gauge', keywords: 'sheet metal gauge ga thickness steel aluminum stainless galvanized 16ga 14ga 12ga 18ga 20ga', tab: 'charts' },
    { id: 'pneumatic', slug: 'pneumatic-cylinder-force-calculator', label: 'Pneumatic Cylinder Force', keywords: 'pneumatic cylinder bore rod pressure force air psi bar stroke extend retract', tab: 'charts' },
    { id: 'wiregauge', slug: 'wire-gauge-ampacity-chart', label: 'Wire Gauge & Ampacity', keywords: 'wire gauge awg mm2 ampacity voltage drop electrical thhn thwn xhhw pvc xlpe copper 12awg 14awg 16awg 18awg', tab: 'charts' },
    { id: 'connector', slug: 'm12-m8-connector-pinouts', label: 'M12 / M8 Connector Pinouts', keywords: 'connector protocol ethernet profinet ethercat m12 m8 rj45 db9 usb devicenet io-link pinout communication', tab: 'charts' },
    { id: 'tolerance', slug: 'iso-fit-tolerance-calculator', label: 'ISO Fit Tolerance (H7 / g6)', keywords: 'tolerance iso 286 fit hole shaft clearance interference transition press sliding running h7 h6 h8 h11 g6 f7 c11 k7 m7 n7 p6 p7 js7 bearing', tab: 'charts' },
    { id: 'airfitting', slug: 'pipe-thread-air-fitting-reference', label: 'Pipe Threads & Air Fittings', keywords: 'air fitting thread npt nptf bsp bspp bspt g r rc pneumatic pipe seal o-ring ptfe teflon tube push-in', tab: 'charts' },
    { id: 'beltspecs', slug: 'modular-belt-comparison-chart', label: 'Belt Comparison Chart', keywords: 'belt specs catalog intralox volta ngb modular pitch rating tension weight radius collapse factor curve open area speed compare brands', tab: 'charts' },
    { id: 'hubmotor', slug: 'mdr-motorized-roller-selection', label: 'MDR Motorized Roller Selection', keywords: 'hub motor mdr motorized drive roller conveyor torque belt pull width rpm', tab: 'charts' },
    { id: 'safety', slug: 'light-curtain-safety-distance-calculator', label: 'Safety Distance & Guarding', keywords: 'safety distance guard opening clearance risk plr performance level noise dba twa osha iso 13849 13855 light curtain interlock e-stop', tab: 'charts' },
]

export const calculatorTools: ToolEntry[] = [
    { id: 'giveaway', slug: 'product-giveaway-calculator', label: 'Product Giveaway Calculator', keywords: 'giveaway overfill checkweigher fill weight target declared weight cost savings payback roi packaging', tab: 'calculators' },
    { id: 'downtime', slug: 'packaging-line-downtime-cost-calculator', label: 'Line Downtime Cost Calculator', keywords: 'downtime cost per minute per shift per year lost margin labor overhead availability oee packaging line', tab: 'calculators' },
    { id: 'expression', slug: 'engineering-expression-calculator', label: 'Expression Calculator', keywords: 'expression formula math evaluate sqrt sin cos variables ans chain', tab: 'calculators' },
    { id: 'area', slug: 'area-calculator', label: 'Area Calculator', keywords: 'area shape rectangle circle triangle ellipse trapezoid half circle memory total square footage', tab: 'calculators' },
    { id: 'power', slug: 'panel-load-kw-to-amps-calculator', label: 'Panel Load & kW to Amps', keywords: 'power watts amps volts kw equipment load panel circuit ac dc phase electrical consumption kw to amps three phase', tab: 'calculators' },
]

export const conveyorTools: ToolEntry[] = [
    { id: 'beltLoad', slug: 'conveyor-throughput-calculator', label: 'Conveyor Throughput Calculator', keywords: 'line throughput belt load lb/hr lb/day kg/hr packages per minute package weight pitch belt speed lb/ft bulk density bed depth belt width packager nameplate headroom intake', tab: 'conveyor' },
    { id: 'conveyorFlow', slug: 'conveyor-speed-calculator', label: 'Conveyor Speed & Throughput', keywords: 'conveyor speed calculator belt speed fpm ft/min packages per minute ppm pitch spacing gap products per foot gap time transit time rpm pulley diameter solve for', tab: 'conveyor' },
    { id: 'accumulation', slug: 'accumulation-conveyor-calculator', label: 'Accumulation Buffer Calculator', keywords: 'accumulation conveyor length buffer seconds zero pressure zones mdr stoppage products in buffer', tab: 'conveyor' },
    { id: 'conveyorSpec', slug: 'incline-conveyor-calculator', label: 'Incline Conveyor Length & Angle', keywords: 'conveyor spec geometry incline decline length height angle belt loading l z straight', tab: 'conveyor' },
    { id: 'beltPull', slug: 'belt-pull-calculator', label: 'Belt Pull & Drive Calculator', keywords: 'belt pull radius s-conveyor incline l z straight turn capstan tension drive hp torque motor onemotion flights pockets bulk wear mu friction calibration corner', tab: 'conveyor' },
    { id: 'driveMotor', slug: 'conveyor-motor-sizing-calculator', label: 'Torque & Motor', keywords: 'conveyor motor sizing horsepower hp kw torque gear ratio gearbox drum motor sprocket pitch diameter shaft rpm onemotion drive selection', tab: 'conveyor' },
    { id: 'driveShaft', slug: 'modular-belt-drive-shaft-calculator', label: 'Drive Shaft Deflection & Twist', keywords: 'drive shaft deflection twist square shaft bearing span torsion stainless modular belt sprocket', tab: 'conveyor' },
    { id: 'wearstrip', slug: 'uhmw-wearstrip-span-calculator', label: 'Wearstrip Span Calculator', keywords: 'wearstrip span beam deflection uhmw ultralube hdpe overhang cantilever creep support', tab: 'conveyor' },
    { id: 'lineFlow', slug: 'line-flow-simulator', label: 'Line Flow Simulator', keywords: 'line flow simulator packaging line chain split merge reject process dwell accumulation buffer seconds feet stacking batching feasibility', tab: 'conveyor' },
]

export const allTools: ToolEntry[] = [...chartTools, ...calculatorTools, ...conveyorTools]

/** Tool by URL slug (the tool pages under /toolbox/<slug>) */
export function toolBySlug(slug: string): ToolEntry | undefined {
    return allTools.find((t) => t.slug === slug)
}
