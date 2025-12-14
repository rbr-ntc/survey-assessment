import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

export async function POST() {
	try {
		const cookieStore = await cookies()
		const refreshToken = cookieStore.get('refresh_token')?.value

		if (!refreshToken) {
			return NextResponse.json(
				{ error: 'Refresh token not found' },
				{ status: 401 }
			)
		}

		// Call backend refresh endpoint
		const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({ detail: 'Refresh failed' }))
			return NextResponse.json(
				{ error: error.detail || 'Token refresh failed' },
				{ status: response.status }
			)
		}

		const data = await response.json()

		// Update tokens in httpOnly cookies
		const nextResponse = NextResponse.json({ success: true })

		nextResponse.cookies.set('access_token', data.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 60, // 30 minutes
			path: '/',
		})

		nextResponse.cookies.set('refresh_token', data.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: '/',
		})

		return nextResponse
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to refresh token' },
			{ status: 500 }
		)
	}
}

