import { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { categoryIcons } from '@/toolbox/data/categoryIcons'
import { useAppStore } from '@/toolbox/stores/appStore'
import { showToast } from '@/toolbox/components/ui/Toast'

export function CategoryGrid() {
    const [search, setSearch] = useState('')
    const savedConverters = useAppStore((s) => s.savedConverters)
    const addConverter = useAppStore((s) => s.addConverter)

    const categories = useMemo(() => {
        const all = Object.keys(unitCategories)
        if (!search.trim()) return all
        const term = search.toLowerCase()
        return all.filter((cat) => cat.toLowerCase().includes(term))
    }, [search])

    const handleAddConverter = (category: string) => {
        addConverter(category)
        showToast(`${category} converter added`)
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-border rounded-xl text-text-strong text-sm focus:outline-none focus:border-accent-text transition-colors"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                    const IconRenderer = categoryIcons[category]
                    const unitCount = Object.keys(unitCategories[category].units).length
                    const savedCount = savedConverters.filter((c) => c.category === category).length

                    return (
                        <button
                            key={category}
                            onClick={() => handleAddConverter(category)}
                            className="bg-surface-card border border-border rounded-xl p-4 text-left hover:border-accent-text hover:bg-surface-card-hover transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {IconRenderer && (
                                        <span className="text-text-dim group-hover:text-accent-text transition-colors">
                                            {IconRenderer({ className: 'w-5 h-5' })}
                                        </span>
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-text-strong">
                                            {category}
                                        </div>
                                        <div className="text-xs text-text-dim mt-0.5">
                                            {unitCount} units
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {savedCount > 0 && (
                                        <span className="text-xs text-accent-text bg-accent-text/10 px-1.5 py-0.5 rounded">
                                            {savedCount}
                                        </span>
                                    )}
                                    <Plus className="w-4 h-4 text-text-dim group-hover:text-accent-text transition-colors" />
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {categories.length === 0 && (
                <p className="text-center text-text-dim py-8 text-sm">
                    No categories match "{search}"
                </p>
            )}
        </div>
    )
}
