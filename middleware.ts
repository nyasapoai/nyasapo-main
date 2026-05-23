import { NextRequest, NextResponse } from 'next/server'

// List of known tenants - in production this would come from a database
const TENANTS = new Set(['devtraco', 'knowledge'])

// Reserved subdomains that should not be treated as tenants
const RESERVED_SUBDOMAINS = new Set(['www', 'api', 'admin', 'app', 'staging', 'dev'])

// The main domain - adjust for production
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'nyasapoai.com'

function extractTenant(hostname: string, url: URL): string | null {
  // Handle localhost development with various patterns
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  if (isLocalhost) {
    // Pattern 1: Query param for easy local testing
    // e.g., localhost:3000?tenant=devtraco
    const queryTenant = url.searchParams.get('tenant')
    if (queryTenant && TENANTS.has(queryTenant)) {
      return queryTenant
    }

    // Pattern 2: Subdomain on localhost
    // e.g., devtraco.localhost:3000 (requires /etc/hosts or DNS setup)
    const parts = hostname.split('.')
    if (parts.length > 1 && parts[0] !== '127') {
      const subdomain = parts[0]
      if (TENANTS.has(subdomain)) {
        return subdomain
      }
    }

    return null
  }

  // Production: extract subdomain from hostname
  // e.g., devtraco.nyansapoai.com -> devtraco
  // e.g., knowledge.nyansapoai.com -> knowledge

  // Remove the main domain to get the subdomain
  const domainParts = hostname.split('.')
  const mainDomainParts = MAIN_DOMAIN.split('.')

  // Check if hostname ends with the main domain
  if (domainParts.length > mainDomainParts.length) {
    const subdomain = domainParts[0]

    // Make sure it's not a reserved subdomain
    if (!RESERVED_SUBDOMAINS.has(subdomain) && TENANTS.has(subdomain)) {
      return subdomain
    }
  }

  return null
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Don't process internal tenant routes (prevents infinite loops)
  if (url.pathname.startsWith('/tenant/')) {
    return NextResponse.next()
  }

  // Don't process static files, API routes, or special Next.js paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  const tenant = extractTenant(hostname, url)

  if (tenant) {
    // Rewrite to tenant route while preserving the URL in browser
    // e.g., devtraco.nyansapoai.com/ask -> /tenant/devtraco/ask
    const newPath = `/tenant/${tenant}${url.pathname}`
    url.pathname = newPath

    // Remove tenant query param if it was used (for clean URLs)
    url.searchParams.delete('tenant')

    return NextResponse.rewrite(url)
  }

  // No tenant detected - continue to marketing site
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
