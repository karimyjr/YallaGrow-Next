'use client'
import { useEffect, useState, createContext, useContext } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10000,
        maxWidth: 'calc(100vw - 48px)',
      }}>
        {toasts.map(toast => <ToastItem key={toast.id} toast={toast} />)}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
  }, [])

  const config = {
    success: { icon: '✓', color: '#16db64', bg: 'rgba(16,219,100,0.1)', border: 'rgba(16,219,100,0.3)' },
    error: { icon: '✕', color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.3)' },
    info: { icon: 'i', color: '#10a1db', bg: 'rgba(16,161,219,0.1)', border: 'rgba(16,161,219,0.3)' },
  }[toast.type]

  return (
    <div style={{
      background: 'rgba(6,12,20,0.95)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${config.border}`,
      borderLeft: `3px solid ${config.color}`,
      borderRadius: '12px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '280px',
      maxWidth: '400px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      transform: visible ? 'translateX(0)' : 'translateX(120%)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: config.bg,
        color: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '0.9rem',
        flexShrink: 0,
        fontFamily: toast.type === 'info' ? 'serif' : 'inherit',
        fontStyle: toast.type === 'info' ? 'italic' : 'normal',
      }}>{config.icon}</div>
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--white)',
        lineHeight: 1.4,
        fontWeight: 500,
      }}>{toast.message}</div>
    </div>
  )
}
