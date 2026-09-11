import { useEffect, useMemo, useCallback } from 'react'
import { MAIN } from '@/toolbox/stores/migrate'

const EMPTY_CHAIN: FlowCard[] = []
import { useAppStore } from '@/toolbox/stores/appStore'
import { unitTypes } from '@/toolbox/data/conveyorCardTypes'
import { fmtInput } from '@/toolbox/lib/calculators/lineThroughput'
import {
    ensureInfeed, patchInfeed, changeSolveFor, changeInfeedUnit, readInfeed, SOLVE_LABEL,
    type FlowCard, type SolveFor, type InfeedReading,
} from '@/toolbox/lib/calculators/infeedCard'

export const flowInputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-l-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
export const flowUnitCls = 'px-1.5 bg-dark-700 border border-l-0 border-border rounded-r-lg text-text-secondary text-xs focus:outline-none'
const labelCls = 'block text-xs text-text-muted mb-1'

/** The shared infeed card (conveyorCards[0]) with a patch/solve-for API */
export function useInfeed(chainId: string = MAIN) {
    const cards = useAppStore((s) => s.chains[chainId] ?? EMPTY_CHAIN)
    const setChain = useAppStore((s) => s.setChain)
    const setCards = useCallback((next: FlowCard[]) => setChain(chainId, next), [setChain, chainId])
    const current = useCallback(() => useAppStore.getState().chains[chainId] ?? EMPTY_CHAIN, [chainId])
    useEffect(() => {
        const cur = current()
        const next = ensureInfeed(cur)
        if (next !== cur) setCards(next)
    }, [setCards, current])
    const head: FlowCard | null = cards.length > 0 && cards[0].type === 'infeed' ? cards[0] : null
    const solveFor = ((head?.inputs.solveFor as SolveFor) || 'speed')
    const reading: InfeedReading = useMemo(() => readInfeed(head), [head])
    const patch = (inputs: Record<string, number | string | null>, units?: Record<string, string>) =>
        setCards(patchInfeed(current(), inputs, units))
    const setSolveFor = (next: SolveFor) => setCards(changeSolveFor(current(), next))
    const setUnit = (inputKey: string, unitType: string, unit: string, displayedDefault?: string) => setCards(changeInfeedUnit(current(), inputKey, unitType, unit, displayedDefault))
    return { head, solveFor, reading, patch, setSolveFor, setUnit, setCards, current }
}

interface FieldDef {
    key: SolveFor | 'length' | 'weight'
    inputKey: string
    label: string
    unitType: string
    placeholder: string
}

const FIELDS: FieldDef[] = [
    { key: 'rate', inputKey: 'productRate', label: 'Rate', unitType: 'rate', placeholder: '20' },
    { key: 'length', inputKey: 'productLength', label: 'Product length', unitType: 'length', placeholder: '12' },
    { key: 'gap', inputKey: 'productGap', label: 'Gap', unitType: 'length', placeholder: '0' },
    { key: 'speed', inputKey: 'productSpeed', label: 'Belt speed', unitType: 'speed', placeholder: '100' },
]
const WEIGHT: FieldDef = { key: 'weight', inputKey: 'productWeight', label: 'Product weight', unitType: 'weight', placeholder: 'for stacking, batching, Belt Pull' }

/**
 * Infeed inputs with a solve-for toggle. The chosen field is read-only and
 * shows the engine's result in cyan; the other three are the inputs. Used by
 * the Conveyor Speed calculator and, with the weight field, by the Line Flow
 * Simulator — both edit the same card.
 */
export function InfeedEditor({ showWeight = false, chainId = MAIN, onEdit }: { showWeight?: boolean; chainId?: string; onEdit?: (keys: string[]) => void }) {
    const { head, solveFor, reading, patch: rawPatch, setSolveFor: rawSolveFor, setUnit: rawSetUnit } = useInfeed(chainId)
    const patch: typeof rawPatch = (inputs, units) => { onEdit?.(Object.keys(inputs)); rawPatch(inputs, units) }
    const setSolveFor: typeof rawSolveFor = (next) => { onEdit?.(['productSpeed', 'productRate', 'productGap']); rawSolveFor(next) }
    const setUnit: typeof rawSetUnit = (k, t, u, d) => { onEdit?.([k]); rawSetUnit(k, t, u, d) }
    if (!head) return null

    const numberInput = (f: FieldDef) => {
        const isTarget = f.key === solveFor
        const unit = head.units[f.inputKey] ?? unitTypes[f.unitType].default
        const raw = head.inputs[f.inputKey]
        const shown = isTarget ? reading.display(f.key as SolveFor) : null
        const value = isTarget ? (shown !== null ? fmtInput(shown) : '') : (raw === null || raw === undefined ? '' : String(raw))
        return (
            <div key={f.key}>
                <label className={labelCls}>
                    {f.label}
                    {isTarget && <span className="ml-1.5 text-[9px] font-mono uppercase tracking-wider text-primary/80">solved</span>}
                </label>
                <div className="flex">
                    <input type="number" step="any" min={f.key === 'gap' ? '0' : undefined}
                        value={value} placeholder={isTarget ? '—' : f.placeholder}
                        readOnly={isTarget} tabIndex={isTarget ? -1 : undefined}
                        onChange={(e) => patch({ [f.inputKey]: e.target.value === '' ? null : parseFloat(e.target.value) })}
                        className={`${flowInputCls} ${isTarget ? 'text-primary border-primary/30 bg-primary/5 cursor-default' : ''}`} />
                    <select value={unit} onChange={(e) => setUnit(f.inputKey, f.unitType, e.target.value)} className={flowUnitCls} aria-label={`${f.label} unit`}>
                        {unitTypes[f.unitType].units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div>
                <div className={labelCls}>Solve for</div>
                <div className="flex gap-1">
                    {(['speed', 'rate', 'gap'] as SolveFor[]).map((t) => (
                        <button key={t} type="button" onClick={() => setSolveFor(t)}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                solveFor === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {SOLVE_LABEL[t]}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {FIELDS.map(numberInput)}
                {showWeight && numberInput(WEIGHT)}
            </div>
        </div>
    )
}
