'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, FileText, Home, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Kunden', href: '/clients', icon: Users },
  { name: 'Angebote erstellen', href: '/proposals/new', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-40',
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1
              className={cn(
                'font-bold text-xl transition-opacity',
                isCollapsed && 'lg:opacity-0 lg:hidden'
              )}
            >
              FlowSuit
            </h1>
            {isCollapsed && (
              <div className="hidden lg:block text-center font-bold text-xl">FS</div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                    isCollapsed && 'lg:justify-center'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn('transition-opacity', isCollapsed && 'lg:hidden')}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Collapse Button (Desktop only) */}
          <div className="hidden lg:block p-4 border-t">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isCollapsed ? '→' : '← Einklappen'}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}
