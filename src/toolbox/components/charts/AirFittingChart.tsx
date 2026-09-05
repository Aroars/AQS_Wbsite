import { useState, useMemo } from 'react'
import { threadTypes, threadSizes, threadCrossover, getThreadTypes, getSizeList } from '@/toolbox/data/airFittingData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function AirFittingChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('airfitting'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [threadType, setThreadType] = useState('')
    const [threadSize, setThreadSize] = useState('')

    const types = useMemo(() => getThreadTypes(), [])
    const sizes = useMemo(() => threadType ? getSizeList(threadType) : [], [threadType])
    const typeInfo: any = threadType ? (threadTypes as any)[threadType] : null
    const sizeInfo: any = useMemo(() => {
        if (!threadType || !threadSize) return null
        return (threadSizes as any)?.[threadType]?.[threadSize] ?? null
    }, [threadType, threadSize])

    // Filter crossover groups relevant to the selected thread type
    // No selection = show the complete crossover matrix (the chart's core value, zero clicks)
    const relevantCrossover = useMemo(() => {
        if (!threadType) return threadCrossover
        return threadCrossover.filter((group: any) => group.threads.includes(threadType))
    }, [threadType])

    // Size-aware crossover: compare this exact size against the same nominal in the
    // other family. The 1/2" and 3/4" sizes share 14 TPI with NPT — the slow-leak trap.
    const sizeComparison = useMemo(() => {
        if (!threadType || !threadSize || !sizeInfo?.tpi) return []
        const nominal = threadSize.replace(/^[GR]/, '')
        const isNptSide = threadType === 'NPT' || threadType === 'NPTF'
        const targets = isNptSide
            ? [
                { family: 'G/BSPP', key: `G${nominal}`, data: (threadSizes as any).BSPP?.[`G${nominal}`] },
                { family: 'R/BSPT', key: `R${nominal}`, data: (threadSizes as any).BSPT?.[`R${nominal}`] },
            ]
            : ['BSPP', 'G', 'BSPT', 'R'].includes(threadType)
            ? [{ family: 'NPT', key: nominal, data: (threadSizes as any).NPT?.[nominal] }]
            : []
        return targets
            .filter((t) => t.data)
            .map((t) => ({
                family: t.family,
                key: t.key,
                tpi: t.data.tpi,
                dOd: t.data.od - sizeInfo.od,
                samePitch: t.data.tpi === sizeInfo.tpi,
            }))
    }, [threadType, threadSize, sizeInfo])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Air Fittings & Threads</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('airfitting')} />
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Thread Type</label>
                    <select value={threadType} onChange={(e) => { setThreadType(e.target.value); setThreadSize('') }}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select thread type...</option>
                        {types.map((t: string) => <option key={t} value={t}>{t} — {(threadTypes as any)[t]?.fullName ?? ''}</option>)}
                    </select>
                </div>
                {typeInfo && (
                    <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary space-y-1">
                        <div><strong>Type:</strong> {typeInfo.type} — {typeInfo.sealMethod}</div>
                        {typeInfo.angle && <div><strong>Angle:</strong> {typeInfo.angle}</div>}
                        <div>{typeInfo.description}</div>
                        {typeInfo.notes && <div className="text-text-muted italic">Note: {typeInfo.notes}</div>}
                    </div>
                )}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Thread Size</label>
                    <select value={threadSize} onChange={(e) => setThreadSize(e.target.value)} disabled={sizes.length === 0}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                        <option value="">Select size...</option>
                        {sizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {sizeInfo && (
                    <div className="bg-dark-700 rounded-lg px-3 py-3 space-y-2">
                        <div className="text-xs text-text-muted uppercase">Size Details</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between"><span className="text-text-secondary">OD:</span><span className="font-mono text-text-primary">{sizeInfo.od} mm</span></div>
                            {sizeInfo.tpi && <div className="flex justify-between"><span className="text-text-secondary">TPI:</span><span className="font-mono text-text-primary">{sizeInfo.tpi}</span></div>}
                            {sizeInfo.pitch && <div className="flex justify-between"><span className="text-text-secondary">Pitch:</span><span className="font-mono text-text-primary">{sizeInfo.pitch} mm</span></div>}
                        </div>
                        {((sizeInfo.tubeSizesMetric?.length ?? 0) > 0 || (sizeInfo.tubeSizesImperial?.length ?? 0) > 0) && (
                            <div className="text-xs text-text-secondary">
                                Push-in tube:{' '}
                                <span className="font-mono text-text-primary">
                                    {sizeInfo.tubeSizesMetric?.length > 0
                                        ? `${sizeInfo.tubeSizesMetric.join(', ')} mm`
                                        : sizeInfo.tubeSizesImperial.map((t: string) => `${t}"`).join(', ')}
                                </span>
                            </div>
                        )}
                        {/* This exact size vs the same nominal in the other standard */}
                        {sizeComparison.length > 0 && (
                            <div className="space-y-1 pt-1 border-t border-border/50">
                                {sizeComparison.map((c) => (
                                    <div key={c.key} className={`px-2.5 py-1.5 rounded border-l-2 text-xs ${
                                        c.samePitch ? 'border-error bg-error/10' : 'border-warning bg-warning/5'
                                    }`}>
                                        <span className="font-mono text-text-primary">{c.key}</span>{' '}
                                        <span className="text-text-secondary">
                                            ({c.tpi} TPI, ΔOD {c.dOd >= 0 ? '+' : ''}{c.dOd.toFixed(2)} mm) —{' '}
                                        </span>
                                        {c.samePitch ? (
                                            <span className="text-error font-medium">
                                                same pitch: threads together smoothly, feels right, then slow-leaks (60°/55° flank mismatch). The classic trap — do not mix.
                                            </span>
                                        ) : (
                                            <span className="text-warning">
                                                different pitch ({c.tpi} vs {sizeInfo.tpi} TPI) — cross-threads within a turn; won't assemble.
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Thread Compatibility Cross-Reference */}
                {relevantCrossover.length > 0 && (
                    <div className="border-t border-border pt-3 space-y-4">
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Thread Compatibility</div>
                        <div className="text-xs text-text-muted">What threads can connect with the selected type.</div>
                        {relevantCrossover.map((group: any, gi: number) => {
                            const isWarning = group.group === 'NOT Compatible'
                            return (
                                <div key={gi}>
                                    <div className={`text-xs font-medium mb-1 ${isWarning ? 'text-error' : 'text-success'}`}>
                                        {isWarning ? '✕ ' : '✓ '}{group.group}
                                    </div>
                                    <div className="px-3 py-1.5 bg-dark-900 rounded text-xs text-text-muted mb-2">
                                        {group.explanation}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead><tr className="text-text-muted border-b border-border">
                                                <th className="py-1.5 text-left">Male</th>
                                                <th className="py-1.5 text-left">Female</th>
                                                <th className="py-1.5 text-left">Seals?</th>
                                                <th className="py-1.5 text-left">Notes</th>
                                            </tr></thead>
                                            <tbody>
                                                {group.compatibility.map((row: any, ri: number) => (
                                                    <tr key={ri} className="border-b border-border/50">
                                                        <td className="py-1.5 font-mono text-text-primary">{row.male}</td>
                                                        <td className="py-1.5 font-mono text-text-primary">{row.female}</td>
                                                        <td className="py-1.5">
                                                            {row.compatible === false
                                                                ? <span className="text-error font-semibold">✕ DO NOT USE</span>
                                                                : row.seals
                                                                ? <span className="text-success">✓ Yes</span>
                                                                : <span className="text-warning">⚠ Seal needed</span>}
                                                        </td>
                                                        <td className="py-1.5 text-text-secondary">{row.note}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
