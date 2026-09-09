import { useEffect } from 'react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { allTools } from '@/toolbox/lib/toolRegistry'
import type { TabId } from '@/toolbox/lib/types'
import type { JumpDetail } from '@/toolbox/components/ui/CommandPalette'

const TAB_IDS: readonly TabId[] = ['home', 'convert', 'calculators', 'conveyor', 'charts']

/**
 * Deep links into the toolbox. Two forms:
 *   /toolbox/belt-pull-calculator   → the tool's own page passes initialTool; the app opens it
 *   /toolbox#beltPull, #tool-x, #charts → legacy hash links, still honoured
 * Every jump (palette, hash, initial tool) also rewrites the address bar to the
 * tool's page URL with history.replaceState, so switching tools inside the app
 * never navigates — the URL just follows the work for sharing and bookmarks.
 */
export function useDeepLink(initialTool?: string, initialSection?: string) {
    const setActiveTab = useAppStore((s) => s.setActiveTab)

    useEffect(() => {
        const jumpTo = (id: string, section?: string, scroll = true) => {
            const tool = allTools.find((t) => t.id === id)
            if (!tool) return false
            if (section) useAppStore.getState().setPendingSection(tool.id, section)
            setActiveTab(tool.tab)
            requestAnimationFrame(() => {
                window.dispatchEvent(new CustomEvent<JumpDetail>('toolbox:jump', { detail: { tab: tool.tab, id: tool.id, section } }))
                if (scroll && tool.tab !== 'charts') {
                    requestAnimationFrame(() => {
                        document.getElementById(`tool-${tool.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    })
                }
            })
            return true
        }

        const applyHash = () => {
            const raw = decodeURIComponent(window.location.hash.replace(/^#/, '')).replace(/^tool-/, '')
            if (!raw) return false
            if (jumpTo(raw)) return true
            if ((TAB_IDS as readonly string[]).includes(raw)) {
                setActiveTab(raw as TabId)
                requestAnimationFrame(() => {
                    document.getElementById('toolbox-app')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                })
                return true
            }
            return false
        }

        // Keep the address bar on the tool's page as the user moves around the app
        const followUrl = (e: Event) => {
            const { id } = (e as CustomEvent<JumpDetail>).detail
            const tool = allTools.find((t) => t.id === id)
            if (!tool || !window.location.pathname.startsWith('/toolbox')) return
            const next = `/toolbox/${tool.slug}`
            if (window.location.pathname !== next) window.history.replaceState(window.history.state, '', next)
        }

        // A tool page opens its tool without scrolling — the intro above the app is the point of the page
        if (!applyHash() && initialTool) jumpTo(initialTool, initialSection, false)
        window.addEventListener('hashchange', applyHash)
        window.addEventListener('toolbox:jump', followUrl)
        return () => {
            window.removeEventListener('hashchange', applyHash)
            window.removeEventListener('toolbox:jump', followUrl)
        }
    }, [setActiveTab, initialTool, initialSection])
}
