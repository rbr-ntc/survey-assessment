'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
	const { user, loading, logout } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login')
		}
	}, [user, loading, router])

	if (loading) {
		return (
			<div className="auth-bg flex items-center justify-center min-h-screen">
				<div className="glass-card p-8">
					<p className="text-white text-center">Загрузка...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="auth-bg min-h-screen p-4">
			<div className="max-w-7xl mx-auto">
				<div className="glass-card p-8 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">
								Добро пожаловать, {user.name || user.email}!
							</h1>
							<p className="text-white/70">
								{user.email_verified
									? 'Email подтвержден'
									: 'Подтвердите email для полного доступа'}
							</p>
						</div>
						<button
							onClick={logout}
							className="glass-button px-6 py-2"
						>
							Выйти
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="glass-card p-6">
						<h2 className="text-xl font-bold text-white mb-4">Мои курсы</h2>
						<p className="text-white/70 mb-4">
							Начните обучение с выбора курса
						</p>
						<Link
							href="/courses"
							className="glass-button inline-block px-4 py-2 text-sm"
						>
							Перейти к курсам
						</Link>
					</div>

					<div className="glass-card p-6">
						<h2 className="text-xl font-bold text-white mb-4">Прогресс</h2>
						<p className="text-white/70 mb-4">
							Отслеживайте свой прогресс обучения
						</p>
						<Link
							href="/progress"
							className="glass-button inline-block px-4 py-2 text-sm"
						>
							Посмотреть прогресс
						</Link>
					</div>

					<div className="glass-card p-6">
						<h2 className="text-xl font-bold text-white mb-4">Профиль</h2>
						<p className="text-white/70 mb-4">
							Управляйте настройками аккаунта
						</p>
						<Link
							href="/profile"
							className="glass-button inline-block px-4 py-2 text-sm"
						>
							Открыть профиль
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

