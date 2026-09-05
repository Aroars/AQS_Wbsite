import { useState, useMemo } from 'react'
import { getAllMaterials, getCompatibleMaterials, getAvailableConditions, getFrictionCoefficient } from '@/toolbox/data/frictionData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function FrictionChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('friction'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    // Sensible defaults so the chart shows a real answer on first paint
    const [matA, setMatA] = useState('Steel')
    const [matB, setMatB] = useState('Steel')
    const [condition, setCondition] = useState('dry')

    const allMaterials = useMemo(() => getAllMaterials() as string[], [])
    const compatibleB = useMemo(() => (matA ? getCompatibleMaterials(matA) : allMaterials) as string[], [matA, allMaterials])
    const conditions = useMemo(() => (matA && matB) ? getAvailableConditions(matA, matB) : [], [matA, matB])
    const result = useMemo(() => {
        if (!matA || !matB || !condition) return null
        return getFrictionCoefficient(matA, matB, condition)
    }, [matA, matB, condition])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Friction Coefficients</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('friction')} />
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Material A</label>
                    <select value={matA} onChange={(e) => { setMatA(e.target.value); setMatB(''); setCondition('') }}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select material...</option>
                        {allMaterials.map((m: string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Material B</label>
                    <select value={matB} onChange={(e) => { setMatB(e.target.value); setCondition('') }} disabled={!matA}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                        <option value="">Select material...</option>
                        {compatibleB.map((m: string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Surface Condition</label>
                    <select value={condition} onChange={(e) => setCondition(e.target.value)} disabled={conditions.length === 0}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                        <option value="">Select condition...</option>
                        {conditions.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                {result && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Static (μₛ)</div>
                            <div className="font-mono text-lg font-semibold text-primary">{result.static?.toFixed(2) ?? 'N/A'}</div>
                        </div>
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Kinetic (μₖ)</div>
                            <div className="font-mono text-lg font-semibold text-primary">{result.kinetic?.toFixed(2) ?? 'N/A'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
