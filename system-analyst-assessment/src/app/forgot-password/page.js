'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [code, setCode] = useState(['', '', '', '', '', ''])
	const [step, setStep] = useState(1) // 1: email, 2: code
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { forgotPassword } = useAuth()
	const router = useRouter()

	const handleEmailSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await forgotPassword(email)
			setStep(2)
		} catch (err) {
			setError(err.message || 'Ошибка отправки кода')
		} finally {
			setLoading(false)
		}
	}

	const handleCodeChange = (index, value) => {
		if (!/^\d*$/.test(value)) return

		const newCode = [...code]
		newCode[index] = value.slice(-1)

		setCode(newCode)

		if (value && index < 5) {
			const nextInput = document.getElementById(`code-${index + 1}`)
			if (nextInput) nextInput.focus()
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			const prevInput = document.getElementById(`code-${index - 1}`)
			if (prevInput) prevInput.focus()
		}
	}

	const handleCodeSubmit = async (e) => {
		e.preventDefault()
		setError('')

		const codeString = code.join('')
		if (codeString.length !== 6) {
			setError('Введите 6-значный код')
			return
		}

		// Redirect to reset password page with email and code
		router.push(
			`/reset-password?email=${encodeURIComponent(email)}&code=${codeString}`
		)
	}

	return (
		<div className="auth-bg flex items-center justify-center min-h-screen p-4">
			<div className="glass-card w-full max-w-md p-8 relative z-10">
				<h1 className="text-3xl font-bold text-white mb-2 text-center">
					Восстановление пароля
				</h1>
				<p className="text-white/70 text-center mb-8">
					{step === 1
						? 'Введите email для получения кода восстановления'
						: 'Введите 6-значный код из письма'}
				</p>

				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				{step === 1 ? (
					<form onSubmit={handleEmailSubmit} className="space-y-6">
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

						<button
							type="submit"
							disabled={loading}
							className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Отправка...' : 'Отправить код'}
						</button>
					</form>
				) : (
					<form onSubmit={handleCodeSubmit} className="space-y-6">
						<div className="flex justify-center gap-3">
							{code.map((digit, index) => (
								<input
									key={index}
									id={`code-${index}`}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleCodeChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className="glass-input w-12 h-14 text-center text-2xl font-bold"
									autoFocus={index === 0}
								/>
							))}
						</div>

						<button
							type="submit"
							disabled={code.join('').length !== 6}
							className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Продолжить
						</button>

						<button
							type="button"
							onClick={() => setStep(1)}
							className="text-white/80 hover:text-white text-sm transition-colors w-full"
						>
							Изменить email
						</button>
					</form>
				)}

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

