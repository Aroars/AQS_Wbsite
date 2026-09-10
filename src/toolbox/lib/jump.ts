import { useAppStore } from '@/toolbox/stores/appStore'
import type { TabId } from '@/toolbox/lib/types'
import type { JumpDetail } from '@/toolbox/components/ui/CommandPalette'

/** Open a tool from another card: switch tab, announce the jump (URL follows), scroll to it */
export function jumpToTool(tab: TabId, id: string): void {
    useAppStore.getState().setActiveTab(tab)
    requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent<JumpDetail>('toolbox:jump', { detail: { tab, id } }))
        if (tab !== 'charts') {
            requestAnimationFrame(() => {
                document.getElementById(`tool-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
        }
    })
}
