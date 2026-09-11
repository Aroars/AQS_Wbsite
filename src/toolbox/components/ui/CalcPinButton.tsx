import { useEffect, useRef, useState } from 'react'
import { Pin, PinOff, MoreHorizontal, Save, Upload, Copy, Eraser, Trash2 } from 'lucide-react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { MAIN } from '@/toolbox/stores/migrate'
import { decodeSnapshot, encodeSnapshot, describeSnapshot } from '@/toolbox/lib/snapshot'
import { showToast } from '@/toolbox/components/ui/Toast'

/**
 * Card header controls: the actions menu (save / load / copy code / clear)
 * and the pin. On the tab card the pin adds an independent Home copy seeded
 * with the current values; on a Home copy it unpins that copy.
 */
export function CalcPinButton({ toolId, instanceId }: { toolId: string; instanceId: string }) {
    const pinCount = useAppStore((s) => s.pinnedCalculators.filter((p) => p.toolId === toolId).length)
    const pinCalculator = useAppStore((s) => s.pinCalculator)
    const unpinCalculator = useAppStore((s) => s.unpinCalculator)
    return (
        <div className="flex items-center gap-0.5">
            <CardActions toolId={toolId} instanceId={instanceId} />
            {instanceId === MAIN ? (
                <button onClick={() => pinCalculator(toolId, MAIN)} title="Pin a copy of this card to Home"
                    className="relative p-1 rounded transition-colors text-text-muted hover:text-text-secondary">
                    <Pin className="w-3.5 h-3.5" fill={pinCount > 0 ? 'currentColor' : 'none'} />
                    {pinCount > 0 && <span className="absolute -top-1 -right-1 text-[9px] font-mono text-primary">{pinCount}</span>}
                </button>
            ) : (
                <button onClick={() => unpinCalculator(instanceId)} title="Unpin this copy from Home"
                    className="p-1 rounded transition-colors text-primary hover:text-error">
                    <PinOff className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}

/** Save / load / copy / clear for one card instance */
function CardActions({ toolId, instanceId }: { toolId: string; instanceId: string }) {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<'menu' | 'save' | 'load'>('menu')
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [armed, setArmed] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const snapshots = useAppStore((s) => s.snapshots)
    const saveSnapshot = useAppStore((s) => s.saveSnapshot)
    const deleteSnapshot = useAppStore((s) => s.deleteSnapshot)
    const cardSnapshotOf = useAppStore((s) => s.cardSnapshotOf)
    const applyCardSnapshot = useAppStore((s) => s.applyCardSnapshot)
    const resetInstance = useAppStore((s) => s.resetInstance)
    const mine = snapshots.filter((x) => x.kind === 'card' && x.tool === toolId)

    useEffect(() => {
        if (!open) return
        const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [open])
    const close = () => { setOpen(false); setMode('menu'); setArmed(false); setCode(''); setName('') }

    const copyCode = () => {
        const text = encodeSnapshot(cardSnapshotOf(toolId, instanceId))
        navigator.clipboard?.writeText(text).then(() => showToast('Card code copied — paste it into Load on any card of this type'), () => showToast('Copy failed — your browser blocked clipboard access'))
        close()
    }
    const doSave = () => { saveSnapshot(name, cardSnapshotOf(toolId, instanceId)); showToast(`Saved ${name.trim() || toolId}`); close() }
    const loadCode = (text: string) => {
        const snap = decodeSnapshot(text)
        if (!snap) { showToast('That is not a toolbox card code'); return }
        if (snap.kind !== 'card') { showToast('That is a page snapshot — load it from the Snapshots panel in the title strip'); return }
        if (!applyCardSnapshot(toolId, instanceId, snap)) { showToast(`That code is for ${snap.tool}, not this card`); return }
        showToast('Card loaded'); close()
    }
    const clear = () => {
        if (!armed) { setArmed(true); window.setTimeout(() => setArmed(false), 2500); return }
        resetInstance(toolId, instanceId); showToast('Card cleared'); close()
    }

    return (
        <div ref={ref} className="relative">
            <button onClick={() => (open ? close() : setOpen(true))} title="Save, load, copy, or clear this card"
                className="p-1 rounded transition-colors text-text-muted hover:text-text-secondary" aria-haspopup="menu" aria-expanded={open}>
                <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-30 w-72 rounded-lg border border-border bg-dark-700 shadow-lg p-1.5 text-xs" role="menu">
                    {mode === 'menu' && (
                        <div className="space-y-0.5">
                            <button onClick={() => setMode('save')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-dark-600 text-text-primary"><Save className="w-3.5 h-3.5 text-text-muted" /> Save snapshot…</button>
                            <button onClick={() => setMode('load')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-dark-600 text-text-primary"><Upload className="w-3.5 h-3.5 text-text-muted" /> Load…{mine.length > 0 ? <span className="ml-auto text-text-muted font-mono">{mine.length} saved</span> : null}</button>
                            <button onClick={copyCode} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-dark-600 text-text-primary"><Copy className="w-3.5 h-3.5 text-text-muted" /> Copy card code</button>
                            <button onClick={clear} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${armed ? 'bg-error/15 text-error' : 'hover:bg-dark-600 text-text-primary'}`}>
                                <Eraser className="w-3.5 h-3.5 text-text-muted" /> {armed ? 'Click again to clear this card' : 'Clear card'}
                            </button>
                        </div>
                    )}
                    {mode === 'save' && (
                        <div className="space-y-1.5 p-1">
                            <div className="text-text-muted uppercase tracking-wider text-[10px]">Save this card</div>
                            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') doSave(); if (e.key === 'Escape') close() }}
                                placeholder="name, e.g. Line 3 infeed" className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                            <div className="flex gap-1 justify-end">
                                <button onClick={() => setMode('menu')} className="px-2 py-1 rounded text-text-muted hover:text-text-secondary">Back</button>
                                <button onClick={doSave} className="px-2.5 py-1 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20">Save</button>
                            </div>
                        </div>
                    )}
                    {mode === 'load' && (
                        <div className="space-y-1.5 p-1">
                            <div className="text-text-muted uppercase tracking-wider text-[10px]">Saved for this card type</div>
                            {mine.length === 0 && <div className="text-text-muted px-1">Nothing saved yet.</div>}
                            <div className="max-h-40 overflow-y-auto space-y-0.5">
                                {mine.map((snap) => (
                                    <div key={snap.id} className="flex items-center gap-1">
                                        <button onClick={() => loadCode(snap.code)} className="flex-1 text-left px-2 py-1 rounded hover:bg-dark-600 text-text-primary truncate" title={describeSnapshot(decodeSnapshot(snap.code)!)}>
                                            {snap.name} <span className="text-text-muted font-mono">{new Date(snap.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </button>
                                        <button onClick={() => deleteSnapshot(snap.id)} title="Delete" className="p-1 text-text-muted hover:text-error"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="text-text-muted uppercase tracking-wider text-[10px] pt-1">Or paste a card code</div>
                            <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={2} placeholder="aqs1.…" className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded font-mono text-[11px] text-text-primary focus:outline-none focus:border-primary" />
                            <div className="flex gap-1 justify-end">
                                <button onClick={() => setMode('menu')} className="px-2 py-1 rounded text-text-muted hover:text-text-secondary">Back</button>
                                <button onClick={() => loadCode(code)} disabled={!code.trim()} className="px-2.5 py-1 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40">Load</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
