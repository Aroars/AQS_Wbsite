import { useState, useCallback, useRef } from 'react'
import { Trash2, RotateCcw, ChevronUp, ChevronDown, Tag } from 'lucide-react'
import { useAppStore } from '@/toolbox/stores/appStore'
import { ExpressionParser } from '@/toolbox/lib/calculators/expressionParser'
import { PinButton } from '@/toolbox/components/ui/PinButton'

export function ExpressionCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('expression'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const {
        calculatorMode, setCalculatorMode,
        flowHistory, flowLastAnswer, addFlowEntry, removeFlowEntry, clearFlowHistory, setFlowLastAnswer,
        formulaHistory, formulaLastAnswer, addFormulaEntry, removeFormulaEntry, clearFormulaHistory, setFormulaLastAnswer,
    } = useAppStore()

    const [expression, setExpression] = useState('')
    const [liveResult, setLiveResult] = useState<string | null>(null)
    const [liveError, setLiveError] = useState<string | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editingVarIndex, setEditingVarIndex] = useState<number | null>(null)
    const [varInput, setVarInput] = useState('')
    const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null)
    const [labelInput, setLabelInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const history = calculatorMode === 'flow' ? flowHistory : formulaHistory
    const lastAnswer = calculatorMode === 'flow' ? flowLastAnswer : formulaLastAnswer

    const getFormulaVariables = useCallback((): Record<string, number> => {
        const variables: Record<string, number> = {}
        if (calculatorMode === 'formula') {
            formulaHistory.forEach((e: any) => {
                if (e.variable && typeof e.result === 'number') variables[e.variable] = e.result
            })
        }
        return variables
    }, [calculatorMode, formulaHistory])

    const handleExpressionChange = useCallback((value: string) => {
        setExpression(value)
        if (!value.trim()) {
            setLiveResult(null)
            setLiveError(null)
            return
        }
        try {
            const variables = getFormulaVariables()
            const evalResult = ExpressionParser.evaluate(value, lastAnswer, variables)
            if (evalResult.error) {
                setLiveResult(null)
                setLiveError(evalResult.error)
            } else if (evalResult.pending) {
                setLiveResult(null)
                setLiveError(`undefined: ${evalResult.undefinedVars?.join(', ')}`)
            } else {
                setLiveResult(ExpressionParser.formatResult(evalResult.value ?? 0))
                setLiveError(null)
            }
        } catch (err: any) {
            setLiveResult(null)
            setLiveError(err?.message || 'Invalid expression')
        }
    }, [lastAnswer, getFormulaVariables])

    const handleSubmit = () => {
        if (!expression.trim()) return

        const variables = getFormulaVariables()
        const evalResult = ExpressionParser.evaluate(expression, lastAnswer, variables)

        if (evalResult.error && calculatorMode === 'flow') return
        const result = evalResult.value ?? 0

        if (editingIndex !== null) {
            // Update existing entry - we need to update via the store
            // For now, remove and re-add at the same position
            const entry = history[editingIndex]
            if (entry) {
                if (calculatorMode === 'flow') {
                    removeFlowEntry(entry.id)
                    addFlowEntry({ expression, result })
                    setFlowLastAnswer(result)
                } else {
                    removeFormulaEntry(entry.id)
                    addFormulaEntry({ expression, result, variable: (entry as any).variable })
                    setFormulaLastAnswer(result)
                }
            }
            setEditingIndex(null)
        } else {
            if (calculatorMode === 'flow') {
                addFlowEntry({ expression, result })
                setFlowLastAnswer(result)
            } else {
                addFormulaEntry({ expression, result })
                setFormulaLastAnswer(result)
            }
        }
        setExpression('')
        setLiveResult(null)
        setLiveError(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit()
        if (e.key === 'Escape' && editingIndex !== null) {
            setEditingIndex(null)
            setExpression('')
            setLiveResult(null)
            setLiveError(null)
        }
    }

    const insertText = (text: string) => {
        const input = inputRef.current
        if (!input) {
            setExpression((prev) => prev + text)
            return
        }
        const start = input.selectionStart ?? expression.length
        const end = input.selectionEnd ?? expression.length
        const newExpr = expression.slice(0, start) + text + expression.slice(end)
        setExpression(newExpr)
        handleExpressionChange(newExpr)
        setTimeout(() => {
            input.focus()
            const newPos = start + text.length
            input.setSelectionRange(newPos, newPos)
        }, 0)
    }

    const handleClear = () => {
        if (calculatorMode === 'flow') clearFlowHistory()
        else clearFormulaHistory()
    }

    const handleRemove = (id: string) => {
        if (calculatorMode === 'flow') removeFlowEntry(id)
        else removeFormulaEntry(id)
    }

    const handleClickEntry = (index: number) => {
        const entry = history[index]
        if (!entry) return
        setEditingIndex(index)
        setExpression(entry.expression)
        handleExpressionChange(entry.expression)
        inputRef.current?.focus()
    }

    const handleMoveEntry = (index: number, direction: 'up' | 'down') => {
        if (calculatorMode !== 'flow') return
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= history.length) return
        // Reorder via store - swap IDs in the array
        const store = useAppStore.getState()
        const newHistory = [...store.flowHistory]
        const temp = newHistory[index]
        newHistory[index] = newHistory[newIndex]
        newHistory[newIndex] = temp
        // Recalculate results after reorder
        let runningAns = 0
        newHistory.forEach((entry: any) => {
            const result = ExpressionParser.evaluate(entry.expression, runningAns)
            if (!result.error) {
                entry.result = result.value ?? 0
                runningAns = result.value ?? 0
            }
        })
        useAppStore.setState({ flowHistory: newHistory, flowLastAnswer: runningAns })
    }

    const handleAssignVariable = (index: number) => {
        if (calculatorMode !== 'formula') return
        setEditingVarIndex(index)
        const entry = formulaHistory[index] as any
        setVarInput(entry?.variable || '')
    }

    const saveVariable = () => {
        if (editingVarIndex === null) return
        const newVar = varInput.trim().toUpperCase() || undefined
        // Check for duplicates
        if (newVar) {
            const dup = formulaHistory.find((e: any, i: number) => i !== editingVarIndex && e.variable === newVar)
            if (dup) {
                setEditingVarIndex(null)
                return
            }
        }
        const entry = formulaHistory[editingVarIndex]
        if (entry) {
            const store = useAppStore.getState()
            const newHistory = [...store.formulaHistory]
            newHistory[editingVarIndex] = { ...newHistory[editingVarIndex], variable: newVar } as any
            useAppStore.setState({ formulaHistory: newHistory })
        }
        setEditingVarIndex(null)
    }

    const handleAssignLabel = (index: number) => {
        setEditingLabelIndex(index)
        const entry = history[index] as any
        setLabelInput(entry?.label || '')
    }

    const saveLabel = () => {
        if (editingLabelIndex === null) return
        const newLabel = labelInput.trim() || undefined
        const entry = history[editingLabelIndex]
        if (entry) {
            const store = useAppStore.getState()
            if (calculatorMode === 'flow') {
                const newHistory = [...store.flowHistory]
                newHistory[editingLabelIndex] = { ...newHistory[editingLabelIndex], label: newLabel } as any
                useAppStore.setState({ flowHistory: newHistory })
            } else {
                const newHistory = [...store.formulaHistory]
                newHistory[editingLabelIndex] = { ...newHistory[editingLabelIndex], label: newLabel } as any
                useAppStore.setState({ formulaHistory: newHistory })
            }
        }
        setEditingLabelIndex(null)
    }

    const quickButtons = [
        { label: '\u221A', insert: 'sqrt(' },
        { label: '^', insert: '^' },
        { label: '(', insert: '(' },
        { label: ')', insert: ')' },
        { label: '\u03C0', insert: 'pi' },
        { label: 'ans', insert: 'ans' },
        { label: '/', insert: '/' },
        { label: '\u00D7', insert: '*' },
        { label: '\u2212', insert: '-' },
        { label: '+', insert: '+' },
    ]

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Calculator</h3>
                <div className="flex items-center gap-2">
                    <PinButton pinned={pinned} onToggle={() => togglePin('expression')} />
                    {editingIndex !== null && (
                        <button onClick={() => { setEditingIndex(null); setExpression(''); setLiveResult(null); setLiveError(null) }}
                            className="text-xs text-warning">CE</button>
                    )}
                    {history.length > 0 && (
                        <button onClick={handleClear} className="text-xs text-text-muted hover:text-error transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Mode toggle */}
                <div className="flex gap-2">
                    {(['flow', 'formula'] as const).map((mode) => (
                        <button key={mode} onClick={() => { setCalculatorMode(mode); setEditingIndex(null); setExpression(''); setLiveResult(null); setLiveError(null) }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                calculatorMode === mode
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {mode === 'flow' ? 'Flow' : 'Formula'}
                        </button>
                    ))}
                </div>

                <div className="text-xs text-text-muted">
                    {calculatorMode === 'flow' ? 'Entries chain together (ans = previous result)' : 'Each entry is independent. Assign variables to reuse results.'}
                </div>

                {/* Ans display */}
                <div className="text-xs font-mono text-text-muted">
                    ans = {ExpressionParser.formatResult(lastAnswer)}
                </div>

                {/* Expression input */}
                <div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={expression}
                        onChange={(e) => handleExpressionChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={editingIndex !== null ? 'Editing entry...' : calculatorMode === 'flow' ? 'e.g. 2+3*4, sqrt(16), ans*2' : 'e.g. A*B+10, sqrt(x)'}
                        className={`w-full px-3 py-2.5 bg-dark-900 border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary ${
                            editingIndex !== null ? 'border-warning' : 'border-border'
                        }`}
                    />
                    {liveResult !== null && (
                        <div className="mt-1 text-right font-mono text-primary text-sm">= {liveResult}</div>
                    )}
                    {liveError && (
                        <div className="mt-1 text-right text-error text-xs">{liveError}</div>
                    )}
                </div>

                {/* Quick insert buttons */}
                <div className="flex gap-1.5 flex-wrap">
                    {quickButtons.map((btn) => (
                        <button key={btn.label} onClick={() => insertText(btn.insert)}
                            className="px-2.5 py-1.5 bg-dark-700 border border-border rounded text-text-secondary text-sm font-mono hover:border-primary hover:text-primary transition-colors">
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* History */}
                {history.length > 0 && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary uppercase tracking-wider">History</span>
                            <span className="text-xs text-text-muted">(click to edit)</span>
                        </div>
                        {history.map((entry, index) => (
                            <div key={entry.id} className={`flex items-center gap-1 bg-dark-900 rounded-lg px-2 py-1.5 ${
                                editingIndex === index ? 'ring-1 ring-warning' : ''
                            }`}>
                                {/* Move controls (flow mode) */}
                                {calculatorMode === 'flow' && (
                                    <div className="flex flex-col gap-0.5">
                                        <button onClick={() => handleMoveEntry(index, 'up')} disabled={index === 0}
                                            className="p-0.5 text-text-muted hover:text-primary disabled:opacity-30 transition-colors">
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleMoveEntry(index, 'down')} disabled={index === history.length - 1}
                                            className="p-0.5 text-text-muted hover:text-primary disabled:opacity-30 transition-colors">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Variable badge (formula mode) */}
                                {calculatorMode === 'formula' && (
                                    editingVarIndex === index ? (
                                        <input type="text" value={varInput} onChange={(e) => setVarInput(e.target.value)}
                                            onBlur={saveVariable} onKeyDown={(e) => { if (e.key === 'Enter') saveVariable(); if (e.key === 'Escape') setEditingVarIndex(null) }}
                                            maxLength={2} placeholder="A" autoFocus
                                            className="w-7 px-1 py-0.5 bg-dark-700 border border-primary rounded text-center text-xs font-mono text-primary focus:outline-none" />
                                    ) : (
                                        <button onClick={() => handleAssignVariable(index)}
                                            className={`w-7 px-1 py-0.5 rounded text-xs font-mono text-center transition-colors ${
                                                (entry as any).variable ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-dark-700 text-text-muted border border-border hover:border-primary'
                                            }`}>
                                            {(entry as any).variable || '+'}
                                        </button>
                                    )
                                )}

                                {/* Content (clickable to edit) */}
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleClickEntry(index)}>
                                    <div className="font-mono text-xs text-text-muted truncate">{entry.expression}</div>
                                    <div className="font-mono text-sm text-text-primary">
                                        {(entry as any).variable && (
                                            <span className="text-primary mr-1">{(entry as any).variable} =</span>
                                        )}
                                        {ExpressionParser.formatResult(entry.result)}
                                    </div>
                                </div>

                                {/* Label badge */}
                                {editingLabelIndex === index ? (
                                    <input type="text" value={labelInput} onChange={(e) => setLabelInput(e.target.value)}
                                        onBlur={saveLabel} onKeyDown={(e) => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditingLabelIndex(null) }}
                                        maxLength={20} placeholder="label" autoFocus
                                        className="w-20 px-1 py-0.5 bg-dark-700 border border-primary rounded text-xs text-text-primary focus:outline-none" />
                                ) : (
                                    <button onClick={() => handleAssignLabel(index)}
                                        className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                            (entry as any).label ? 'bg-dark-700 text-text-secondary' : 'text-text-muted hover:text-primary'
                                        }`}>
                                        {(entry as any).label || <Tag className="w-3 h-3" />}
                                    </button>
                                )}

                                {/* Delete */}
                                <button onClick={() => handleRemove(entry.id)} className="p-0.5 text-text-muted hover:text-error transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
