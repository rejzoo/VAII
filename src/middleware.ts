import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './app/utils/supabase/middleware'
import { getUserRole } from '@/app/api/auth/actions/actions'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const role = await getUserRole();

  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'
  ],
}