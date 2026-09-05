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
                <div className="bg-dark-800 border border-error/30 rounded-xl p-4 space-y-2">
                    <div className="text-sm font-semibold text-error">{this.props.label ?? 'This tool'} hit an error</div>
                    <div className="text-xs text-text-secondary font-mono break-all">{this.state.error.message}</div>
                    <div className="text-xs text-text-muted">The rest of the app is unaffected.</div>
                    <button
                        onClick={() => this.setState({ error: null })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-dark-900 text-text-secondary hover:border-primary hover:text-primary transition-colors">
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
