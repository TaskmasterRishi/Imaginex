import React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary text-white" strokeWidth={1.5}/>
        <h1 className="text-xl font-bold">
            <span className="text-primary text-white">Imaginex</span>
            <span className="text-muted-foreground">AI</span>
        </h1>
    </Link>
  )
}

export default Logo