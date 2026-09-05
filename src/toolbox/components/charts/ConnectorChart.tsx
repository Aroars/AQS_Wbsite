import { useState, useMemo } from 'react'
import { connectors, protocols } from '@/toolbox/data/connectorData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function ConnectorChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('connector'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [mode, setMode] = useState<'connector' | 'protocol'>('connector')
    const [selected, setSelected] = useState('')

    const connectorList = Object.entries(connectors as any)
    const protocolList = Object.entries(protocols as any)

    const detail: any = useMemo(() => {
        if (!selected) return null
        if (mode === 'connector') return (connectors as any)[selected]
        return (protocols as any)[selected]
    }, [mode, selected])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Connectors & Protocols</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('connector')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    {(['connector', 'protocol'] as const).map((m) => (
                        <button key={m} onClick={() => { setMode(m); setSelected('') }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {m === 'connector' ? 'Connectors' : 'Protocols'}
                        </button>
                    ))}
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">
                        {mode === 'connector' ? 'Select Connector' : 'Select Protocol'}
                    </label>
                    <select value={selected} onChange={(e) => setSelected(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Choose...</option>
                        {(mode === 'connector' ? connectorList : protocolList).map(([key, val]: any) => (
                            <option key={key} value={key}>{val.name}</option>
                        ))}
                    </select>
                </div>
                {detail && mode === 'connector' && (
                    <div className="space-y-3 mt-2">
                        {detail.description && (
                            <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary leading-relaxed">
                                {detail.description}
                            </div>
                        )}
                        <div className="bg-dark-700 rounded-lg px-3 py-3">
                            <div className="text-xs text-text-muted uppercase mb-2">Specifications</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {detail.category && <div className="flex justify-between"><span className="text-text-secondary">Category:</span><span className="text-text-primary">{detail.category}</span></div>}
                                {detail.pinCount && <div className="flex justify-between"><span className="text-text-secondary">Pins:</span><span className="font-mono text-text-primary">{detail.pinCount}</span></div>}
                                {detail.ipRating && <div className="flex justify-between"><span className="text-text-secondary">IP Rating:</span><span className="font-mono text-text-primary">{detail.ipRating}</span></div>}
                                {detail.maxVoltage && <div className="flex justify-between"><span className="text-text-secondary">Max Voltage:</span><span className="font-mono text-text-primary">{detail.maxVoltage}</span></div>}
                                {detail.maxCurrent && <div className="flex justify-between"><span className="text-text-secondary">Max Current:</span><span className="font-mono text-text-primary">{detail.maxCurrent}</span></div>}
                            </div>
                        </div>
                        {detail.pinout?.length > 0 && (
                            <div className="bg-dark-700 rounded-lg px-3 py-3">
                                <div className="text-xs text-text-muted uppercase mb-2">Pinout</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead><tr className="text-text-muted border-b border-border">
                                            <th className="py-1 text-left">Pin</th><th className="py-1 text-left">Signal</th><th className="py-1 text-left">Description</th>
                                        </tr></thead>
                                        <tbody>
                                            {detail.pinout.map((p: any, i: number) => (
                                                <tr key={i} className="border-b border-border/50">
                                                    <td className="py-1 font-mono text-primary">{p.pin}</td>
                                                    <td className="py-1 font-mono text-text-primary">{p.signal}</td>
                                                    <td className="py-1 text-text-secondary">{p.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {detail.commonUses?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {detail.commonUses.map((use: string) => (
                                    <span key={use} className="px-2 py-0.5 bg-dark-700 rounded text-xs text-text-secondary">{use}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {detail && mode === 'protocol' && (
                    <div className="space-y-3 mt-2">
                        {detail.description && (
                            <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary leading-relaxed">
                                {detail.description}
                            </div>
                        )}
                        <div className="bg-dark-700 rounded-lg px-3 py-3">
                            <div className="text-xs text-text-muted uppercase mb-2">Protocol Details</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {detail.category && <div className="flex justify-between"><span className="text-text-secondary">Category:</span><span className="text-text-primary">{detail.category}</span></div>}
                                {detail.dataRate && <div className="flex justify-between"><span className="text-text-secondary">Data Rate:</span><span className="font-mono text-text-primary">{detail.dataRate}</span></div>}
                                {detail.maxNodes && <div className="flex justify-between"><span className="text-text-secondary">Max Nodes:</span><span className="font-mono text-text-primary">{detail.maxNodes}</span></div>}
                                {detail.maxLength && <div className="flex justify-between"><span className="text-text-secondary">Max Length:</span><span className="font-mono text-text-primary">{detail.maxLength}</span></div>}
                                {detail.topology && <div className="flex justify-between"><span className="text-text-secondary">Topology:</span><span className="text-text-primary">{detail.topology}</span></div>}
                                {detail.deterministic && <div className="flex justify-between"><span className="text-text-secondary">Deterministic:</span><span className="text-text-primary">{detail.deterministic}</span></div>}
                            </div>
                        </div>
                        {detail.commonBrands?.length > 0 && (
                            <div>
                                <div className="text-xs text-text-muted uppercase mb-1">Common Brands</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {detail.commonBrands.map((b: string) => (
                                        <span key={b} className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-xs text-primary">{b}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
