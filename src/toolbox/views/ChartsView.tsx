import { useEffect, useRef, useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { FrictionChart } from '@/toolbox/components/charts/FrictionChart'
import { BoltChart } from '@/toolbox/components/charts/BoltChart'
import { SheetMetalChart } from '@/toolbox/components/charts/SheetMetalChart'
import { PneumaticChart } from '@/toolbox/components/charts/PneumaticChart'
import { WireGaugeChart } from '@/toolbox/components/charts/WireGaugeChart'
import { ConnectorChart } from '@/toolbox/components/charts/ConnectorChart'
import { ToleranceChart } from '@/toolbox/components/charts/ToleranceChart'
import { AirFittingChart } from '@/toolbox/components/charts/AirFittingChart'
import { HubMotorChart } from '@/toolbox/components/charts/HubMotorChart'
import { BeltSpecsChart } from '@/toolbox/components/charts/BeltSpecsChart'
import { SafetyChart } from '@/toolbox/components/charts/SafetyChart'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'
import { chartTools } from '@/toolbox/lib/toolRegistry'
import type { JumpDetail } from '@/toolbox/components/ui/CommandPalette'

const chartComponents: Record<string, React.FC> = {
    friction: FrictionChart,
    bolt: BoltChart,
    sheetmetal: SheetMetalChart,
    pneumatic: PneumaticChart,
    wiregauge: WireGaugeChart,
    connector: ConnectorChart,
    tolerance: ToleranceChart,
    airfitting: AirFittingChart,
    beltspecs: BeltSpecsChart,
    hubmotor: HubMotorChart,
    safety: SafetyChart,
}

// Labels and search keywords live in the shared tool registry (also feeds the command palette)
const charts = chartTools.map((t) => ({ ...t, component: chartComponents[t.id] }))

export function ChartsView() {
    const [search, setSearch] = useState('')
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const searchActive = search.trim().length > 0
    const filtered = searchActive
        ? charts.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()) || c.keywords.includes(search.toLowerCase()))
        : charts

    // While searching, matches render expanded — the user is hunting for content
    const isOpen = (id: string) => searchActive || !!expanded[id]

    const jumpTo = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: true }))
        // Wait a frame so the expanded card has a height before scrolling
        requestAnimationFrame(() => {
            cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    }

    // Command palette jumps land here: expand the chart, then scroll to it
    useEffect(() => {
        const onJump = (e: Event) => {
            const { tab, id } = (e as CustomEvent<JumpDetail>).detail
            if (tab === 'charts') jumpTo(id)
        }
        window.addEventListener('toolbox:jump', onJump)
        return () => window.removeEventListener('toolbox:jump', onJump)
    }, [])

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search charts — try M8, H7, NPT, 12awg..."
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary"
                />
            </div>

            {/* Quick-jump chips */}
            <div className="sticky top-0 z-10 -mx-1 px-1 py-2 bg-dark-900/95 backdrop-blur-sm flex flex-wrap gap-1.5">
                {charts.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => jumpTo(c.id)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                            isOpen(c.id)
                                ? 'border-primary/50 bg-primary/10 text-primary'
                                : 'border-border bg-dark-800 text-text-secondary hover:border-text-muted'
                        }`}>
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Charts: collapsed one-line rows by default, expand on demand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {filtered.map((chart) => (
                    <div key={chart.id} ref={(el) => { cardRefs.current[chart.id] = el }} className="scroll-mt-28">
                        {isOpen(chart.id) ? (
                            <div className="space-y-1.5">
                                {!searchActive && (
                                    <button
                                        onClick={() => setExpanded((prev) => ({ ...prev, [chart.id]: false }))}
                                        className="text-xs text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
                                        <ChevronRight className="w-3 h-3 rotate-90" /> Collapse
                                    </button>
                                )}
                                <ToolBoundary label={chart.label}>
                                    <chart.component />
                                </ToolBoundary>
                            </div>
                        ) : (
                            <button
                                onClick={() => setExpanded((prev) => ({ ...prev, [chart.id]: true }))}
                                className="w-full bg-dark-800 border border-border rounded-xl px-4 py-3 flex items-center justify-between text-left hover:border-primary/50 transition-colors group">
                                <span className="text-sm font-medium text-text-primary">{chart.label}</span>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-text-muted py-8">No charts match "{search}"</p>
            )}
        </div>
    )
}
