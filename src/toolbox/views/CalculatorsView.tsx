import { AreaCalculator } from '@/toolbox/components/calculators/AreaCalculator'
import { ExpressionCalculator } from '@/toolbox/components/calculators/ExpressionCalculator'
import { PowerCalculator } from '@/toolbox/components/calculators/PowerCalculator'
import { GiveawayCalculator } from '@/toolbox/components/calculators/GiveawayCalculator'
import { DowntimeCalculator } from '@/toolbox/components/calculators/DowntimeCalculator'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'

export function CalculatorsView() {
    return (
        <div className="space-y-6">
            {/* tool-* ids are command-palette scroll anchors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div id="tool-giveaway" className="scroll-mt-28"><ToolBoundary label="Product Giveaway"><GiveawayCalculator /></ToolBoundary></div>
                <div id="tool-downtime" className="scroll-mt-28"><ToolBoundary label="Line Downtime Cost"><DowntimeCalculator /></ToolBoundary></div>
                <div id="tool-expression" className="scroll-mt-28"><ToolBoundary label="Expression Calculator"><ExpressionCalculator /></ToolBoundary></div>
                <div id="tool-area" className="scroll-mt-28"><ToolBoundary label="Area Calculator"><AreaCalculator /></ToolBoundary></div>
                <div id="tool-power" className="scroll-mt-28"><ToolBoundary label="Power Calculator"><PowerCalculator /></ToolBoundary></div>
            </div>
        </div>
    )
}
