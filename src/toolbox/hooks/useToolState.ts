import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/toolbox/stores/appStore'

/**
 * Persisted state for a card, keyed by tool id (store.toolStates). Restores a
 * saved object over `initial` so new fields get defaults, then writes every
 * change back as JSON.
 */
export function useToolState<T extends object>(toolId: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const setToolState = useAppStore((s) => s.setToolState)
    const [state, setState] = useState<T>(() => {
        try {
            const raw = useAppStore.getState().toolStates[toolId]
            if (raw) {
                const saved = JSON.parse(raw)
                if (saved && typeof saved === 'object') return { ...initial, ...saved }
            }
        } catch { /* fall back to defaults */ }
        return initial
    })
    useEffect(() => { setToolState(toolId, JSON.stringify(state)) }, [state, toolId, setToolState])
    return [state, setState]
}

/** One-shot payloads from another card (store.toolInbox). The handler runs once per message, then the inbox clears. */
export function useToolInbox(toolId: string, onMessage: (payload: Record<string, unknown>) => void): void {
    const handler = useRef(onMessage)
    handler.current = onMessage
    useEffect(() => useAppStore.subscribe((state, prev) => {
        const msg = state.toolInbox[toolId]
        if (msg && msg !== prev.toolInbox[toolId]) {
            handler.current(msg)
            useAppStore.getState().clearToolInbox(toolId)
        }
    }), [toolId])
}

export const asNumber = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
