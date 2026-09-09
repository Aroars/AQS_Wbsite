import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ArrowRight, Plus, BarChart3, Calculator, Factory } from 'lucide-react'
import { allTools } from '@/toolbox/lib/toolRegistry'
import type { ToolEntry } from '@/toolbox/lib/toolRegistry'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { useAppStore } from '@/toolbox/stores/appStore'
import { showToast } from '@/toolbox/components/ui/Toast'
import { cn } from '@/toolbox/lib/utils'

/** Detail payload for the cross-component jump event ('toolbox:jump'). */
export interface JumpDetail {
    tab: string
    id: string
    /** Optional sub-section inside the tool (e.g. the safety chart's 'guard' tab) */
    section?: string
}

type PaletteItem =
    | { type: 'tool'; tool: ToolEntry }
    | { type: 'category'; category: string }

const tabIcons: Record<string, typeof BarChart3> = {
    charts: BarChart3,
    calculators: Calculator,
    conveyor: Factory,
}

const tabLabels: Record<string, string> = {
    charts: 'Chart',
    calculators: 'Calculator',
    conveyor: 'Conveyor',
}

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState(0)
    const listRef = useRef<HTMLDivElement>(null)
    const setActiveTab = useAppStore((s) => s.setActiveTab)
    const addConverter = useAppStore((s) => s.addConverter)

    // Opening clears the query in the same state update, so the palette never
    // renders (even for a frame) with a previous session's text in the input
    const openPalette = () => {
        setQuery('')
        setSelected(0)
        setOpen(true)
    }

    // Global shortcut: Cmd/Ctrl+K toggles, Escape closes
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                if (open) setOpen(false)
                else openPalette()
            } else if (e.key === 'Escape') {
                setOpen(false)
            }
        }
        const onOpen = () => openPalette()
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('toolbox:open-palette', onOpen)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('toolbox:open-palette', onOpen)
        }
    }, [open])

    const items = useMemo<PaletteItem[]>(() => {
        const term = query.trim().toLowerCase()
        // Name matches rank above keyword-only matches, tools and converter
        // categories competing in one list — so "belt pull" surfaces the Belt
        // Pull Calculator over every tool that merely mentions belt pull, and
        // "pressure" surfaces the Pressure converter over the pneumatic chart
        const nameScore = (label: string) =>
            label.startsWith(term) ? 0 : label.includes(term) ? 1 : -1
        const scored: { item: PaletteItem; s: number }[] = []
        for (const tool of allTools) {
            const s = term
                ? (() => { const n = nameScore(tool.label.toLowerCase()); return n >= 0 ? n : tool.keywords.includes(term) ? 2 : -1 })()
                : 2
            if (s >= 0) scored.push({ item: { type: 'tool', tool }, s })
        }
        for (const category of Object.keys(unitCategories)) {
            const s = term ? nameScore(category.toLowerCase()) : 3
            if (s >= 0) scored.push({ item: { type: 'category', category }, s })
        }
        return scored.sort((a, b) => a.s - b.s).map(({ item }) => item)
    }, [query])

    // Keep selection in range when the filter narrows
    useEffect(() => { setSelected(0) }, [query])

    const run = (item: PaletteItem) => {
        setOpen(false)
        if (item.type === 'category') {
            addConverter(item.category)
            setActiveTab('convert')
            showToast(`${item.category} converter added`)
            return
        }
        const { tab, id } = item.tool
        setActiveTab(tab)
        // Charts expand-then-scroll via their own listener; other views just
        // need the wrapper scrolled into view once the tab is visible
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent<JumpDetail>('toolbox:jump', { detail: { tab, id } }))
            if (tab !== 'charts') {
                requestAnimationFrame(() => {
                    document.getElementById(`tool-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                })
            }
        })
    }

    const onInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelected((s) => Math.min(s + 1, items.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelected((s) => Math.max(s - 1, 0))
        } else if (e.key === 'Enter' && items[selected]) {
            e.preventDefault()
            run(items[selected])
        }
    }

    // Keep the selected row visible while arrowing through the list
    useEffect(() => {
        listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' })
    }, [selected])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 bg-dark-900/70 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
            <div className="w-full max-w-lg bg-dark-800 border border-border rounded-xl shadow-2xl overflow-hidden">
                <div className="relative border-b border-border">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        // Synchronous focus on mount — a deferred focus would lose
                        // the first keystrokes of someone who types right after ⌘K
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onInputKeyDown}
                        placeholder="Jump to a tool — try belt pull, H7, M8, awg..."
                        className="w-full pl-10 pr-4 py-3 bg-transparent text-text-primary text-sm focus:outline-none"
                    />
                </div>
                <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1.5">
                    {items.length === 0 && (
                        <p className="text-center text-text-muted text-sm py-6">No tools match "{query}"</p>
                    )}
                    {items.map((item, i) => {
                        const isSel = i === selected
                        const key = item.type === 'tool' ? `tool-${item.tool.id}` : `cat-${item.category}`
                        const Icon = item.type === 'tool' ? (tabIcons[item.tool.tab] ?? BarChart3) : Plus
                        return (
                            <button
                                key={key}
                                data-selected={isSel}
                                onClick={() => run(item)}
                                onMouseMove={() => setSelected(i)}
                                className={cn(
                                    'w-full px-3 py-2 flex items-center gap-3 text-left text-sm transition-colors',
                                    isSel ? 'bg-primary/10 text-text-primary' : 'text-text-secondary'
                                )}
                            >
                                <Icon className={cn('w-4 h-4 shrink-0', isSel ? 'text-primary' : 'text-text-muted')} />
                                <span className="flex-1 truncate">
                                    {item.type === 'tool' ? item.tool.label : `${item.category} converter`}
                                </span>
                                <span className="text-xs text-text-muted">
                                    {item.type === 'tool' ? tabLabels[item.tool.tab] ?? item.tool.tab : 'Add'}
                                </span>
                                {isSel && <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />}
                            </button>
                        )
                    })}
                </div>
                <div className="px-3 py-2 border-t border-border flex gap-4 text-[11px] text-text-muted">
                    <span>↑↓ navigate</span>
                    <span>↵ open</span>
                    <span>esc close</span>
                </div>
            </div>
        </div>
    )
}
