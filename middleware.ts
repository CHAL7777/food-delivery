import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Auth is enforced by client session checks + API authorization.
  // Cookie-name based middleware checks can be stale and cause false redirects.
  void req
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/cart', '/checkout', '/orders', '/profile/:path*']
}
