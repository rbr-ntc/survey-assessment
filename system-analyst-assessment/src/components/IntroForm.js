import { useState } from 'react'
import { useAssessment } from './AssessmentContext'
import TestRulesModal from './TestRulesModal'
import { Button } from '@/components/ui/button'

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
		<div className='flex items-center justify-center min-h-screen p-4'>
			<div className='w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-slate-100 p-8 md:p-12 flex flex-col gap-8 transition-all duration-300'>
				<div className='flex flex-col items-center gap-4 text-center'>
					<div className='w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform rotate-3'>
						<span className='text-3xl text-white'>🎯</span>
					</div>
					<div>
						<h1 className='text-3xl font-bold tracking-tight text-slate-900 mb-2'>
							Оценка компетенций
							<br />
							<span className='text-indigo-600'>Системного Аналитика</span>
						</h1>
						<p className='text-slate-500 text-sm max-w-xs mx-auto leading-relaxed'>
							{isQuestionsLoading
								? 'Подготовка вопросов...'
								: questions.length > 0
								? `${questions.length} вопрос${
										questions.length === 1
											? ''
											: questions.length < 5
											? 'а'
											: 'ов'
								  } • 15-20 минут • AI-анализ`
								: '0 вопросов • 15-20 минут • AI-анализ'}
						</p>
					</div>
				</div>

				<form className='flex flex-col gap-5' onSubmit={handleSubmit}>
					<div className='space-y-4'>
						<div className='space-y-1.5'>
							<label
								htmlFor='name'
								className='text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1'
							>
								Ваше имя
							</label>
							<input
								id='name'
								className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400'
								type='text'
								name='name'
								placeholder='Иван Иванов'
								value={formData.name}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className='space-y-1.5'>
							<label
								htmlFor='email'
								className='text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1'
							>
								Email
							</label>
							<input
								id='email'
								className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400'
								type='email'
								name='email'
								placeholder='ivan@example.com'
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className='space-y-1.5'>
							<label
								htmlFor='experience'
								className='text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1'
							>
								Опыт работы
							</label>
							<div className="relative">
								<select
									id='experience'
									className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer'
									name='experience'
									value={formData.experience}
									onChange={handleInputChange}
									required
								>
									<option value=''>Выберите опыт...</option>
									{experienceOptions.map(opt => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<Button
						type='submit'
						size="lg"
						className='w-full py-6 text-base rounded-xl font-semibold shadow-xl shadow-indigo-500/20 mt-2'
						disabled={isLoading || isQuestionsLoading}
					>
						{isLoading
							? 'Запуск...'
							: isQuestionsLoading
							? 'Загрузка...'
							: 'Начать тестирование'}
					</Button>
				</form>

				{/* Footer Info */}
				<div className='space-y-4'>
					<div className='bg-slate-50/80 rounded-xl p-4 border border-slate-100'>
						<ul className='space-y-2 text-sm text-slate-600'>
							<li className="flex items-start gap-2">
								<span className="text-indigo-500 mt-0.5">✓</span>
								<span>Определение уровня (Junior — Senior)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-500 mt-0.5">✓</span>
								<span>Детальная карта компетенций</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-indigo-500 mt-0.5">✓</span>
								<span>Персональный план развития от AI</span>
							</li>
						</ul>
					</div>

					<div className='flex items-center justify-center gap-2 text-xs text-slate-400'>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<span className="text-center">
							Данные анонимны. Мы не храним ваш email.
						</span>
					</div>
				</div>

				{/* Quick Test Dev Tools */}
				{isQuickTestEnabled && (
					<div className='border-t border-slate-100 pt-6 mt-2'>
						<h3 className='text-xs font-semibold text-center mb-3 text-slate-400 uppercase tracking-widest'>
							Dev Mode
						</h3>
						<div className='grid grid-cols-2 gap-2'>
							{['expert', 'intermediate', 'beginner', 'random'].map((type) => (
								<button
									key={type}
									onClick={() => handleQuickTest(type)}
									disabled={isQuickTestLoading}
									className='px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

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
