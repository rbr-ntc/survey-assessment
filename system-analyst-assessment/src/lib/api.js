/**
 * API Client for LearnHub LMS
 * Handles all API requests with token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

class ApiClient {
	constructor() {
		this.baseURL = `${API_BASE_URL}${API_PREFIX}`
	}

	/**
	 * Set tokens in httpOnly cookies (via API route)
	 */
	async setTokens(accessToken, refreshToken) {
		await fetch('/api/auth/set-tokens', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ accessToken, refreshToken }),
		})
	}

	/**
	 * Clear tokens (via API route)
	 */
	async clearTokens() {
		await fetch('/api/auth/clear-tokens', { method: 'POST' })
	}

	/**
	 * Refresh access token (uses API route that reads httpOnly refresh_token cookie)
	 */
	async refreshToken() {
		try {
			const response = await fetch('/api/auth/refresh', {
				method: 'POST',
				credentials: 'include',
			})
			if (!response.ok) throw new Error('Token refresh failed')
			return await response.json()
		} catch (error) {
			await this.clearTokens()
			throw error
		}
	}

	/**
	 * Make authenticated request with automatic token refresh
	 * Uses httpOnly cookies for tokens, so we rely on credentials: 'include'
	 */
	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`

		const headers = {
			'Content-Type': 'application/json',
			...options.headers,
		}

		let response = await fetch(url, {
			...options,
			headers,
			credentials: 'include', // Include httpOnly cookies
		})

		// If 401, try to refresh token
		if (response.status === 401) {
			try {
				await this.refreshToken()
				// Retry request (cookies will be sent automatically)
				response = await fetch(url, {
					...options,
					headers,
					credentials: 'include',
				})
			} catch (error) {
				// Refresh failed, clear tokens
				await this.clearTokens()
				throw new Error('Session expired')
			}
		}

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: 'Request failed' }))
			throw new Error(error.detail || error.message || 'Request failed')
		}

		return response.json()
	}

	// Auth endpoints
	async register(email, password, name) {
		const response = await fetch(`${this.baseURL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Registration failed')
		return data
	}

	async login(email, password) {
		const response = await fetch(`${this.baseURL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ email, password }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Login failed')
		
		// Set tokens in httpOnly cookies via API route
		if (data.access_token && data.refresh_token) {
			await this.setTokens(data.access_token, data.refresh_token)
		}
		
		return data
	}

	async logout() {
		try {
			await this.request('/auth/logout', { method: 'POST' })
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			await this.clearTokens()
		}
	}

	async verifyEmail(email, code) {
		const response = await fetch(`${this.baseURL}/auth/verify-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, code }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Verification failed')
		return data
	}

	async resendVerificationCode(email) {
		const response = await fetch(`${this.baseURL}/auth/resend-verification`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Failed to resend code')
		return data
	}

	async forgotPassword(email) {
		const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Failed to send reset code')
		return data
	}

	async resetPassword(email, code, newPassword) {
		const response = await fetch(`${this.baseURL}/auth/reset-password`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, code, new_password: newPassword }),
		})
		const data = await response.json()
		if (!response.ok) throw new Error(data.detail || 'Password reset failed')
		return data
	}

	async getCurrentUser() {
		return this.request('/auth/me')
	}
}

export const apiClient = new ApiClient()

