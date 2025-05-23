import React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface LogoProps {
  variant?: 'light' | 'dark'
}

const Logo = ({ variant = 'light' }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Sparkles className="w-6 h-6 text-primary${variant === 'light' ? 'text-white' : 'text-gray-900'}" strokeWidth={1.5} />
      <h1 className="text-xl font-bold">
        <span className={`text-primary ${variant === 'light' ? 'text-white' : 'text-gray-900'}`}>
          Imaginex
        </span>
        <span className={`${variant === 'light' ? 'text-muted-foreground' : 'text-gray-600'}`}>
          AI
        </span>
      </h1>
    </Link>
  )
}

export default Logo