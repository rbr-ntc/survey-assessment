import { useState } from 'react'
import { useAssessment } from './AssessmentContext'
import TestRulesModal from './TestRulesModal'
import { Button } from './ui/button'

const experienceOptions = [
	'Меньше года',
	'1-2 года',
	'2-3 года',
	'3-5 лет',
	'5+ лет',
]

const IntroForm = ({ questionsCount = 0 }) => {
	const {
		handleStartAssessment,
		startQuickTest,
		questions,
		isQuestionsLoading,
	} = useAssessment()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		experience: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [isQuickTestLoading, setIsQuickTestLoading] = useState(false)
	const [showRulesModal, setShowRulesModal] = useState(false)

	// Проверяем, включены ли quick-test
	const isQuickTestEnabled =
		process.env.NEXT_PUBLIC_ENABLE_QUICK_TEST === 'true'

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.experience.trim()
		) {
			alert('Пожалуйста, заполните все поля')
			return
		}

		// Показываем модальное окно с правилами
		setShowRulesModal(true)
	}

	const handleStartTest = async () => {
		setIsLoading(true)
		try {
			await handleStartAssessment(formData)
		} catch (error) {
			console.error('Error starting assessment:', error)
			alert('Ошибка при запуске тестирования')
		} finally {
			setIsLoading(false)
		}
	}

	const handleQuickTest = async testType => {
		setIsQuickTestLoading(true)
		try {
			await startQuickTest(testType)
		} catch (error) {
			console.error('Error starting quick test:', error)
			alert('Ошибка при запуске быстрого теста')
		} finally {
			setIsQuickTestLoading(false)
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-muted/20'>
			<div className='w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-500'>
				<div className='flex flex-col items-center gap-2'>
					<div className='text-5xl mb-2'>🎯</div>
					<h1 className='text-2xl font-bold text-foreground text-center tracking-tight'>
						Комплексная оценка
						<br />
						системного аналитика
					</h1>
					<p className='text-muted-foreground text-center text-sm'>
						{isQuestionsLoading
							? 'Загрузка вопросов...'
							: questions.length > 0
							? `${questions.length} вопрос${
									questions.length === 1
										? ''
										: questions.length < 5
										? 'а'
										: 'ов'
							  } • 15-20 минут • AI-рекомендации`
							: '0 вопросов • 15-20 минут • AI-рекомендации'}
					</p>
				</div>

				<form className='flex flex-col gap-5' onSubmit={handleSubmit}>
					<div className='flex flex-col gap-1.5'>
						<label
							htmlFor='name'
							className='text-sm font-medium text-foreground ml-1'
						>
							Ваше имя <span className='text-destructive'>*</span>
						</label>
						<input
							id='name'
							className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							type='text'
							name='name'
							placeholder='Введите ваше имя'
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className='flex flex-col gap-1.5'>
						<label
							htmlFor='email'
							className='text-sm font-medium text-foreground ml-1'
						>
							Email <span className='text-destructive'>*</span>
						</label>
						<input
							id='email'
							className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							type='email'
							name='email'
							placeholder='example@email.com'
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
						<p className='text-[0.8rem] text-muted-foreground ml-1'>
							Email используется только для идентификации результатов.
						</p>
					</div>

					<div className='flex flex-col gap-1.5'>
						<label
							htmlFor='experience'
							className='text-sm font-medium text-foreground ml-1'
						>
							Опыт работы <span className='text-destructive'>*</span>
						</label>
						<select
							id='experience'
							className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							name='experience'
							value={formData.experience}
							onChange={handleInputChange}
							required
						>
							<option value=''>Выберите опыт</option>
							{experienceOptions.map(opt => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					</div>

					<Button
						type='submit'
						className='w-full text-base py-6 shadow-md'
						disabled={isLoading || isQuestionsLoading}
					>
						{isLoading
							? 'Запуск...'
							: isQuestionsLoading
							? 'Загрузка вопросов...'
							: 'Начать тестирование'}
					</Button>
				</form>

				{/* Quick Test кнопки - отображаются только когда включены */}
				{isQuickTestEnabled && (
					<div className='border-t border-border pt-4'>
						<h3 className='text-sm font-semibold text-center mb-4 text-muted-foreground uppercase tracking-wider'>
							Быстрое тестирование (dev)
						</h3>
						<div className='grid grid-cols-2 gap-3'>
							<Button
								variant="outline"
								onClick={() => handleQuickTest('expert')}
								disabled={isQuickTestLoading}
								className='text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
							>
								{isQuickTestLoading ? '...' : 'Эксперт'}
							</Button>
							<Button
								variant="outline"
								onClick={() => handleQuickTest('intermediate')}
								disabled={isQuickTestLoading}
								className='text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200'
							>
								{isQuickTestLoading ? '...' : 'Средний'}
							</Button>
							<Button
								variant="outline"
								onClick={() => handleQuickTest('beginner')}
								disabled={isQuickTestLoading}
								className='text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200'
							>
								{isQuickTestLoading ? '...' : 'Начинающий'}
							</Button>
							<Button
								variant="outline"
								onClick={() => handleQuickTest('random')}
								disabled={isQuickTestLoading}
								className='text-violet-600 hover:text-violet-700 hover:bg-violet-50 border-violet-200'
							>
								{isQuickTestLoading ? '...' : 'Случайно'}
							</Button>
						</div>
					</div>
				)}

				<div className='bg-muted/50 rounded-lg p-4 mt-2 text-sm text-muted-foreground border border-border/50'>
					<div className='font-semibold mb-2 text-foreground'>Что вы получите:</div>
					<ul className='space-y-1.5'>
						<li className='flex items-center gap-2'>
							<span className="text-primary">✓</span> Определение уровня (Junior/Middle/Senior)
						</li>
						<li className='flex items-center gap-2'>
							<span className="text-primary">✓</span> Детальный анализ компетенций
						</li>
						<li className='flex items-center gap-2'>
							<span className="text-primary">✓</span> Персональный план развития от AI
						</li>
					</ul>
				</div>

				{/* Предупреждение о персональных данных */}
				<div className='bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs text-blue-800 dark:text-blue-300'>
					<div className='flex items-start gap-3'>
						<div className='text-lg'>🔒</div>
						<div className='flex-1 space-y-2'>
							<p>
								<strong>Конфиденциальность:</strong> Мы не храним ваши персональные данные.
								Email используется только для идентификации результатов и не сохраняется в базе.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Модальное окно с правилами тестирования */}
			<TestRulesModal
				isOpen={showRulesModal}
				onClose={() => setShowRulesModal(false)}
				onConfirm={() => {
					setShowRulesModal(false)
					handleStartTest()
				}}
			/>
		</div>
	)
}

export default IntroForm
