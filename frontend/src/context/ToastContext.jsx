import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ToastContext = createContext(null)

// Shows a small pop-up message at the top of the screen that hides itself.
//
//   const { showToast } = useToast()
//   showToast('Cement added to cart')
//   showToast('Something went wrong', { type: 'error' })
//   showToast('Added', { actionLabel: 'View cart', actionTo: '/cart' })
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  const hideToast = useCallback(() => {
    clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  const showToast = useCallback((message, options = {}) => {
    clearTimeout(timerRef.current)
    setToast({
      id: Date.now() + Math.random(), // new id restarts the slide-in animation
      message,
      type: options.type || 'success', // 'success' | 'error'
      actionLabel: options.actionLabel,
      actionTo: options.actionTo,
    })
    timerRef.current = setTimeout(() => setToast(null), options.duration || 2200)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="toast-wrap" aria-live="polite">
          <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
            <span className="toast-icon">{toast.type === 'error' ? '!' : '✓'}</span>
            <span className="toast-msg">{toast.message}</span>
            {toast.actionLabel && (
              <button
                className="toast-action"
                onClick={() => {
                  hideToast()
                  navigate(toast.actionTo)
                }}
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
