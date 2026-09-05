'use client'

import { useEffect } from 'react'
import { Header } from '@/toolbox/components/layout/Header'
import { TabNav } from '@/toolbox/components/layout/TabNav'
import { ToastContainer } from '@/toolbox/components/ui/Toast'
import { CommandPalette } from '@/toolbox/components/ui/CommandPalette'
import { HomeView } from '@/toolbox/views/HomeView'
import { ConvertView } from '@/toolbox/views/ConvertView'
import { CalculatorsView } from '@/toolbox/views/CalculatorsView'
import { ConveyorView } from '@/toolbox/views/ConveyorView'
import { ChartsView } from '@/toolbox/views/ChartsView'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useDeepLink } from '@/toolbox/hooks/useDeepLink'

/**
 * Engineering Toolbox root. Rendered client-only (see components/toolbox/
 * ToolboxLoader) because all durable state lives in a zustand store persisted
 * to localStorage — the same no-login "it remembers you" model as Excalidraw.
 */
export default function ToolboxApp() {
    const activeTab = useAppStore((s) => s.activeTab)
    useDeepLink()

    // Select-on-focus for every numeric input in the app, in one place —
    // tabbing or clicking into a filled field replaces the value on type
    useEffect(() => {
        const onFocusIn = (e: FocusEvent) => {
            const t = e.target
            if (t instanceof HTMLInputElement && (t.type === 'number' || t.inputMode === 'decimal' || t.inputMode === 'numeric')) {
                t.select()
            }
        }
        document.addEventListener('focusin', onFocusIn)
        return () => document.removeEventListener('focusin', onFocusIn)
    }, [])

    return (
        <div id="toolbox-app" className="min-h-[80vh] bg-dark-900 text-text-primary scroll-mt-[53px]">
            <Header />
            <TabNav />
            <main className="px-4 md:px-6 py-6">
                {/* Views stay mounted and toggle visibility so in-progress work
                    (conveyor specs, chart selections, searches) survives tab switches */}
                <div className={activeTab === 'home' ? '' : 'hidden'}><HomeView /></div>
                <div className={activeTab === 'convert' ? '' : 'hidden'}><ConvertView /></div>
                <div className={activeTab === 'calculators' ? '' : 'hidden'}><CalculatorsView /></div>
                <div className={activeTab === 'conveyor' ? '' : 'hidden'}><ConveyorView /></div>
                <div className={activeTab === 'charts' ? '' : 'hidden'}><ChartsView /></div>
            </main>
            <ToastContainer />
            <CommandPalette />
        </div>
    )
}
