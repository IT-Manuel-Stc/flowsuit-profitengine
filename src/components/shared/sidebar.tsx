'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, FileText, Home, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Kunden', href: '/clients', icon: Users },
  { name: 'Neues Angebot', href: '/proposals/new', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobiler Menü-Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-[#025864] text-white shadow-lg hover:bg-[#034956] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-[#025864] transition-transform duration-300 z-40 shadow-2xl',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#00D47E] flex items-center justify-center">
                  <span className="text-[#025864] font-bold text-lg">F</span>
                </div>
                <span className="font-bold text-xl text-white">FlowSuit</span>
              </div>
              {/* Mobiler Schließen-Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
                    isActive
                      ? 'bg-[#00D47E] text-[#025864]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="px-4 py-3 text-sm text-white/40">
              Profit Engine v1.0
            </div>
          </div>
        </div>
      </aside>

      {/* Mobil-Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
