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
        <div className="bg-surface-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-strong">Connectors & Protocols</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('connector')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    {(['connector', 'protocol'] as const).map((m) => (
                        <button key={m} onClick={() => { setMode(m); setSelected('') }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                mode === m ? 'border-accent-text bg-accent-text/10 text-accent-text' : 'border-border bg-surface-page text-text-body hover:border-border'
                            }`}>
                            {m === 'connector' ? 'Connectors' : 'Protocols'}
                        </button>
                    ))}
                </div>
                <div>
                    <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">
                        {mode === 'connector' ? 'Select Connector' : 'Select Protocol'}
                    </label>
                    <select value={selected} onChange={(e) => setSelected(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                        <option value="">Choose...</option>
                        {(mode === 'connector' ? connectorList : protocolList).map(([key, val]: any) => (
                            <option key={key} value={key}>{val.name}</option>
                        ))}
                    </select>
                </div>
                {detail && mode === 'connector' && (
                    <div className="space-y-3 mt-2">
                        {detail.description && (
                            <div className="px-3 py-2 bg-accent-text/5 border-l-2 border-accent-text rounded text-xs text-text-body leading-relaxed">
                                {detail.description}
                            </div>
                        )}
                        <div className="readout rounded-lg border border-border px-3 py-3">
                            <div className="text-xs text-text-dim uppercase mb-2">Specifications</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {detail.category && <div className="flex justify-between"><span className="text-text-body">Category:</span><span className="text-text-strong">{detail.category}</span></div>}
                                {detail.pinCount && <div className="flex justify-between"><span className="text-text-body">Pins:</span><span className="font-mono text-text-strong">{detail.pinCount}</span></div>}
                                {detail.ipRating && <div className="flex justify-between"><span className="text-text-body">IP Rating:</span><span className="font-mono text-text-strong">{detail.ipRating}</span></div>}
                                {detail.maxVoltage && <div className="flex justify-between"><span className="text-text-body">Max Voltage:</span><span className="font-mono text-text-strong">{detail.maxVoltage}</span></div>}
                                {detail.maxCurrent && <div className="flex justify-between"><span className="text-text-body">Max Current:</span><span className="font-mono text-text-strong">{detail.maxCurrent}</span></div>}
                            </div>
                        </div>
                        {detail.pinout?.length > 0 && (
                            <div className="readout rounded-lg border border-border px-3 py-3">
                                <div className="text-xs text-text-dim uppercase mb-2">Pinout</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead><tr className="bg-surface-page text-text-dim border-b border-border">
                                            <th className="px-2 py-1 text-left">Pin</th><th className="px-2 py-1 text-left">Signal</th><th className="px-2 py-1 text-left">Description</th>
                                        </tr></thead>
                                        <tbody>
                                            {detail.pinout.map((p: any, i: number) => (
                                                <tr key={i} className="border-b border-border-soft hover:bg-surface-card-hover">
                                                    <td className="px-2 py-1 font-mono text-accent-text">{p.pin}</td>
                                                    <td className="px-2 py-1 font-mono text-text-strong">{p.signal}</td>
                                                    <td className="px-2 py-1 text-text-body">{p.description}</td>
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
                                    <span key={use} className="px-2 py-0.5 bg-surface-page border border-border-soft rounded text-xs text-text-body">{use}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {detail && mode === 'protocol' && (
                    <div className="space-y-3 mt-2">
                        {detail.description && (
                            <div className="px-3 py-2 bg-accent-text/5 border-l-2 border-accent-text rounded text-xs text-text-body leading-relaxed">
                                {detail.description}
                            </div>
                        )}
                        <div className="readout rounded-lg border border-border px-3 py-3">
                            <div className="text-xs text-text-dim uppercase mb-2">Protocol Details</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {detail.category && <div className="flex justify-between"><span className="text-text-body">Category:</span><span className="text-text-strong">{detail.category}</span></div>}
                                {detail.dataRate && <div className="flex justify-between"><span className="text-text-body">Data Rate:</span><span className="font-mono text-text-strong">{detail.dataRate}</span></div>}
                                {detail.maxNodes && <div className="flex justify-between"><span className="text-text-body">Max Nodes:</span><span className="font-mono text-text-strong">{detail.maxNodes}</span></div>}
                                {detail.maxLength && <div className="flex justify-between"><span className="text-text-body">Max Length:</span><span className="font-mono text-text-strong">{detail.maxLength}</span></div>}
                                {detail.topology && <div className="flex justify-between"><span className="text-text-body">Topology:</span><span className="text-text-strong">{detail.topology}</span></div>}
                                {detail.deterministic && <div className="flex justify-between"><span className="text-text-body">Deterministic:</span><span className="text-text-strong">{detail.deterministic}</span></div>}
                            </div>
                        </div>
                        {detail.commonBrands?.length > 0 && (
                            <div>
                                <div className="text-xs text-text-dim uppercase mb-1">Common Brands</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {detail.commonBrands.map((b: string) => (
                                        <span key={b} className="px-2 py-0.5 bg-accent-text/10 border border-accent-text/20 rounded text-xs text-accent-text">{b}</span>
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
