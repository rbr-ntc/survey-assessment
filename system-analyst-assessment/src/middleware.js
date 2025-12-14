import { NextResponse } from 'next/server'

export function middleware(request) {
	const { pathname } = request.nextUrl

	// Protected routes that require authentication
	const protectedRoutes = ['/dashboard', '/profile', '/courses', '/settings']
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	)

	// Auth routes that should redirect if already authenticated
	const authRoutes = ['/login', '/register']
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

	// Check for access token cookie
	const accessToken = request.cookies.get('access_token')?.value

	// Redirect to login if accessing protected route without token
	if (isProtectedRoute && !accessToken) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Redirect to dashboard if accessing auth routes with token
	if (isAuthRoute && accessToken) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}

