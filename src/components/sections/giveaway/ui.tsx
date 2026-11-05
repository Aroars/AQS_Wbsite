import type { ReactNode } from 'react'

/** Result-panel and field pieces for the giveaway calculator */
export const panelCls = 'readout rounded-lg border border-border px-3 py-3 space-y-2'
const tileCls = 'bg-surface-card rounded px-2.5 py-2'
const tileLabelCls = 'text-text-dim uppercase text-[11px]'
export const inputCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text'
export const selectCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text'
const labelCls = 'block text-xs text-text-dim mb-1'

export function BigResult({ label, value, unit, hint }: { label: string; value: string | null; unit?: string; hint?: string }) {
    return (
        <div>
            <div className={tileLabelCls}>{label}</div>
            {value !== null ? (
                <div className="font-mono text-2xl text-accent-text font-semibold leading-tight">{value}{unit ? <span className="text-sm text-text-body"> {unit}</span> : null}</div>
            ) : (
                <div className="text-xs text-text-dim mt-1">{hint}</div>
            )}
        </div>
    )
}

export function Tile({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className={tileCls}>
            <div className={tileLabelCls}>{label}</div>
            <div className="font-mono text-sm text-text-strong">{children}</div>
        </div>
    )
}

export function Field({ label, unit, children, hint }: { label: string; unit?: string; children: ReactNode; hint?: string }) {
    return (
        <div>
            <label className={labelCls}>{label}{unit ? <span className="text-text-dim"> ({unit})</span> : null}</label>
            {children}
            {hint && <div className="text-[11px] text-text-dim mt-0.5">{hint}</div>}
        </div>
    )
}
