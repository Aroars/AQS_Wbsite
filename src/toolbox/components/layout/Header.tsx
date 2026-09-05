import { Wrench, Search } from 'lucide-react'

const isMac = typeof navigator !== 'undefined' && /Mac|iP/.test(navigator.platform)

export function Header() {
    return (
        <header className="border-b border-border bg-dark-800">
            <div className="px-4 md:px-6 py-3 flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Wrench className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <div className="text-lg font-semibold text-text-primary leading-tight">
                        Engineering Toolbox
                    </div>
                    <p className="text-xs text-text-muted">AQS Inc</p>
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('toolbox:open-palette'))}
                    title="Jump to any tool"
                    className="flex items-center gap-2 px-3 py-1.5 bg-dark-900 border border-border rounded-lg text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
                >
                    <Search className="w-3.5 h-3.5" />
                    <span className="text-xs hidden sm:inline">Jump to...</span>
                    <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 border border-border rounded">
                        {isMac ? '⌘K' : 'Ctrl K'}
                    </kbd>
                </button>
            </div>
        </header>
    )
}
