"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, tenants, demoUsers } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageSquare, Eye, EyeOff, Loader2, Building2, Lock, ChevronRight } from 'lucide-react'

interface TenantLoginPageProps {
  tenantSlug: string
}

export default function TenantLoginPage({ tenantSlug }: TenantLoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSSOLoading, setIsSSOLoading] = useState(false)
  const { login, loginWithSSO } = useAuth()
  const router = useRouter()

  const tenant = tenants[tenantSlug]
  const tenantUsers = demoUsers[tenantSlug] || []

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="h-16 w-16 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-[#ef4444]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0f172a] mb-2">Workspace not found</h1>
          <p className="text-[#64748b] mb-6">
            The workspace you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <a 
            href="/"
            className="text-[#2563eb] font-medium hover:underline inline-flex items-center gap-1"
          >
            Go to NyasapoAI home
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)

    const success = await login(email, password)
    
    if (success) {
      router.push(`/tenant/${tenantSlug}/ask`)
    } else {
      setError('Invalid credentials. Try a demo account below.')
    }
    setIsLoggingIn(false)
  }

  const handleSSO = async () => {
    setIsSSOLoading(true)
    const success = await loginWithSSO()
    
    if (success) {
      router.push(`/tenant/${tenantSlug}/ask`)
    }
    setIsSSOLoading(false)
  }

  const handleDemoLogin = async (userEmail: string) => {
    setEmail(userEmail)
    setPassword('demo1234')
    setIsLoggingIn(true)
    
    const success = await login(userEmail, 'demo1234')
    if (success) {
      router.push(`/tenant/${tenantSlug}/ask`)
    }
    setIsLoggingIn(false)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NyasapoAI</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome to {tenant.name}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              {tenant.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/60 text-sm">
          <Lock className="h-4 w-4" />
          <span>Enterprise-grade security with end-to-end encryption</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden w-full border-b border-[#e5e7eb] bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[#0f172a]">NyasapoAI</span>
            <span className="text-[#94a3b8]">·</span>
            <span className="font-semibold" style={{ color: tenant.primaryColor }}>{tenant.name}</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Logo for desktop */}
            <div className="hidden lg:block text-center mb-8">
              <div 
                className="h-14 w-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${tenant.primaryColor}10` }}
              >
                <Building2 className="h-7 w-7" style={{ color: tenant.primaryColor }} />
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">Sign in</h2>
              <p className="text-[#64748b] text-sm mt-1">
                Secure workspace for {tenant.name}
              </p>
            </div>

            {/* Mobile heading */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#0f172a]">Sign in to {tenant.name}</h2>
              <p className="text-[#64748b] text-sm mt-1">{tenant.description}</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-[#374151]">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-[#e5e7eb] bg-white focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-[#374151]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 border-[#e5e7eb] bg-white focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-white font-medium shadow-sm"
                style={{ backgroundColor: tenant.primaryColor }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#94a3b8] uppercase tracking-wide">Or continue with</span>
              </div>
            </div>

            {/* SSO Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-[#e5e7eb] text-[#374151] font-medium hover:bg-[#f8fafc] hover:border-[#d1d5db]"
              onClick={handleSSO}
              disabled={isSSOLoading}
            >
              {isSSOLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign in with SSO
                </>
              )}
            </Button>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
              <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider mb-3">
                Quick access (Demo)
              </p>
              <div className="space-y-2">
                {tenantUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleDemoLogin(user.email)}
                    disabled={isLoggingIn}
                    className="w-full text-left px-4 py-3 rounded-lg border border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f8fafc] transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: tenant.primaryColor }}
                        >
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#64748b]">{user.department}</p>
                        </div>
                      </div>
                      <span 
                        className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                        style={{ 
                          backgroundColor: user.role === 'senior' ? '#dbeafe' : user.role === 'middle' ? '#fef3c7' : '#f3e8ff',
                          color: user.role === 'senior' ? '#1e40af' : user.role === 'middle' ? '#92400e' : '#7c3aed'
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-[#94a3b8] mt-8">
              Protected by enterprise-grade security.{' '}
              <a href="/" className="text-[#2563eb] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
