import { Pin, PinOff } from 'lucide-react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { MAIN } from '@/toolbox/stores/migrate'

/**
 * Pin control for calculator cards. On the tab card it pins a COPY of the
 * current values to Home (a new, independent instance — pin as often as you
 * like); on a Home copy it unpins that copy.
 */
export function CalcPinButton({ toolId, instanceId }: { toolId: string; instanceId: string }) {
    const pinCount = useAppStore((s) => s.pinnedCalculators.filter((p) => p.toolId === toolId).length)
    const pinCalculator = useAppStore((s) => s.pinCalculator)
    const unpinCalculator = useAppStore((s) => s.unpinCalculator)
    if (instanceId === MAIN) {
        return (
            <button onClick={() => pinCalculator(toolId, MAIN)} title="Pin a copy of this card to Home"
                className="relative p-1 rounded transition-colors text-text-muted hover:text-text-secondary">
                <Pin className="w-3.5 h-3.5" fill={pinCount > 0 ? 'currentColor' : 'none'} />
                {pinCount > 0 && <span className="absolute -top-1 -right-1 text-[9px] font-mono text-primary">{pinCount}</span>}
            </button>
        )
    }
    return (
        <button onClick={() => unpinCalculator(instanceId)} title="Unpin this copy from Home"
            className="p-1 rounded transition-colors text-primary hover:text-error">
            <PinOff className="w-3.5 h-3.5" />
        </button>
    )
}
