import { useEffect, useRef, useState } from 'react'
import { Camera, Save, Upload, Copy, Trash2, Eraser } from 'lucide-react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { decodeSnapshot, encodeSnapshot } from '@/toolbox/lib/snapshot'
import { showToast } from '@/toolbox/components/ui/Toast'

/**
 * Page-level snapshots in the toolbox title strip: save or load the whole
 * page (every card, pin, and converter), copy the page code, browse the saved
 * list, and clear every card with a two-click confirmation.
 */
export function SnapshotsPanel() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [armed, setArmed] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const snapshots = useAppStore((s) => s.snapshots)
    const saveSnapshot = useAppStore((s) => s.saveSnapshot)
    const deleteSnapshot = useAppStore((s) => s.deleteSnapshot)
    const pageSnapshot = useAppStore((s) => s.pageSnapshot)
    const applyPageSnapshot = useAppStore((s) => s.applyPageSnapshot)
    const applyCardSnapshot = useAppStore((s) => s.applyCardSnapshot)
    const resetAllCards = useAppStore((s) => s.resetAllCards)

    useEffect(() => {
        if (!open) return
        const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [open])

    const savePage = () => { saveSnapshot(name, pageSnapshot()); showToast(`Saved page${name.trim() ? ` "${name.trim()}"` : ''}`); setName('') }
    const copyPage = () => navigator.clipboard?.writeText(encodeSnapshot(pageSnapshot())).then(() => showToast('Page code copied'), () => showToast('Copy failed — your browser blocked clipboard access'))
    const load = (text: string) => {
        const snap = decodeSnapshot(text)
        if (!snap) { showToast('That is not a toolbox snapshot code'); return }
        if (snap.kind === 'page') { applyPageSnapshot(snap); showToast('Page loaded'); setCode(''); setOpen(false); return }
        // A card code loads into that tool's tab card
        if (applyCardSnapshot(snap.tool, 'main', snap)) { showToast(`Loaded into ${snap.tool}`); setCode(''); setOpen(false) }
    }
    const clearAll = () => {
        if (!armed) { setArmed(true); window.setTimeout(() => setArmed(false), 2500); return }
        resetAllCards(); showToast('All cards cleared'); setArmed(false); setOpen(false)
    }

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen((v) => !v)} title="Save, load, or clear the whole page"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${open ? 'border-primary/50 text-primary bg-primary/10' : 'bg-dark-900 border-border text-text-muted hover:text-text-secondary hover:border-text-muted'}`}>
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Snapshots</span>
                {snapshots.length > 0 && <span className="font-mono text-[10px] text-primary">{snapshots.length}</span>}
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-40 w-80 rounded-lg border border-border bg-dark-700 shadow-lg p-2 text-xs space-y-2">
                    <div>
                        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-1">Save the whole page</div>
                        <div className="flex gap-1">
                            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') savePage() }} placeholder="name, e.g. Plant A line 3"
                                className="flex-1 px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                            <button onClick={savePage} title="Save" className="px-2 py-1.5 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"><Save className="w-3.5 h-3.5" /></button>
                            <button onClick={copyPage} title="Copy page code" className="px-2 py-1.5 rounded border border-border bg-dark-900 text-text-secondary hover:text-primary"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                    <div>
                        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-1">Saved</div>
                        {snapshots.length === 0 && <div className="text-text-muted px-1">Nothing saved yet. Every card also has its own save under its ⋯ menu.</div>}
                        <div className="max-h-44 overflow-y-auto space-y-0.5">
                            {snapshots.map((snap) => (
                                <div key={snap.id} className="flex items-center gap-1">
                                    <button onClick={() => load(snap.code)} className="flex-1 text-left px-2 py-1 rounded hover:bg-dark-600 text-text-primary truncate">
                                        <span className={`font-mono text-[10px] mr-1.5 ${snap.kind === 'page' ? 'text-primary' : 'text-text-muted'}`}>{snap.kind === 'page' ? 'PAGE' : snap.tool}</span>
                                        {snap.name} <span className="text-text-muted font-mono">{new Date(snap.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </button>
                                    <button onClick={() => navigator.clipboard?.writeText(snap.code).then(() => showToast('Code copied'))} title="Copy code" className="p-1 text-text-muted hover:text-primary"><Copy className="w-3 h-3" /></button>
                                    <button onClick={() => deleteSnapshot(snap.id)} title="Delete" className="p-1 text-text-muted hover:text-error"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-1">Load a code</div>
                        <div className="flex gap-1">
                            <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={2} placeholder="aqs1.… (a page code, or a card code for its tab card)" className="flex-1 px-2 py-1.5 bg-dark-900 border border-border rounded font-mono text-[11px] text-text-primary focus:outline-none focus:border-primary" />
                            <button onClick={() => load(code)} disabled={!code.trim()} title="Load" className="px-2 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40"><Upload className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                    <button onClick={clearAll} className={`w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded border transition-colors ${armed ? 'border-error bg-error/15 text-error' : 'border-border bg-dark-900 text-text-secondary hover:text-error hover:border-error/40'}`}>
                        <Eraser className="w-3.5 h-3.5" /> {armed ? 'Click again to clear every card' : 'Clear all cards'}
                    </button>
                </div>
            )}
        </div>
    )
}
