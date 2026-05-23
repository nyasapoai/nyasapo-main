// Tenant configuration and URL utilities

export interface TenantConfig {
  slug: string
  name: string
  fullName: string
  description: string
  primaryColor: string
  logoIcon?: string
  industry: string
  departments: string[]
}

// Known tenant configurations
export const TENANTS: Record<string, TenantConfig> = {
  devtraco: {
    slug: 'devtraco',
    name: 'DEVTRACO',
    fullName: 'Devtraco Group',
    description: 'Secure workspace for DEVTRACO\'s internal documents.',
    primaryColor: '#2563eb',
    industry: 'Real Estate & Construction',
    departments: ['Executive', 'Construction', 'Finance', 'Legal', 'HR', 'Marketing']
  },
  knowledge: {
    slug: 'knowledge',
    name: 'Knowledge Innovations',
    fullName: 'Knowledge Innovations Ltd',
    description: 'Secure workspace for Knowledge Innovations\' internal documents.',
    primaryColor: '#059669',
    industry: 'Professional Services & Technology',
    departments: [
      '4th Industrial Tools',
      'Integrated Marketing',
      'FinTech & Financial Services',
      'Knowledge Management',
      'Media & New Media Strategy',
      'Digital Transformation',
      'Cybersecurity'
    ]
  }
}

// Get the main domain for URL generation (bare domain without protocol or www)
export const MAIN_DOMAIN = 'nyasapoai.com'

// Generate tenant URL (subdomain-based)
export function getTenantUrl(tenantSlug: string, path: string = ''): string {
  // In development, use query param for local testing
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `/tenant/${tenantSlug}${path}`
    }
  }
  
  // In production, use subdomain
  return `https://${tenantSlug}.${MAIN_DOMAIN}${path}`
}

// Get tenant config from slug
export function getTenantConfig(slug: string): TenantConfig | null {
  return TENANTS[slug] || null
}

// Check if a slug is a valid tenant
export function isValidTenant(slug: string): boolean {
  return slug in TENANTS
}

// Get all tenant slugs
export function getAllTenantSlugs(): string[] {
  return Object.keys(TENANTS)
}
