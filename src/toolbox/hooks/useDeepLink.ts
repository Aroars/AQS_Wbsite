import { useEffect } from 'react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { allTools } from '@/toolbox/lib/toolRegistry'
import type { TabId } from '@/toolbox/lib/types'

const TAB_IDS: readonly TabId[] = ['home', 'convert', 'calculators', 'conveyor', 'charts']

/**
 * URL hash deep links into the toolbox, so the crawlable tool index below the
 * app (and external links) can land on a specific tool:
 *   /toolbox#beltPull      → Conveyor tab, scrolled to Belt Pull
 *   /toolbox#tool-wiregauge → Charts tab, Wire Gauge expanded
 *   /toolbox#charts        → just switch to the Charts tab
 * Applies on mount and again on every hashchange. Reuses the same
 * 'toolbox:jump' event the command palette dispatches.
 */
export function useDeepLink() {
    const setActiveTab = useAppStore((s) => s.setActiveTab)

    useEffect(() => {
        const apply = () => {
            const raw = decodeURIComponent(window.location.hash.replace(/^#/, '')).replace(/^tool-/, '')
            if (!raw) return

            const tool = allTools.find((t) => t.id === raw)
            if (tool) {
                setActiveTab(tool.tab)
                requestAnimationFrame(() => {
                    window.dispatchEvent(new CustomEvent('toolbox:jump', { detail: { tab: tool.tab, id: tool.id } }))
                    if (tool.tab !== 'charts') {
                        requestAnimationFrame(() => {
                            document.getElementById(`tool-${tool.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        })
                    }
                })
                return
            }

            if ((TAB_IDS as readonly string[]).includes(raw)) {
                setActiveTab(raw as TabId)
                requestAnimationFrame(() => {
                    document.getElementById('toolbox-app')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                })
            }
        }

        apply()
        window.addEventListener('hashchange', apply)
        return () => window.removeEventListener('hashchange', apply)
    }, [setActiveTab])
}
