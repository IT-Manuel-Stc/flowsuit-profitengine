'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Wallet,
  BarChart3,
  FolderKanban
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const generalNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kunden', href: '/clients', icon: Users },
  { name: 'Angebote', href: '/proposals/new', icon: FileText },
  { name: 'Projekte', href: '/projects', icon: FolderKanban },
]

const supportNavigation = [
  { name: 'Zahlungen', href: '/payments', icon: Wallet },
  { name: 'Berichte', href: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-[#f8fafb] border-r border-gray-200 transition-all duration-300 z-40 hidden lg:flex flex-col',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#025864] flex items-center justify-center">
              <span className="text-white font-bold text-sm">FS</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg text-[#025864]">FlowSuit</span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* General Section */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Allgemein
              </p>
            )}
            <div className="space-y-1">
              {generalNavigation.map((item) => {
                const isActive = isActiveLink(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium',
                      isActive
                        ? 'bg-[#e6f7f0] text-[#025864]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#00D47E]')} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Support Section */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Finanzen
              </p>
            )}
            <div className="space-y-1">
              {supportNavigation.map((item) => {
                const isActive = isActiveLink(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium',
                      isActive
                        ? 'bg-[#e6f7f0] text-[#025864]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#00D47E]')} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Einstellungen</span>}
          </Link>
          <Link
            href="/help"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Hilfe</span>}
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm',
              isCollapsed && 'justify-center p-2'
            )}
          >
            <div className="w-10 h-10 rounded-full bg-[#025864] flex items-center justify-center text-white font-semibold text-sm shrink-0">
              U
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">Benutzer</p>
                <p className="text-xs text-gray-400 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        {!isCollapsed && (
          <div className="p-4 pt-0">
            <p className="text-xs text-gray-400 text-center">© 2024 FlowSuit</p>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {generalNavigation.slice(0, 4).map((item) => {
            const isActive = isActiveLink(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                  isActive ? 'text-[#025864]' : 'text-gray-400'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-[#00D47E]')} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
