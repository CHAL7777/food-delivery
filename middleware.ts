import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const hasSession = req.cookies
    .getAll()
    .some((cookie) => /^sb-.*-auth-token$/.test(cookie.name))

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isProtectedRoute = ['/cart', '/checkout', '/orders'].some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Require session for admin routes.
  if (isAdminRoute && !hasSession) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/cart', '/checkout', '/orders', '/profile/:path*']
}
