import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
