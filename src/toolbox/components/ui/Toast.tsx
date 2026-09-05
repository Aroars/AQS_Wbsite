import { useEffect, useState } from 'react'

interface ToastMessage {
    id: string
    text: string
    type: 'success' | 'error' | 'info'
}

let addToastFn: ((text: string, type?: ToastMessage['type']) => void) | null = null

export function showToast(text: string, type: ToastMessage['type'] = 'info') {
    addToastFn?.(text, type)
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    useEffect(() => {
        addToastFn = (text, type = 'info') => {
            const id = Date.now().toString()
            setToasts((prev) => [...prev, { id, text, type }])
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, 3000)
        }
        return () => { addToastFn = null }
    }, [])

    if (toasts.length === 0) return null

    const typeColors = {
        success: 'bg-success/90',
        error: 'bg-error/90',
        info: 'bg-primary/90',
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${typeColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-up`}
                >
                    {toast.text}
                </div>
            ))}
        </div>
    )
}
