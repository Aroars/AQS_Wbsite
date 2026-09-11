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
    beltspecs: 'Belt spec reference chart comparing the modular and flat belts AQS runs across brands: pitch, thickness, weight, allowable tension, radius capability and collapse factor, curve rating, open area, and speed limits, fed live from the AQS catalog.',
    hubmotor: 'Motorized drive roller (MDR) hub motor selection chart: torque, belt pull, roller width, and RPM.',
    safety: 'Machine safety reference for guard opening distances, light curtain safety distance, performance level (PLr), and noise exposure per OSHA and ISO 13849/13855.',

    // Calculators
    expression: 'Scientific expression calculator with variables, chained results, square roots, and trig functions, for quick engineering math.',
    area: 'Area calculator for rectangles, circles, triangles, ellipses, trapezoids, and half circles, with running memory for totals and square footage.',
    power: 'Electrical power calculator: watts, amps, volts, and kW across single- and three-phase AC and DC, with per-equipment panel load totals.',

    // Plant economics
    giveaway: 'Product giveaway calculator: what overfill costs per package, per hour, and per year, and what a checkweigher feedback loop saves, with payback.',
    downtime: 'Packaging line downtime cost calculator: dollars per minute, per shift, and per year from lost margin, crew labor, and overhead, and the value of a reduction.',

    // Conveyor
    accumulation: 'Accumulation conveyor calculator: buffer length in feet for seconds of downstream stoppage, or the time a length absorbs, with zero-pressure zone counts.',
    driveMotor: 'Conveyor motor sizing calculator: torque at the sprocket or drum, shaft RPM, horsepower and kW, a standard motor size, gear ratio, and the OneMotion drum motor pick.',
    driveShaft: 'Modular belt drive shaft calculator: deflection between bearings and torsional twist for square or round shafts against editable limits.',
    conveyorFlow: 'Conveyor speed calculator: belt speed in ft/min from packages per minute and product pitch, or solve for the rate or the gap; products per foot, gap time, transit time, and belt speed from drive RPM.',
    conveyorSpec: 'Conveyor geometry solver for incline and decline sections: solve length, rise, and angle for straight, L, and Z conveyors.',
    beltLoad: 'Conveyor throughput calculator: lb/hr, lb/day, or kg/hr to packages per minute, belt speed, and belt load in lb/ft, solving in either direction, with bulk bed sizing, bagger back-solving, and a packager headroom check.',
    lineFlow: 'Packaging line flow simulator: infeed through splits, merges, rejects, dwell stations, stacking, and batching, with accumulation buffers sized in feet or seconds.',
    beltPull: 'Belt pull and drive calculator for straight, incline, L, Z, radius, and S-conveyors: chained path sections, flight pockets for bulk inclines, turn tension and capstan effect, OneMotion drive pick, torque, and wearstrip friction with calibration log.',
    wearstrip: 'Wearstrip span calculator for UHMW, UltraLube, and HDPE support beams: deflection, overhang, cantilever, and creep limits.',
}
