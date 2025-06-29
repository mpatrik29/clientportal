import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware hit')
}

export const config = {
  matcher: '/about/:path*',
}