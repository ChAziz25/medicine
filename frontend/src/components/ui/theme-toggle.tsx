'use client'

import { Moon, Sun } from '@/lib/icons'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      className={cn(className)}
    >
      <Sun className="size-3.5 dark:hidden" />
      <Moon className="hidden size-3.5 dark:inline" />
    </Button>
  )
}