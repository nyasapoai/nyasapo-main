"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Zap, 
  MessageSquare, 
  FileText, 
  LineChart, 
  Settings, 
  Bell, 
  HelpCircle,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react'

export default function TenantHeader({ tenantSlug }: { tenantSlug: string }) {
  const { user, tenant, logout } = useAuth()
  const pathname = usePathname()

  const tabs = [
    { name: 'Ask', href: `/tenant/${tenantSlug}/ask`, icon: MessageSquare },
    { name: 'Documents', href: `/tenant/${tenantSlug}/documents`, icon: FileText, minRole: 'middle' },
    { name: 'Insights', href: `/tenant/${tenantSlug}/insights`, icon: LineChart },
    { name: 'Settings', href: `/tenant/${tenantSlug}/settings`, icon: Settings, minRole: 'senior' },
  ]

  const canAccessTab = (minRole?: string) => {
    if (!minRole || !user) return true
    const roleHierarchy = { junior: 0, middle: 1, senior: 2 }
    return roleHierarchy[user.role] >= roleHierarchy[minRole as keyof typeof roleHierarchy]
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'senior': return 'bg-[#dbeafe] text-[#1e40af]'
      case 'middle': return 'bg-[#fef3c7] text-[#92400e]'
      default: return 'bg-[#e0e7ff] text-[#4338ca]'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e2e8f0]">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo + Tenant Name */}
        <div className="flex items-center gap-3">
          <Link href={`/tenant/${tenantSlug}/ask`} className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tenant?.primaryColor || '#2563eb' }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#0f172a]">NyasapoAI</span>
              {tenant && (
                <>
                  <span className="text-[#cbd5e1]">·</span>
                  <span 
                    className="text-lg font-semibold"
                    style={{ color: tenant.primaryColor }}
                  >
                    {tenant.name}
                  </span>
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Center: Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            const hasAccess = canAccessTab(tab.minRole)
            
            if (!hasAccess) {
              return (
                <div
                  key={tab.name}
                  className="px-4 py-2 text-sm font-medium text-[#cbd5e1] cursor-not-allowed flex items-center gap-2"
                  title={`Available to ${tab.minRole} users only`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </div>
              )
            }
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  isActive 
                    ? 'bg-[#f1f5f9] text-[#0f172a]' 
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            )
          })}
        </nav>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#0f172a]">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#0f172a] relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-[#f8fafc]">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: tenant?.primaryColor || '#2563eb' }}
                >
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-[#0f172a]">{user?.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${getRoleBadgeColor(user?.role || '')}`}>
                    {user?.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-[#0f172a]">{user?.name}</p>
                <p className="text-xs text-[#64748b]">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/tenant/${tenantSlug}/settings`} className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
