'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

// Simple button component (you can replace this with your actual button styles)
type ButtonProps = {
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => (
  <button onClick={onClick} className={`p-2 rounded-full transition-colors duration-300 ${className}`}>
    {children}
  </button>
)

export function ThemeToggleButton() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect runs only on the client, ensuring correct hydration
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
  onClick={toggleTheme}
  aria-label="Toggle theme"
  className={`ml-4 flex items-center justify-center 
              rounded-full w-9 h-9 
              transition-all duration-300 
               text-white 
               dark:bg-gray-800 
              dark:hover:bg-gray-700 shadow-md hover:shadow-lg`}
>
  {theme === "light" ? (
    <Moon className="h-5 w-5" />
  ) : (
    <Sun className="h-5 w-5" />
  )}
</Button>

  )
}