"use client"

import { ReactNode, use } from 'react'
import { AuthProvider } from '@/lib/auth-context'

export default function TenantLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  return (
    <AuthProvider tenantSlug={slug}>
      {children}
    </AuthProvider>
  )
}
