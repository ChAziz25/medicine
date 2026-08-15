'use client'

import { useEffect } from 'react'
import { X } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg',
          'duration-200 animate-in fade-in-0 zoom-in-95',
          className,
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-none">{title}</h2>
            {description ? (
              <p className="text-sm text-muted-foreground text-pretty">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X />
          </Button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer ? (
          <div className="mt-6 flex items-center justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
