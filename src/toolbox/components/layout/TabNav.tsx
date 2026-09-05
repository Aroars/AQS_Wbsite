import { Home, ArrowLeftRight, Calculator, Factory, BarChart3 } from 'lucide-react'
import { useAppStore } from '@/toolbox/stores/appStore'
import type { TabId } from '@/toolbox/lib/types'
import { cn } from '@/toolbox/lib/utils'

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'convert', label: 'Convert', icon: ArrowLeftRight },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'conveyor', label: 'Conveyor', icon: Factory },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
]

export function TabNav() {
    const activeTab = useAppStore((s) => s.activeTab)
    const setActiveTab = useAppStore((s) => s.setActiveTab)

    return (
        <nav className="border-b border-border bg-dark-800/50 sticky top-[53px] z-40 backdrop-blur-sm">
            <div className="px-4 md:px-6">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                                activeTab === id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    )
}
