// Pull the quoting tool's public belt spec feed into the bundled snapshot.
// Usage: npm run belts:snapshot   (BELT_SPECS_URL overrides the source)
import { writeFileSync } from 'node:fs'
const url = process.env.BELT_SPECS_URL || 'https://apps.automatedqs.com/api/public/belt-specs'
const res = await fetch(url, { headers: { accept: 'application/json' } })
if (!res.ok) { console.error(`feed returned HTTP ${res.status}`); process.exit(1) }
const feed = await res.json()
if (!Array.isArray(feed.belts)) { console.error('unexpected payload'); process.exit(1) }
const out = `/**
 * Bundled copy of the quoting tool's public belt spec feed — the fallback when
 * the live feed is unreachable. Regenerate with \`npm run belts:snapshot\`
 * (scripts/snapshot-belt-specs.mjs). Engineering data only, never prices.
 */
import type { BeltSpecFeed } from '@/toolbox/lib/beltSpecs'

export const beltSpecsSnapshot: BeltSpecFeed = ${JSON.stringify({ generatedAt: feed.generatedAt, source: `snapshot of ${url} (${feed.generatedAt})`, belts: feed.belts }, null, 4)}
`
writeFileSync(new URL('../src/toolbox/data/beltSpecsSnapshot.ts', import.meta.url), out)
console.log(`snapshot: ${feed.belts.length} belts from ${url}`)
