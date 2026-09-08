import { ConveyorFlow } from '@/toolbox/components/conveyor/ConveyorFlow'
import { ConveyorSpec } from '@/toolbox/components/conveyor/ConveyorSpec'
import { BeltLoadCalculator } from '@/toolbox/components/conveyor/BeltLoadCalculator'
import { BeltPullCalculator } from '@/toolbox/components/conveyor/BeltPullCalculator'
import { WearstripCalculator } from '@/toolbox/components/conveyor/WearstripCalculator'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'

export function ConveyorView() {
    return (
        // tool-* ids are command-palette scroll anchors
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div id="tool-conveyorFlow" className="scroll-mt-28"><ToolBoundary label="Conveyor Flow"><ConveyorFlow /></ToolBoundary></div>
            <div id="tool-beltLoad" className="scroll-mt-28"><ToolBoundary label="Belt Load / Throughput"><BeltLoadCalculator /></ToolBoundary></div>
            <div id="tool-conveyorSpec" className="scroll-mt-28"><ToolBoundary label="Conveyor Spec Solver"><ConveyorSpec /></ToolBoundary></div>
            <div id="tool-beltPull" className="scroll-mt-28"><ToolBoundary label="Belt Pull Calculator"><BeltPullCalculator /></ToolBoundary></div>
            <div id="tool-wearstrip" className="scroll-mt-28"><ToolBoundary label="Wearstrip Span Calculator"><WearstripCalculator /></ToolBoundary></div>
        </div>
    )
}
