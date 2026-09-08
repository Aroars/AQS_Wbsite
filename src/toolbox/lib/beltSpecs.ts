/**
 * Belt spec catalog — read-only feed from the AQS quoting tool.
 * @module lib/beltSpecs
 *
 * The quoting tool's Database tab is where belts are entered; this module
 * fetches its public spec feed (engineering data only, never prices), caches
 * it for the session, and falls back to the bundled snapshot when the feed is
 * unreachable so the chart and the solver dropdowns always have something.
 * Regenerate the snapshot with `npm run belts:snapshot`.
 */

import { useEffect, useState } from 'react'
import { beltSpecsSnapshot } from '@/toolbox/data/beltSpecsSnapshot'
import type { BeltBuild } from './calculators/beltPull'

export const BELT_SPECS_URL = process.env.NEXT_PUBLIC_BELT_SPECS_URL || 'https://apps.automatedqs.com/api/public/belt-specs'

export type CatalogBuild = 'pom' | 'pp' | 'pe' | 'nylon' | 'other'

export interface BeltBuildSpec {
    id: string
    name: string
    build: CatalogBuild | null
    weightLbFt2: number | null
    /** Allowable working tension per inch of width, lbf (vendor belt strength at room temperature) */
    ratingLbIn: number | null
    /** The same rating per metre of width */
    ratingKgfM: number | null
}

export interface BeltSpec {
    id: string
    slug: string
    name: string
    brand: string | null
    type: string
    pitchMm: number | null
    thicknessIn: number | null
    radiusCapable: boolean
    /** minimum inside turn radius = collapseFactor × belt width */
    collapseFactor: number | null
    curveRatingFraction: number | null
    openAreaPct: number | null
    maxSpeedFpm: number | null
    tempRangeF: { min: number | null; max: number | null } | null
    sprockets: Array<{ name: string; pitchDiameterIn: number | null; mount: string }>
    builds: BeltBuildSpec[]
}

export interface BeltSpecFeed {
    generatedAt: string
    source: string
    belts: BeltSpec[]
}

export type BeltSpecSource = 'live' | 'cache' | 'snapshot'

const CACHE_KEY = 'aqs-belt-specs'
const CACHE_TTL_MS = 60 * 60 * 1000

function readCache(): BeltSpecFeed | null {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const { at, feed } = JSON.parse(raw) as { at: number; feed: BeltSpecFeed }
        return Date.now() - at < CACHE_TTL_MS ? feed : null
    } catch {
        return null
    }
}

function writeCache(feed: BeltSpecFeed) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), feed })) } catch { /* private mode */ }
}

function isFeed(v: unknown): v is BeltSpecFeed {
    return !!v && typeof v === 'object' && Array.isArray((v as BeltSpecFeed).belts)
}

/** Fetch the feed; resolves to the snapshot (flagged) when the network or the payload fails */
export async function loadBeltSpecs(force = false): Promise<{ feed: BeltSpecFeed; source: BeltSpecSource }> {
    if (!force) {
        const cached = readCache()
        if (cached) return { feed: cached, source: 'cache' }
    }
    try {
        const res = await fetch(BELT_SPECS_URL, { headers: { accept: 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const body = await res.json()
        if (!isFeed(body)) throw new Error('unexpected payload')
        writeCache(body)
        return { feed: body, source: 'live' }
    } catch {
        return { feed: beltSpecsSnapshot, source: 'snapshot' }
    }
}

/** One belt × build as a pickable row for the solvers */
export interface BeltChoice {
    key: string
    label: string
    belt: BeltSpec
    build: BeltBuildSpec
}

export function beltChoices(feed: BeltSpecFeed): BeltChoice[] {
    const out: BeltChoice[] = []
    for (const belt of feed.belts) {
        for (const build of belt.builds) {
            out.push({
                key: `${belt.id}:${build.id}`,
                // Belt names in the catalog often already carry the brand ("Intralox S900")
                label: `${belt.brand && !belt.name.toLowerCase().startsWith(belt.brand.toLowerCase()) ? `${belt.brand} ` : ''}${belt.name} — ${build.name}`,
                belt, build,
            })
        }
    }
    return out
}

/** Map a catalog material family onto the belt-pull engine's POM / PP factor sets */
export function toolboxBuild(build: CatalogBuild | null): BeltBuild {
    return build === 'pp' || build === 'pe' ? 'pp' : 'pom'
}

/** Minimum inside turn radius for a width, inches (null when the belt is not a radius belt) */
export function minInsideRadiusIn(belt: BeltSpec, beltWidthIn: number): number | null {
    return belt.radiusCapable && belt.collapseFactor ? belt.collapseFactor * beltWidthIn : null
}

/** React hook: the feed, where it came from, and a refresh */
export function useBeltSpecs() {
    const [state, setState] = useState<{ feed: BeltSpecFeed; source: BeltSpecSource; loading: boolean }>({
        feed: beltSpecsSnapshot, source: 'snapshot', loading: true,
    })
    useEffect(() => {
        let cancelled = false
        loadBeltSpecs().then((r) => { if (!cancelled) setState({ ...r, loading: false }) })
        return () => { cancelled = true }
    }, [])
    const refresh = () => {
        setState((s) => ({ ...s, loading: true }))
        loadBeltSpecs(true).then((r) => setState({ ...r, loading: false }))
    }
    return { ...state, refresh }
}
