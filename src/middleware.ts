import { NextRequest, NextResponse } from 'next/server';

// Define protected paths based on URLs 
const protectedPaths = ['/reports', '/persons_info']; // URL startsWith checks
const adminOnlyPaths = ['/admin/conversations', '/admin/usermanagement']; 

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware triggered for path:', pathname); 

  const isProtected = protectedPaths.some(path => pathname.startsWith(path)) ||
                      adminOnlyPaths.some(path => pathname.startsWith(path));

  if (!isProtected) {
    console.log('Path not protected:', pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value || request.headers.get('authorization')?.split(' ')[1];
  console.log('Token found:', !!token); 

  if (!token) {
    console.log('No token - redirecting to sign-in');
    const signinUrl = new URL('/auth/sign-in', request.url);
    signinUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signinUrl, 302); 
  }

  // For admin-only paths, fetch /users/me to check role
  if (adminOnlyPaths.some(path => pathname.startsWith(path))) {
    try {
      console.log('Checking admin role for path:', pathname); // Debug
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token or fetch failed');
      }

      const user = await response.json();
      if (user.role !== 'ADMIN') {
        console.log('Non-admin user - redirecting to unauthorized');
        return NextResponse.redirect(new URL('/unauthorized', request.url), 302);
      }
    } catch (error) {
      console.error('Role check failed:', error); // Error handling: Log for debugging (add Sentry in prod)
      return NextResponse.redirect(new URL('/auth/sign-in', request.url), 302);
    }
  }

  // If token present and role ok, to proceed
  console.log('Access granted for path:', pathname);
  return NextResponse.next();
}

// Matcher config
export const config = {
  matcher: [
    '/reports/:path*',      
    '/persons_info/:path*',  
    '/admin/conversations/:path*', 
    '/admin/usermanagement/:path*', 
  ],
};