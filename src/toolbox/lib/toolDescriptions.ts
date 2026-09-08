/**
 * Plain-language, search-friendly descriptions for every tool in the registry.
 * Rendered server-side on /toolbox as a crawlable index (the app itself is
 * client-only), so keep these factual and keyword-rich, not marketing copy.
 * Keyed by ToolEntry.id — add an entry here whenever you add a tool.
 */
export const toolDescriptions: Record<string, string> = {
    // Charts
    friction: 'Static and kinetic coefficients of friction for common material pairs: steel, aluminum, rubber, plastics, wood, and brass, dry and lubricated.',
    bolt: 'Metric and imperial bolt, tap drill, and clearance hole chart from M3 to M30 and #4 to 3/4", including UNC pilot sizes.',
    sheetmetal: 'Sheet metal gauge to thickness conversion for steel, stainless, aluminum, and galvanized, in inches and millimeters.',
    pneumatic: 'Pneumatic cylinder force by bore, rod diameter, and air pressure, for extend and retract strokes in psi and bar.',
    wiregauge: 'AWG to mm² wire gauge chart with ampacity ratings and voltage drop for THHN, THWN, XHHW, and other copper conductors.',
    connector: 'Industrial connector and protocol reference: M8, M12, RJ45, DB9, and USB pinouts for Ethernet/IP, PROFINET, EtherCAT, IO-Link, and DeviceNet.',
    tolerance: 'ISO 286 hole and shaft tolerance lookup for clearance, transition, and interference fits, including H7, h6, g6, f7, k7, n7, and p6.',
    airfitting: 'Air fitting and pipe thread reference covering NPT, NPTF, BSPP, and BSPT, with sealing methods and push-in tube sizes.',
    hubmotor: 'Motorized drive roller (MDR) hub motor selection chart: torque, belt pull, roller width, and RPM.',
    safety: 'Machine safety reference for guard opening distances, light curtain safety distance, performance level (PLr), and noise exposure per OSHA and ISO 13849/13855.',

    // Calculators
    expression: 'Scientific expression calculator with variables, chained results, square roots, and trig functions, for quick engineering math.',
    area: 'Area calculator for rectangles, circles, triangles, ellipses, trapezoids, and half circles, with running memory for totals and square footage.',
    power: 'Electrical power calculator: watts, amps, volts, and kW across single- and three-phase AC and DC, with per-equipment panel load totals.',

    // Conveyor
    conveyorFlow: 'Conveyor flow rate calculator for product spacing, belt speed, throughput in packages per minute, accumulation buffers, and merges.',
    conveyorSpec: 'Conveyor geometry solver for incline and decline sections: solve length, rise, and angle for straight, L, and Z conveyors.',
    beltLoad: 'Belt load and throughput calculator for packages or bulk product: packages per minute, pounds per hour and per day, loose density, and bed capacity at belt speed.',
    beltPull: 'Belt pull and drive calculator for straight, incline, L, Z, radius, and S-conveyors: chained path sections, flight pockets for bulk inclines, turn tension and capstan effect, OneMotion drive pick, torque, and wearstrip friction with calibration log.',
    wearstrip: 'Wearstrip span calculator for UHMW, UltraLube, and HDPE support beams: deflection, overhang, cantilever, and creep limits.',
}
