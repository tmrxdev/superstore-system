import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Just pass through - authentication is handled client-side for this shop
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
