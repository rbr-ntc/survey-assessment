import { useState } from 'react'
import { useAssessment } from './AssessmentContext'

const experienceOptions = [
	'Меньше года',
	'1-2 года',
	'2-3 года',
	'3-5 лет',
	'5+ лет',
]

const IntroForm = ({
	menteeInfo,
	setMenteeInfo,
	handleStartAssessment,
	disabled,
	questionsCount,
}) => {
	const { isQuestionsLoading } = useAssessment()
	const [isQuickTestLoading, setIsQuickTestLoading] = useState(false)

	const handleQuickTest = async testType => {
		setIsQuickTestLoading(true)
		try {
			// Создаем быстрый тест
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/quick-test`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
					},
					body: JSON.stringify({ test_type: testType }),
				}
			)

			if (response.ok) {
				const result = await response.json()
				// Перенаправляем на страницу результатов
				window.location.href = `/result/${result.test_id}`
			} else {
				console.error('Quick test failed')
			}
		} catch (error) {
			console.error('Error creating quick test:', error)
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
						{questionsCount} вопрос
						{questionsCount === 1 ? '' : questionsCount < 5 ? 'а' : 'ов'} •
						15-20 минут • AI-рекомендации
					</p>
				</div>
				<form
					className='flex flex-col gap-4'
					onSubmit={e => {
						e.preventDefault()
						if (!isQuestionsLoading) handleStartAssessment()
					}}
				>
					<input
						className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 bg-white text-gray-900'
						type='text'
						placeholder='Ваше имя'
						value={menteeInfo.name}
						onChange={e =>
							setMenteeInfo({ ...menteeInfo, name: e.target.value })
						}
					/>
					<input
						className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 bg-white text-gray-900'
						type='email'
						placeholder='Email'
						value={menteeInfo.email}
						onChange={e =>
							setMenteeInfo({ ...menteeInfo, email: e.target.value })
						}
					/>
					<select
						className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-gray-900'
						value={menteeInfo.experience}
						onChange={e =>
							setMenteeInfo({ ...menteeInfo, experience: e.target.value })
						}
					>
						<option value=''>Опыт в системном анализе</option>
						{experienceOptions.map(opt => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
					<button
						type='submit'
						className='w-full py-3 rounded-lg bg-blue-400 text-white font-semibold text-lg shadow-sm hover:bg-blue-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
						disabled={disabled || isQuestionsLoading}
					>
						{isQuestionsLoading
							? 'Загрузка вопросов...'
							: 'Начать тестирование'}
					</button>
					{isQuestionsLoading && (
						<div className='text-center text-blue-400 mt-2'>
							Загрузка вопросов...
						</div>
					)}
				</form>

				{/* Кнопки быстрого тестирования */}
				<div className='bg-gray-100 rounded-lg p-4 mt-2'>
					<div className='font-semibold mb-3 text-gray-700'>Быстрый тест:</div>
					<div className='grid grid-cols-2 gap-2'>
						<button
							onClick={() => handleQuickTest('expert')}
							disabled={isQuickTestLoading}
							className='bg-green-500 text-white py-2 px-3 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition'
						>
							Эксперт
						</button>
						<button
							onClick={() => handleQuickTest('intermediate')}
							disabled={isQuickTestLoading}
							className='bg-yellow-500 text-white py-2 px-3 rounded-md text-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 transition'
						>
							Средний
						</button>
						<button
							onClick={() => handleQuickTest('beginner')}
							disabled={isQuickTestLoading}
							className='bg-red-500 text-white py-2 px-3 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition'
						>
							Начинающий
						</button>
						<button
							onClick={() => handleQuickTest('random')}
							disabled={isQuickTestLoading}
							className='bg-purple-500 text-white py-2 px-3 rounded-md text-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition'
						>
							Случайно
						</button>
					</div>
					{isQuickTestLoading && (
						<div className='text-center text-blue-500 mt-2 text-sm'>
							Создание теста...
						</div>
					)}
				</div>

				<div className='bg-gray-100 rounded-lg p-4 mt-2 text-sm text-gray-700'>
					<div className='font-semibold mb-1'>Что вы получите:</div>
					<ul className='list-disc list-inside space-y-1'>
						<li>Определение уровня (Junior/Middle/Senior)</li>
						<li>Детальный анализ компетенций</li>
						<li>Персональный план развития от AI</li>
						<li>Конкретные рекомендации и ресурсы</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default IntroForm
