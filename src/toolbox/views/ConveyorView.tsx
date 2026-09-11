import { LineThroughputCard } from '@/toolbox/components/conveyor/LineThroughputCard'
import { ConveyorSpeed } from '@/toolbox/components/conveyor/ConveyorSpeed'
import { ConveyorSpec } from '@/toolbox/components/conveyor/ConveyorSpec'
import { BeltPullCalculator } from '@/toolbox/components/conveyor/BeltPullCalculator'
import { WearstripCalculator } from '@/toolbox/components/conveyor/WearstripCalculator'
import { LineFlowSimulator } from '@/toolbox/components/conveyor/LineFlowSimulator'
import { AccumulationCalculator } from '@/toolbox/components/conveyor/AccumulationCalculator'
import { DriveMotorCalculator } from '@/toolbox/components/conveyor/DriveMotorCalculator'
import { DriveShaftCalculator } from '@/toolbox/components/conveyor/DriveShaftCalculator'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'

export function ConveyorView() {
    return (
        // Chain order: what the plant said → what the conveyor must do → what the belt and drive need.
        // tool-* ids are command-palette / deep-link scroll anchors
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div id="tool-beltLoad" className="scroll-mt-28"><ToolBoundary label="Belt Load (lb/ft)"><LineThroughputCard /></ToolBoundary></div>
            <div id="tool-conveyorFlow" className="scroll-mt-28"><ToolBoundary label="Conveyor Speed & Throughput"><ConveyorSpeed /></ToolBoundary></div>
            <div id="tool-accumulation" className="scroll-mt-28"><ToolBoundary label="Accumulation Buffer"><AccumulationCalculator /></ToolBoundary></div>
            <div id="tool-conveyorSpec" className="scroll-mt-28"><ToolBoundary label="Incline Conveyor Length & Angle"><ConveyorSpec /></ToolBoundary></div>
            <div id="tool-beltPull" className="scroll-mt-28 lg:col-span-2"><ToolBoundary label="Belt Pull Calculator"><BeltPullCalculator /></ToolBoundary></div>
            <div id="tool-driveMotor" className="scroll-mt-28"><ToolBoundary label="Torque & Motor"><DriveMotorCalculator /></ToolBoundary></div>
            <div id="tool-driveShaft" className="scroll-mt-28"><ToolBoundary label="Drive Shaft Deflection & Twist"><DriveShaftCalculator /></ToolBoundary></div>
            <div id="tool-wearstrip" className="scroll-mt-28"><ToolBoundary label="Wearstrip Span Calculator"><WearstripCalculator /></ToolBoundary></div>
            <div id="tool-lineFlow" className="scroll-mt-28"><ToolBoundary label="Line Flow Simulator"><LineFlowSimulator /></ToolBoundary></div>
        </div>
    )
}
