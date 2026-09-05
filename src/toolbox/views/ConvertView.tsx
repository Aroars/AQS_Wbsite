import { CategoryGrid } from '@/toolbox/components/converter/CategoryGrid'
import { ConverterCard } from '@/toolbox/components/converter/ConverterCard'
import { ToolBoundary } from '@/toolbox/components/ui/ToolBoundary'
import { useAppStore } from '@/toolbox/stores/appStore'

export function ConvertView() {
    const savedConverters = useAppStore((s) => s.savedConverters)

    return (
        <div className="space-y-6">
            {/* Working converters live right here — no round-trip to Home to convert */}
            {savedConverters.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                        Your Converters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {savedConverters.map((converter) => (
                            <ToolBoundary key={converter.id} label={`${converter.category} converter`}>
                                <ConverterCard converter={converter} />
                            </ToolBoundary>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                    Add Category
                </h2>
                <CategoryGrid />
            </div>
        </div>
    )
}
