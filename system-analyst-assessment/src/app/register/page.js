'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { register } = useAuth()
	const router = useRouter()

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError('Пароли не совпадают')
			return
		}

		if (formData.password.length < 8) {
			setError('Пароль должен быть не менее 8 символов')
			return
		}

		setLoading(true)

		try {
			await register(formData.email, formData.password, formData.name)
			// Redirect to email verification
			router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
		} catch (err) {
			setError(err.message || 'Ошибка регистрации')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-bg flex items-center justify-center min-h-screen p-4">
			<div className="glass-card w-full max-w-md p-8 relative z-10">
				<h1 className="text-3xl font-bold text-white mb-2 text-center">
					Регистрация
				</h1>
				<p className="text-white/70 text-center mb-8">
					Создайте аккаунт для доступа к курсам
				</p>

				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Имя
						</label>
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							required
							className="glass-input w-full px-4 py-3"
							placeholder="Ваше имя"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-white/90 text-sm font-medium mb-2"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
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
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
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
							name="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							onChange={handleChange}
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
						{loading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-white/70 text-sm">
						Уже есть аккаунт?{' '}
						<Link
							href="/login"
							className="text-white hover:underline font-medium"
						>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

