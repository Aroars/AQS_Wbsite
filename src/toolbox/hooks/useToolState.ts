import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { instanceKey, MAIN } from '@/toolbox/stores/migrate'

/**
 * Persisted state for one card instance (store.instanceStates, keyed by tool +
 * instance). Restores a saved object over `initial` so new fields get defaults
 * — or through `restore` when a card needs to migrate older shapes — then
 * writes every change back as JSON. A pinned card on Home is its own instance.
 */
export function useInstanceState<T extends object>(
    toolId: string,
    instanceId: string,
    initial: T,
    restore?: (raw: string) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const setInstanceState = useAppStore((s) => s.setInstanceState)
    const [state, setState] = useState<T>(() => readInstance(toolId, instanceId, initial, restore))
    // Clear, load, or pull replaced this instance's stored state: re-read it instead of writing ours over it
    const epoch = useAppStore((s) => s.epochs[instanceKey(toolId, instanceId)] ?? 0)
    const pageEpoch = useAppStore((s) => s.pageEpoch)
    const seen = useRef({ epoch, pageEpoch })
    const skipWrite = useRef(false)
    useEffect(() => {
        if (seen.current.epoch === epoch && seen.current.pageEpoch === pageEpoch) return
        seen.current = { epoch, pageEpoch }
        skipWrite.current = true
        setState(readInstance(toolId, instanceId, initial, restore))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epoch, pageEpoch])
    useEffect(() => {
        if (skipWrite.current) { skipWrite.current = false; return }
        setInstanceState(toolId, instanceId, JSON.stringify(state))
    }, [state, toolId, instanceId, setInstanceState])
    return [state, setState]
}

function readInstance<T extends object>(toolId: string, instanceId: string, initial: T, restore?: (raw: string) => T): T {
    try {
        const raw = useAppStore.getState().instanceStates[instanceKey(toolId, instanceId)]
        if (raw) {
            if (restore) return restore(raw)
            const saved = JSON.parse(raw)
            if (saved && typeof saved === 'object') return { ...initial, ...saved }
        }
    } catch { /* fall back to defaults */ }
    return initial
}

/** For cards that keep their own useState: run `reload` when the instance was cleared or loaded from outside */
export function useInstanceReload(toolId: string, instanceId: string, reload: () => void): void {
    const epoch = useAppStore((s) => s.epochs[instanceKey(toolId, instanceId)] ?? 0)
    const pageEpoch = useAppStore((s) => s.pageEpoch)
    const first = useRef(true)
    const fn = useRef(reload); fn.current = reload
    useEffect(() => {
        if (first.current) { first.current = false; return }
        fn.current()
    }, [epoch, pageEpoch])
}

/** One-shot payloads addressed to this card instance (store.toolInbox). Handler runs once per message, then the inbox clears. */
export function useInstanceInbox(toolId: string, instanceId: string, onMessage: (payload: Record<string, unknown>) => void): void {
    const handler = useRef(onMessage)
    handler.current = onMessage
    useEffect(() => {
        const key = instanceKey(toolId, instanceId)
        return useAppStore.subscribe((state, prev) => {
            const msg = state.toolInbox[key]
            if (msg && msg !== prev.toolInbox[key]) {
                handler.current(msg)
                useAppStore.getState().clearToolInbox(toolId, instanceId)
            }
        })
    }, [toolId, instanceId])
}

export { MAIN }
export const asNumber = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
