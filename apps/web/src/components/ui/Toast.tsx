'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const typeConfig: Record<
  ToastType,
  { icon: React.ElementType; containerClass: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle,
    containerClass: 'border-l-4 border-l-[var(--color-success)]',
    iconClass: 'text-[var(--color-success)]',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'border-l-4 border-l-[var(--color-error)]',
    iconClass: 'text-[var(--color-error)]',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'border-l-4 border-l-[var(--color-warning)]',
    iconClass: 'text-[var(--color-warning)]',
  },
  info: {
    icon: Info,
    containerClass: 'border-l-4 border-l-[var(--color-info)]',
    iconClass: 'text-[var(--color-info)]',
  },
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const { icon: Icon, containerClass, iconClass } = typeConfig[toast.type]
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const duration = toast.duration ?? 4000
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id)
    }, duration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg border border-[var(--color-border)] p-4',
        'flex items-start gap-3 min-w-[320px] max-w-[420px]',
        'animate-fade-in-up',
        containerClass
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', iconClass)} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {toast.title}
        </p>
        {toast.message && (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

let toastCounter = 0

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    toastCounter += 1
    const id = `toast-${toastCounter}-${Date.now()}`
    setToasts((prev) => [...prev, { ...t, id }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}

      {/* Toast container - fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return context
}

export { ToastProvider, useToast }
export default ToastProvider
