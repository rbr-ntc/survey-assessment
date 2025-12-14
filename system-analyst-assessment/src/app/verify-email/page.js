'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyEmailPage() {
	const [code, setCode] = useState(['', '', '', '', '', ''])
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [resending, setResending] = useState(false)
	const { verifyEmail, resendVerificationCode } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const emailParam = searchParams.get('email')
		if (emailParam) {
			setEmail(emailParam)
		}
	}, [searchParams])

	const handleCodeChange = (index, value) => {
		if (!/^\d*$/.test(value)) return // Only digits

		const newCode = [...code]
		newCode[index] = value.slice(-1) // Only last digit

		setCode(newCode)

		// Auto-focus next input
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

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		const codeString = code.join('')
		if (codeString.length !== 6) {
			setError('Введите 6-значный код')
			return
		}

		if (!email) {
			setError('Email не указан')
			return
		}

		setLoading(true)

		try {
			await verifyEmail(email, codeString)
			router.push('/dashboard')
		} catch (err) {
			setError(err.message || 'Неверный код')
			setCode(['', '', '', '', '', ''])
		} finally {
			setLoading(false)
		}
	}

	const handleResend = async () => {
		if (!email) {
			setError('Email не указан')
			return
		}

		setResending(true)
		setError('')

		try {
			await resendVerificationCode(email)
			setError('')
			alert('Код отправлен повторно')
		} catch (err) {
			setError(err.message || 'Ошибка отправки кода')
		} finally {
			setResending(false)
		}
	}

	return (
		<div className="auth-bg flex items-center justify-center min-h-screen p-4">
			<div className="glass-card w-full max-w-md p-8 relative z-10">
				<h1 className="text-3xl font-bold text-white mb-2 text-center">
					Подтверждение email
				</h1>
				<p className="text-white/70 text-center mb-8">
					Введите 6-значный код, отправленный на {email || 'ваш email'}
				</p>

				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
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
						disabled={loading || code.join('').length !== 6}
						className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Проверка...' : 'Подтвердить'}
					</button>
				</form>

				<div className="mt-6 text-center space-y-2">
					<button
						type="button"
						onClick={handleResend}
						disabled={resending}
						className="text-white/80 hover:text-white text-sm transition-colors disabled:opacity-50"
					>
						{resending ? 'Отправка...' : 'Отправить код повторно'}
					</button>
					<p className="text-white/70 text-sm">
						<Link href="/login" className="hover:underline">
							Вернуться к входу
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

