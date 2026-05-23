"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'senior' | 'middle' | 'junior'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
  avatar?: string
}

export interface Tenant {
  id: string
  slug: string
  name: string
  domain: string
  logo?: string
  primaryColor: string
  description: string
  industry: string
}

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithSSO: () => Promise<boolean>
  logout: () => void
  setTenant: (tenant: Tenant) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Tenant configurations
export const tenants: Record<string, Tenant> = {
  devtraco: {
    id: 'devtraco',
    slug: 'devtraco',
    name: 'DEVTRACO',
    domain: 'devtraco.nyasapoai.com',
    primaryColor: '#1e40af',
    description: 'Ghana\'s leading real estate and construction company',
    industry: 'Real Estate & Construction'
  },
  knowledge: {
    id: 'knowledge',
    slug: 'knowledge',
    name: 'Knowledge Innovations',
    domain: 'knowledge.nyasapoai.com',
    primaryColor: '#047857',
    description: 'Industry-focused professional services in 4th industrial tools, FinTech, Digital Transformation and more',
    industry: 'Professional Services & Consulting'
  }
}

// Demo users for each tenant
export const demoUsers: Record<string, User[]> = {
  devtraco: [
    { id: '1', email: 'ceo@devtraco.com', name: 'Kwame Asante', role: 'senior', department: 'Executive', avatar: '' },
    { id: '2', email: 'manager@devtraco.com', name: 'Ama Mensah', role: 'middle', department: 'Operations', avatar: '' },
    { id: '3', email: 'officer@devtraco.com', name: 'Kofi Owusu', role: 'junior', department: 'Projects', avatar: '' },
  ],
  knowledge: [
    { id: '1', email: 'director@knowledge.com', name: 'Dr. Abena Osei', role: 'senior', department: 'Executive', avatar: '' },
    { id: '2', email: 'analyst@knowledge.com', name: 'Yaw Boateng', role: 'middle', department: 'Digital Transformation', avatar: '' },
    { id: '3', email: 'associate@knowledge.com', name: 'Efua Darko', role: 'junior', department: 'FinTech Services', avatar: '' },
  ]
}

export function AuthProvider({ children, tenantSlug }: { children: ReactNode; tenantSlug: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenantState] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize tenant
    const currentTenant = tenants[tenantSlug]
    if (currentTenant) {
      setTenantState(currentTenant)
    }

    // Check for existing session
    const storedUser = localStorage.getItem(`nyasapo_user_${tenantSlug}`)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [tenantSlug])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user by email in tenant's users
    const tenantUsers = demoUsers[tenantSlug] || []
    const foundUser = tenantUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (foundUser && password.length >= 4) {
      setUser(foundUser)
      localStorage.setItem(`nyasapo_user_${tenantSlug}`, JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const loginWithSSO = async (): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Default to senior user for SSO demo
    const tenantUsers = demoUsers[tenantSlug] || []
    const ssoUser = tenantUsers[0]
    
    if (ssoUser) {
      setUser(ssoUser)
      localStorage.setItem(`nyasapo_user_${tenantSlug}`, JSON.stringify(ssoUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(`nyasapo_user_${tenantSlug}`)
    router.push(`/tenant/${tenantSlug}`)
  }

  const setTenant = (newTenant: Tenant) => {
    setTenantState(newTenant)
  }

  return (
    <AuthContext.Provider value={{ user, tenant, isLoading, login, loginWithSSO, logout, setTenant }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
