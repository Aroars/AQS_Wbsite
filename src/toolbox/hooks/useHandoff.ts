import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { instanceKey, MAIN } from '@/toolbox/stores/migrate'
import { handoffs, sourceLabel, type HandoffSource } from '@/toolbox/lib/handoffs'
import { useInstanceInbox } from '@/toolbox/hooks/useToolState'
import { showToast } from '@/toolbox/components/ui/Toast'

export interface SourceInstance {
    tool: string
    instanceId: string
    label: string
}

export interface Handoff {
    /** Source cards this card can pull from */
    sources: HandoffSource[]
    /** Every instance (tab and Home copies) of every source */
    instances: SourceInstance[]
    link: { tool: string; instanceId: string } | null
    linkedWrites: string[]
    pull: (tool: string, instanceId: string) => boolean
    setLink: (tool: string, instanceId: string) => void
    unlink: () => void
    /** Call with the fields a user edit touches; editing a linked field detaches the link */
    touch: (fields: string[]) => void
}

/**
 * Receiver-side handoff: this card pulls a snapshot of a source card's values,
 * or links to it and mirrors them live until the user edits one of the linked
 * fields. `apply` writes a payload into the card WITHOUT going through the
 * card's user-edit path (so applying never detaches the link). Legacy one-shot
 * sends still arrive through the inbox.
 */
export function useHandoff(toolId: string, instanceId: string, apply: (payload: Record<string, unknown>) => void): Handoff {
    const applyRef = useRef(apply)
    applyRef.current = apply
    const key = instanceKey(toolId, instanceId)
    const link = useAppStore((s) => s.links[key] ?? null)
    const pins = useAppStore((s) => s.pinnedCalculators)
    const cardTags = useAppStore((s) => s.cardTags)
    const setLinkStore = useAppStore((s) => s.setLink)
    const clearLink = useAppStore((s) => s.clearLink)
    const sources = handoffs[toolId] ?? []

    const instances: SourceInstance[] = sources.flatMap((src) => {
        const copies = pins.filter((p) => p.toolId === src.tool)
        const name = sourceLabel(src.tool)
        const tagged = (instanceId: string, fallback: string) => {
            const tag = cardTags[instanceKey(src.tool, instanceId)]
            return tag ? `${name} ${tag}` : fallback
        }
        return [
            { tool: src.tool, instanceId: MAIN, label: tagged(MAIN, copies.length ? `${name} (tab)` : name) },
            ...copies.map((p, i) => ({ tool: src.tool, instanceId: p.instanceId, label: tagged(p.instanceId, `${name} (Home copy ${i + 1})`) })),
        ]
    })

    const build = useCallback((tool: string, srcInstance: string) => {
        const src = sources.find((x) => x.tool === tool)
        if (!src) return null
        const st = useAppStore.getState()
        return src.build(st.instanceStates[instanceKey(tool, srcInstance)] ?? null, st.chains[srcInstance])
    }, [sources])

    const pull = (tool: string, srcInstance: string) => {
        const p = build(tool, srcInstance)
        if (!p) { showToast(`${sourceLabel(tool)} has nothing to pull yet`); return false }
        applyRef.current(p)
        showToast(`Pulled from ${sourceLabel(tool)}`)
        return true
    }

    // Live link: re-apply whenever the source instance's stored state (or chain) changes
    const linkTool = link?.tool; const linkInstance = link?.instanceId
    useEffect(() => {
        if (!linkTool || !linkInstance) return
        const src = sources.find((x) => x.tool === linkTool)
        if (!src) return
        const srcKey = instanceKey(linkTool, linkInstance)
        let last: string | null = null
        const run = (st: ReturnType<typeof useAppStore.getState>) => {
            const raw = st.instanceStates[srcKey] ?? null
            const chain = st.chains[linkInstance]
            const sig = `${raw ?? ''}|${chain ? JSON.stringify(chain) : ''}`
            if (sig === last) return
            last = sig
            const p = src.build(raw, chain)
            if (p) applyRef.current(p)
        }
        run(useAppStore.getState())
        return useAppStore.subscribe(run)
    }, [linkTool, linkInstance, sources])

    useInstanceInbox(toolId, instanceId, (p) => applyRef.current(p))

    const linkedWrites = link ? (sources.find((x) => x.tool === link.tool)?.writes ?? []) : []
    return {
        sources, instances, link, linkedWrites,
        pull,
        setLink: (tool, srcInstance) => { setLinkStore(toolId, instanceId, { tool, instanceId: srcInstance }); showToast(`Linked to ${sourceLabel(tool)} — edits there update this card`) },
        unlink: () => clearLink(toolId, instanceId),
        touch: (fields) => { if (link && fields.some((f) => linkedWrites.includes(f))) { clearLink(toolId, instanceId); showToast('Unlinked — you edited a pulled value') } },
    }
}
