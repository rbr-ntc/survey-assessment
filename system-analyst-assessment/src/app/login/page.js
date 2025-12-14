'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { login } = useAuth()
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await login(email, password)
			router.push('/dashboard')
		} catch (err) {
			setError(err.message || 'Ошибка входа')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-bg flex items-center justify-center min-h-screen p-4">
			<div className="glass-card w-full max-w-md p-8 relative z-10">
				<h1 className="text-3xl font-bold text-white mb-2 text-center">
					Вход в систему
				</h1>
				<p className="text-white/70 text-center mb-8">
					Добро пожаловать в LearnHub LMS
				</p>

				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="glass-input w-full px-4 py-3"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Пароль
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="glass-input w-full px-4 py-3"
							placeholder="••••••••"
						/>
					</div>

					<div className="flex items-center justify-between">
						<Link
							href="/forgot-password"
							className="text-white/80 hover:text-white text-sm transition-colors"
						>
							Забыли пароль?
						</Link>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-white/70 text-sm">
						Нет аккаунта?{' '}
						<Link
							href="/register"
							className="text-white hover:underline font-medium"
						>
							Зарегистрироваться
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

