import { useState } from 'react'
import { Download, Link2, Unlink } from 'lucide-react'
import type { Handoff } from '@/toolbox/hooks/useHandoff'
import { sourceLabel } from '@/toolbox/lib/handoffs'

/**
 * "From" bar on a receiving card: pick a source card (and which copy of it),
 * Pull once, or Link to mirror it live. Cards start independent.
 */
export function SourceBar({ handoff, note }: { handoff: Handoff; note?: string }) {
    const { instances, link, pull, setLink, unlink } = handoff
    const [choice, setChoice] = useState(() => (instances[0] ? `${instances[0].tool}#${instances[0].instanceId}` : ''))
    if (instances.length === 0) return null
    const selected = instances.find((i) => `${i.tool}#${i.instanceId}` === choice) ?? instances[0]

    if (link) {
        const linkedLabel = instances.find((i) => i.tool === link.tool && i.instanceId === link.instanceId)?.label ?? sourceLabel(link.tool)
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-xs">
                <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="flex-1 text-primary">Linked to {linkedLabel} — pulled values update live; editing one of them detaches.</span>
                <button onClick={unlink} className="flex items-center gap-1 px-2 py-1 rounded border border-primary/40 text-primary hover:bg-primary/20 transition-colors"><Unlink className="w-3 h-3" /> Unlink</button>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-text-muted uppercase tracking-wider text-[10px]">From</span>
            <select value={`${selected.tool}#${selected.instanceId}`} onChange={(e) => setChoice(e.target.value)}
                className="px-2 py-1.5 bg-dark-900 border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-primary">
                {instances.map((i) => <option key={`${i.tool}#${i.instanceId}`} value={`${i.tool}#${i.instanceId}`}>{i.label}</option>)}
            </select>
            <button onClick={() => pull(selected.tool, selected.instanceId)} title="Copy that card's values in once"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Download className="w-3.5 h-3.5" /> Pull</button>
            <button onClick={() => setLink(selected.tool, selected.instanceId)} title="Mirror that card live until you edit a pulled value"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-dark-900 text-text-secondary hover:border-primary/40 hover:text-primary transition-colors"><Link2 className="w-3.5 h-3.5" /> Link</button>
            {note && <span className="text-[10px] text-text-muted">{note}</span>}
        </div>
    )
}
