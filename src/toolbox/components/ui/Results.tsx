import type { ReactNode } from 'react'

/** Shared result-panel pieces for the calculator cards */
export const panelCls = 'rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2'
export const tileCls = 'bg-dark-800 rounded px-2.5 py-2'
export const tileLabelCls = 'text-text-muted uppercase text-[10px]'
export const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
export const selectCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary'
export const labelCls = 'block text-xs text-text-muted mb-1'
export const sendBtnCls = 'w-full px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-center gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary/10'
export const ghostBtnCls = 'px-3 py-2 rounded-lg text-xs border border-border bg-dark-900 text-text-secondary hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

export function BigResult({ label, value, unit, hint }: { label: string; value: string | null; unit?: string; hint?: string }) {
    return (
        <div>
            <div className={tileLabelCls}>{label}</div>
            {value !== null ? (
                <div className="font-mono text-2xl text-primary font-semibold leading-tight">{value}{unit ? <span className="text-sm text-text-secondary"> {unit}</span> : null}</div>
            ) : (
                <div className="text-xs text-text-muted mt-1">{hint}</div>
            )}
        </div>
    )
}

export function Tile({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className={tileCls}>
            <div className={tileLabelCls}>{label}</div>
            <div className="font-mono text-sm text-text-primary">{children}</div>
        </div>
    )
}

export function utilCls(pct: number): string {
    if (pct > 100) return 'bg-error/10 border-error text-error'
    if (pct >= 80) return 'bg-warning/10 border-warning text-warning'
    return 'bg-success/10 border-success text-success'
}

/** Utilisation bar: value against a limit, coloured at 80 % and 100 % */
export function UtilBar({ label, pct, detail }: { label: string; pct: number; detail: string }) {
    const color = pct > 100 ? 'bg-error' : pct >= 80 ? 'bg-warning' : 'bg-success'
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">{label}</span>
                <span className={`font-mono ${pct > 100 ? 'text-error' : pct >= 80 ? 'text-warning' : 'text-success'}`}>{detail}</span>
            </div>
            <div className="h-1.5 rounded bg-dark-900 overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
        </div>
    )
}

export function Field({ label, unit, children, hint }: { label: string; unit?: string; children: ReactNode; hint?: string }) {
    return (
        <div>
            <label className={labelCls}>{label}{unit ? <span className="text-text-muted"> ({unit})</span> : null}</label>
            {children}
            {hint && <div className="text-[10px] text-text-muted mt-0.5">{hint}</div>}
        </div>
    )
}
