# Engineering Toolbox — roadmap notes

Items that need data or a decision from AQS before they can ship. Keep this list short and dated.

## Populate the belt comparison chart (2026-09)
`/toolbox/modular-belt-comparison-chart` is built (table, sprocket PD sub-calc, copy, FAQ) but stays
`published: false` in `src/toolbox/lib/toolSeo.ts` because the quoting tool's public belt spec feed
has no belts. Fill belt engineering specs in the quoting tool (Database → Components), regenerate
the snapshot with `npm run belts:snapshot`, then flip `published` to true.

## Friction pairs by belt material (2026-09-10)
The wearstrip values in the toolbox (Virgin UHMW 0.18, UltraLube #321 0.10, HDPE 0.25, Acetal/POM
0.20, PET-P 0.12) are single dynamic μ figures treated as the belt-on-rail pair for the standard
acetal belt. The friction chart shows them under "Modular Belt". Still needed: μ for POM, PP, and
PE belts on each rail (dry and wet), plus the explanation of where PP does better or worse than
POM against UHMW vs HDPE. Sources to try: Intralox and Habasit engineering manuals (belt/wearstrip
friction factor tables), Röchling / Duro-Glide data sheets. When the numbers exist, add them to
`src/toolbox/data/frictionData.ts` as `'Belt POM-…'`, `'Belt PP-…'` pairs and extend
`wearstripMaterials` in `src/toolbox/lib/calculators/beltPull.ts` by belt build.

## Minimum straight from the belt catalog (2026-09-10)
Belt Pull has a manual "Minimum Straight (in)" field. Once the belt feed carries a vendor minimum
straight per belt, `applyCatalogBelt` in `BeltPullCalculator.tsx` should fill it the way it fills
the collapse factor.

## Bulk incline belt & motor solver (2026-09-10)
A separate card from Belt Pull for flighted bulk inclines: straight / incline (L, Z) geometry, flight
height and pitch, pocket fill at the angle of repose, bed-versus-pocket capacity, then a pull into
Torque & Motor. It must call the existing engine functions (`pocketWedge`, `pocketCapacityLb`, and
the bulk capacity checks in `src/toolbox/lib/calculators/beltPull.ts`) rather than fork the physics.
Sequence agreed with the user: (1) instance-scoped card state with independent Home pins, (2) snapshot
format with save / load / history / clear, (3) in-app clipboard with pull and link between cards,
then refine the Throughput → Belt Load card, and only then build this solver.
