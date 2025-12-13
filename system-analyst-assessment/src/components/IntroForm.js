import { useState } from 'react'
import { useAssessment } from './AssessmentContext'
import TestRulesModal from './TestRulesModal'

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
		<div className='flex items-center justify-center min-h-screen'>
			<div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6'>
				<div className='flex flex-col items-center gap-2'>
					<div className='text-4xl mb-2'>🎯</div>
					<h1 className='text-2xl font-bold text-gray-800 text-center'>
						Комплексная оценка
						<br />
						системного аналитика
					</h1>
					<p className='text-gray-400 text-center text-base'>
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

				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<div className='flex flex-col gap-1'>
						<label
							htmlFor='name'
							className='text-sm font-medium text-gray-700 ml-1'
						>
							Ваше имя <span className='text-red-500'>*</span>
						</label>
						<input
							id='name'
							className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 bg-white text-gray-900'
							type='text'
							name='name'
							placeholder='Введите ваше имя'
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className='flex flex-col gap-1'>
						<label
							htmlFor='email'
							className='text-sm font-medium text-gray-700 ml-1'
						>
							Email <span className='text-red-500'>*</span>
						</label>
						<input
							id='email'
							className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 bg-white text-gray-900'
							type='email'
							name='email'
							placeholder='example@email.com'
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
						<p className='text-xs text-gray-500 mt-1 ml-1'>
							Email используется только для идентификации результатов и не
							сохраняется в базе данных
						</p>
					</div>

					<div className='flex flex-col gap-1'>
						<label
							htmlFor='experience'
							className='text-sm font-medium text-gray-700 ml-1'
						>
							Опыт работы <span className='text-red-500'>*</span>
						</label>
						<select
							id='experience'
							className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-gray-900'
							name='experience'
							value={formData.experience}
							onChange={handleInputChange}
							required
						>
							<option value=''>Выберите опыт в системном анализе</option>
							{experienceOptions.map(opt => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					</div>
					<button
						type='submit'
						className='w-full py-3 rounded-lg bg-blue-400 text-white font-semibold text-lg shadow-sm hover:bg-blue-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
						disabled={isLoading || isQuestionsLoading}
					>
						{isLoading
							? 'Запуск...'
							: isQuestionsLoading
							? 'Загрузка вопросов...'
							: 'Начать тестирование'}
					</button>
				</form>

				{/* Quick Test кнопки - отображаются только когда включены */}
				{isQuickTestEnabled && (
					<div className='border-t border-gray-200 pt-4'>
						<h3 className='text-lg font-semibold text-center mb-4 text-gray-700'>
							Быстрое тестирование (только для разработки)
						</h3>
						<div className='grid grid-cols-2 gap-3'>
							<button
								onClick={() => handleQuickTest('expert')}
								disabled={isQuickTestLoading}
								className='bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
							>
								{isQuickTestLoading ? 'Загрузка...' : 'Эксперт'}
							</button>
							<button
								onClick={() => handleQuickTest('intermediate')}
								disabled={isQuickTestLoading}
								className='bg-yellow-600 text-white py-2 px-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
							>
								{isQuickTestLoading ? 'Загрузка...' : 'Средний'}
							</button>
							<button
								onClick={() => handleQuickTest('beginner')}
								disabled={isQuickTestLoading}
								className='bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
							>
								{isQuickTestLoading ? 'Загрузка...' : 'Начинающий'}
							</button>
							<button
								onClick={() => handleQuickTest('random')}
								disabled={isQuickTestLoading}
								className='bg-purple-600 text-white py-2 px-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
							>
								{isQuickTestLoading ? 'Загрузка...' : 'Случайно'}
							</button>
						</div>
						<p className='text-xs text-gray-500 text-center mt-2'>
							Эти кнопки видны только в режиме разработки
						</p>
					</div>
				)}

				<div className='bg-gray-100 rounded-lg p-4 mt-2 text-sm text-gray-700'>
					<div className='font-semibold mb-1'>Что вы получите:</div>
					<ul className='list-disc list-inside space-y-1'>
						<li>Определение уровня (Junior/Middle/Senior)</li>
						<li>Детальный анализ компетенций</li>
						<li>Персональный план развития от AI</li>
						<li>Конкретные рекомендации и ресурсы</li>
					</ul>
				</div>

				{/* Предупреждение о персональных данных */}
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm'>
					<div className='flex items-start gap-3'>
						<div className='text-blue-600 text-lg'>🔒</div>
						<div className='flex-1'>
							<div className='font-semibold text-blue-800 mb-1'>
								Конфиденциальность и персональные данные
							</div>
							<div className='text-blue-700 space-y-2'>
								<p>
									Приложение <strong>НЕ собирает и НЕ сохраняет</strong> ваши
									персональные данные в соответствии с законодательством
									Российской Федерации.
								</p>
								<p>
									<strong>Email адрес:</strong> используется только для
									идентификации результатов тестирования и{' '}
									<strong>НЕ сохраняется в базе данных</strong>. Вы можете
									указать любой email адрес.
								</p>
								<p>
									<strong>Ваше имя:</strong> используется только для
									персонализации отчета и рекомендаций.
								</p>
								<p className='text-xs text-blue-600 mt-2'>
									Все данные тестирования анонимны и не содержат персональной
									информации.
								</p>
							</div>
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
