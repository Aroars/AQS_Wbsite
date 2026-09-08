/**
 * Bundled copy of the quoting tool's public belt spec feed — the fallback when
 * the live feed is unreachable. Regenerate with `npm run belts:snapshot`
 * (scripts/snapshot-belt-specs.mjs). Engineering data only, never prices.
 */
import type { BeltSpecFeed } from '@/toolbox/lib/beltSpecs'

export const beltSpecsSnapshot: BeltSpecFeed = {
    generatedAt: '2026-09-08T00:00:00.000Z',
    source: 'snapshot (empty — catalog not yet published)',
    belts: [],
}
