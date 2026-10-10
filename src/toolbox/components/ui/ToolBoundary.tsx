import { Component, type ReactNode } from 'react'

interface Props {
    label?: string
    children: ReactNode
}

interface State {
    error: Error | null
}

/**
 * Per-tool error boundary: a crash in one chart/calculator renders one broken
 * card instead of white-screening the entire panel.
 */
export class ToolBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    render() {
        if (this.state.error) {
            return (
                <div className="bg-surface-card border border-error/30 border-l-4 border-l-error rounded-xl p-4 space-y-2">
                    <div className="text-sm font-semibold text-text-strong">{this.props.label ?? 'This tool'} hit an error</div>
                    <div className="text-xs text-text-body font-mono break-all">{this.state.error.message}</div>
                    <div className="text-xs text-text-dim">The rest of the app is unaffected.</div>
                    <button
                        onClick={() => this.setState({ error: null })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-surface-page text-text-body hover:border-accent-text hover:text-accent-text transition-colors">
                        Reset tool
                    </button>
                </div>
            )
        }
        // @container makes every tool card a container-query context, so card
        // internals (grid-cols) can respond to the card's width, not the viewport
        return <div className="@container">{this.props.children}</div>
    }
}
