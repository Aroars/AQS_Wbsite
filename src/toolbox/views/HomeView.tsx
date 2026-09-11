import { useAppStore } from '@/toolbox/stores/appStore'
import { ConverterCard } from '@/toolbox/components/converter/ConverterCard'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'
import { Pin, ChevronUp, ChevronDown } from 'lucide-react'

// Charts
import { FrictionChart } from '@/toolbox/components/charts/FrictionChart'
import { BoltChart } from '@/toolbox/components/charts/BoltChart'
import { SheetMetalChart } from '@/toolbox/components/charts/SheetMetalChart'
import { PneumaticChart } from '@/toolbox/components/charts/PneumaticChart'
import { WireGaugeChart } from '@/toolbox/components/charts/WireGaugeChart'
import { ConnectorChart } from '@/toolbox/components/charts/ConnectorChart'
import { ToleranceChart } from '@/toolbox/components/charts/ToleranceChart'
import { AirFittingChart } from '@/toolbox/components/charts/AirFittingChart'
import { HubMotorChart } from '@/toolbox/components/charts/HubMotorChart'
import { SafetyChart } from '@/toolbox/components/charts/SafetyChart'

// Calculators
import { ExpressionCalculator } from '@/toolbox/components/calculators/ExpressionCalculator'
import { AreaCalculator } from '@/toolbox/components/calculators/AreaCalculator'
import { PowerCalculator } from '@/toolbox/components/calculators/PowerCalculator'
import { ConveyorSpeed } from '@/toolbox/components/conveyor/ConveyorSpeed'
import { LineFlowSimulator } from '@/toolbox/components/conveyor/LineFlowSimulator'
import { ConveyorSpec } from '@/toolbox/components/conveyor/ConveyorSpec'
import { BeltPullCalculator } from '@/toolbox/components/conveyor/BeltPullCalculator'
import { LineThroughputCard } from '@/toolbox/components/conveyor/LineThroughputCard'
import { AccumulationCalculator } from '@/toolbox/components/conveyor/AccumulationCalculator'
import { DriveMotorCalculator } from '@/toolbox/components/conveyor/DriveMotorCalculator'
import { DriveShaftCalculator } from '@/toolbox/components/conveyor/DriveShaftCalculator'
import { GiveawayCalculator } from '@/toolbox/components/calculators/GiveawayCalculator'
import { DowntimeCalculator } from '@/toolbox/components/calculators/DowntimeCalculator'
import { WearstripCalculator } from '@/toolbox/components/conveyor/WearstripCalculator'

const chartComponents: Record<string, React.FC> = {
    friction: FrictionChart,
    bolt: BoltChart,
    sheetmetal: SheetMetalChart,
    pneumatic: PneumaticChart,
    wiregauge: WireGaugeChart,
    connector: ConnectorChart,
    tolerance: ToleranceChart,
    airfitting: AirFittingChart,
    hubmotor: HubMotorChart,
    safety: SafetyChart,
}

const calcComponents: Record<string, React.FC<{ instanceId?: string }>> = {
    expression: ExpressionCalculator,
    area: AreaCalculator,
    power: PowerCalculator,
    conveyorFlow: ConveyorSpeed,
    lineFlow: LineFlowSimulator,
    conveyorSpec: ConveyorSpec,
    beltPull: BeltPullCalculator,
    beltLoad: LineThroughputCard,
    accumulation: AccumulationCalculator,
    driveMotor: DriveMotorCalculator,
    driveShaft: DriveShaftCalculator,
    giveaway: GiveawayCalculator,
    downtime: DowntimeCalculator,
    wearstrip: WearstripCalculator,
}

/** Wraps a pinned card with hover move-up/down controls (list order = grid order) */
function PinnedSlot({ kind, id, index, count, children }: {
    kind: 'chart' | 'calculator'
    id: string
    index: number
    count: number
    children: React.ReactNode
}) {
    const movePinned = useAppStore((s) => s.movePinned)
    return (
        <div className="relative group">
            {count > 1 && (
                <div className="absolute -top-2.5 right-12 z-10 hidden group-hover:flex gap-1">
                    <button
                        onClick={() => movePinned(kind, id, -1)}
                        disabled={index <= 0}
                        title="Move earlier"
                        className="p-1 rounded-md bg-dark-700 border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors disabled:opacity-30"
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => movePinned(kind, id, 1)}
                        disabled={index >= count - 1}
                        title="Move later"
                        className="p-1 rounded-md bg-dark-700 border border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors disabled:opacity-30"
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
            {children}
        </div>
    )
}

export function HomeView() {
    const savedConverters = useAppStore((s) => s.savedConverters)
    const setActiveTab = useAppStore((s) => s.setActiveTab)
    const pinnedCharts = useAppStore((s) => s.pinnedCharts)
    const pinnedCalculators = useAppStore((s) => s.pinnedCalculators)

    const hasPinned = pinnedCharts.length > 0 || pinnedCalculators.length > 0

    return (
        // Side-by-side split only when there's real width for both columns (>=1024px);
        // in a docked 640-900px panel the columns stack instead of crushing
        <div className={hasPinned ? 'flex flex-col lg:flex-row gap-6' : 'space-y-6'}>
            {/* Converters column */}
            <div className={hasPinned ? 'lg:w-1/3 space-y-4' : ''}>
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                        Converters
                    </h2>
                    <button
                        onClick={() => setActiveTab('convert')}
                        className="text-xs text-primary hover:text-primary-light transition-colors"
                    >
                        + Add
                    </button>
                </div>

                {savedConverters.length === 0 ? (
                    <div className="bg-dark-800 border border-border rounded-xl p-6 text-center">
                        <p className="text-text-secondary text-sm mb-2">No saved converters</p>
                        <button
                            onClick={() => setActiveTab('convert')}
                            className="text-xs text-primary hover:text-primary-light transition-colors"
                        >
                            Browse categories
                        </button>
                    </div>
                ) : (
                    <div className={hasPinned
                        ? 'space-y-4'
                        : 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    }>
                        {savedConverters.map((converter) => (
                            <ToolBoundary key={converter.id} label={`${converter.category} converter`}>
                                <ConverterCard converter={converter} compact={hasPinned} />
                            </ToolBoundary>
                        ))}
                    </div>
                )}
            </div>

            {/* Pinned items column */}
            {hasPinned && (
                <div className="lg:w-2/3 space-y-4">
                    <div className="flex items-center gap-2">
                        <Pin className="w-3.5 h-3.5 text-primary" />
                        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                            Pinned
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                        {pinnedCalculators.map((pin, i) => {
                            const Comp = calcComponents[pin.toolId]
                            return Comp ? (
                                <PinnedSlot key={pin.instanceId} kind="calculator" id={pin.instanceId} index={i} count={pinnedCalculators.length}>
                                    <ToolBoundary label={pin.toolId}><Comp instanceId={pin.instanceId} /></ToolBoundary>
                                </PinnedSlot>
                            ) : null
                        })}
                        {pinnedCharts.map((id, i) => {
                            const Comp = chartComponents[id]
                            return Comp ? (
                                <PinnedSlot key={id} kind="chart" id={id} index={i} count={pinnedCharts.length}>
                                    <ToolBoundary label={id}><Comp /></ToolBoundary>
                                </PinnedSlot>
                            ) : null
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
