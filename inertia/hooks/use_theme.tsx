import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContext = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', systemDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
    applyTheme(newTheme)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
