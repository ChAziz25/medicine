'use client'

import { Globe } from '@/lib/icons'
import { useI18n } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, toggle } = useI18n()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={`Switch language (current: ${locale === 'fr' ? 'Français' : 'English'})`}
      className={cn('gap-1.5 text-xs font-medium', className)}
      title={locale === 'fr' ? 'English' : 'Français'}
    >
      <Globe className="size-3.5" />
      <span className="uppercase">{locale}</span>
    </Button>
  )
}