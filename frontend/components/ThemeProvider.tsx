'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initialTheme)
    
    // Apply theme immediately
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
      const root = document.documentElement
      const html = document.getElementsByTagName('html')[0]
      const body = document.body
      
      // Directly set the class based on theme
      if (theme === 'dark') {
        root.classList.add('dark')
        if (html) html.classList.add('dark')
        body.classList.add('dark')
      } else {
        root.classList.remove('dark')
        if (html) html.classList.remove('dark')
        body.classList.remove('dark')
      }
      
      // Force multiple repaints to ensure changes are visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const shouldBeDark = theme === 'dark'
          const isDark = root.classList.contains('dark')
          if (shouldBeDark && !isDark) {
            root.classList.add('dark')
            if (html) html.classList.add('dark')
            body.classList.add('dark')
          } else if (!shouldBeDark && isDark) {
            root.classList.remove('dark')
            if (html) html.classList.remove('dark')
            body.classList.remove('dark')
          }
        })
      })
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      const html = document.getElementsByTagName('html')[0]
      const body = document.body
      
      // Immediately update DOM and localStorage
      if (newTheme === 'dark') {
        root.classList.add('dark')
        if (html) html.classList.add('dark')
        body.classList.add('dark')
      } else {
        root.classList.remove('dark')
        if (html) html.classList.remove('dark')
        body.classList.remove('dark')
      }
      
      localStorage.setItem('theme', newTheme)
      
      // Force multiple repaints to ensure changes are visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const shouldBeDark = newTheme === 'dark'
          const isDark = root.classList.contains('dark')
          if (shouldBeDark && !isDark) {
            root.classList.add('dark')
            if (html) html.classList.add('dark')
            body.classList.add('dark')
          } else if (!shouldBeDark && isDark) {
            root.classList.remove('dark')
            if (html) html.classList.remove('dark')
            body.classList.remove('dark')
          }
        })
      })
      
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

