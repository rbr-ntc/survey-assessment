'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { resetPassword } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const emailParam = searchParams.get('email')
		const codeParam = searchParams.get('code')
		if (emailParam) setEmail(emailParam)
		if (codeParam) setCode(codeParam)
	}, [searchParams])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (password !== confirmPassword) {
			setError('Пароли не совпадают')
			return
		}

		if (password.length < 8) {
			setError('Пароль должен быть не менее 8 символов')
			return
		}

		if (!email || !code) {
			setError('Отсутствуют email или код')
			return
		}

		setLoading(true)

		try {
			await resetPassword(email, code, password)
			router.push('/login?passwordReset=true')
		} catch (err) {
			setError(err.message || 'Ошибка сброса пароля')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-bg flex items-center justify-center min-h-screen p-4">
			<div className="glass-card w-full max-w-md p-8 relative z-10">
				<h1 className="text-3xl font-bold text-white mb-2 text-center">
					Новый пароль
				</h1>
				<p className="text-white/70 text-center mb-8">
					Введите новый пароль для вашего аккаунта
				</p>

				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="password"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Новый пароль
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="glass-input w-full px-4 py-3"
							placeholder="Минимум 8 символов"
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Подтвердите пароль
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
							className="glass-input w-full px-4 py-3"
							placeholder="Повторите пароль"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Сброс...' : 'Установить новый пароль'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<Link
						href="/login"
						className="text-white/80 hover:text-white text-sm transition-colors"
					>
						Вернуться к входу
					</Link>
				</div>
			</div>
		</div>
	)
}

