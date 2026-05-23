"use client"

import TenantLoginPage from '@/components/tenant/tenant-login'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { use } from 'react'

export default function TenantHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push(`/tenant/${slug}/ask`)
    }
  }, [user, isLoading, router, slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return <TenantLoginPage tenantSlug={slug} />
}
