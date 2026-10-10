import type { ReactNode } from 'react'

/** Shared result-panel pieces for the calculator cards */
export const panelCls = 'readout rounded-lg border border-border px-3 py-3 space-y-2'
export const tileCls = 'bg-surface-card rounded px-2.5 py-2'
export const tileLabelCls = 'text-text-dim uppercase text-[11px]'
export const inputCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text'
export const selectCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text'
export const labelCls = 'block text-xs text-text-dim mb-1'
export const sendBtnCls = 'w-full px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-center gap-1.5 border-accent-text/40 bg-accent-text/10 text-accent-text hover:bg-accent-text/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent-text/10'
export const ghostBtnCls = 'px-3 py-2 rounded-lg text-xs border border-border bg-surface-page text-text-body hover:border-accent-text/40 hover:text-accent-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

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

/* Status is carried by the tint and edge; the text stays strong so it reads
   on light cards and inside readouts alike */
export function utilCls(pct: number): string {
    if (pct > 100) return 'bg-error/10 border-error text-text-strong'
    if (pct >= 80) return 'bg-warning/10 border-warning text-text-strong'
    return 'bg-success/10 border-success text-text-strong'
}

/** Utilisation bar: value against a limit, coloured at 80 % and 100 % */
export function UtilBar({ label, pct, detail }: { label: string; pct: number; detail: string }) {
    const color = pct > 100 ? 'bg-error' : pct >= 80 ? 'bg-warning' : 'bg-success'
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-text-body">{label}</span>
                <span className="font-mono text-text-strong inline-flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} aria-hidden />
                    {detail}
                </span>
            </div>
            <div className="h-1.5 rounded bg-surface-page overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
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
