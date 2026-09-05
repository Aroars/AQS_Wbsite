import { Pin } from 'lucide-react'
import { cn } from '@/toolbox/lib/utils'

interface PinButtonProps {
    pinned: boolean
    onToggle: () => void
    className?: string
}

export function PinButton({ pinned, onToggle, className }: PinButtonProps) {
    return (
        <button
            onClick={onToggle}
            title={pinned ? 'Unpin from Home' : 'Pin to Home'}
            className={cn(
                'p-1 rounded transition-colors',
                pinned
                    ? 'text-primary hover:text-primary-light'
                    : 'text-text-muted hover:text-text-secondary',
                className
            )}
        >
            {/* Same glyph both states — filled when pinned, outline when not */}
            <Pin className="w-3.5 h-3.5" fill={pinned ? 'currentColor' : 'none'} />
        </button>
    )
}
