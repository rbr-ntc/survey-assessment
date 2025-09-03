import { useContext, useState } from 'react'
import { AssessmentContext } from './AssessmentContext'

const IntroForm = () => {
	const { startAssessment, startQuickTest } = useContext(AssessmentContext)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		experience: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [isQuickTestLoading, setIsQuickTestLoading] = useState(false)

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

		setIsLoading(true)
		try {
			await startAssessment(formData)
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
		<div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-8'>
			<h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>
				Системный аналитик - Оценка компетенций
			</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Имя
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						placeholder='Введите ваше имя'
						required
					/>
				</div>

				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Email
					</label>
					<input
						type='email'
						id='email'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						placeholder='Введите ваш email'
						required
					/>
				</div>

				<div>
					<label
						htmlFor='experience'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Опыт работы
					</label>
					<select
						id='experience'
						name='experience'
						value={formData.experience}
						onChange={handleInputChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					>
						<option value=''>Выберите опыт</option>
						<option value='Нет опыта'>Нет опыта</option>
						<option value='До 1 года'>До 1 года</option>
						<option value='1-3 года'>1-3 года</option>
						<option value='3-5 лет'>3-5 лет</option>
						<option value='Более 5 лет'>Более 5 лет</option>
					</select>
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{isLoading ? 'Запуск...' : 'Начать тестирование'}
				</button>
			</form>

			{/* Quick Test кнопки - отображаются только когда включены */}
			{isQuickTestEnabled && (
				<div className='mt-6 pt-6 border-t border-gray-200'>
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
		</div>
	)
}

export default IntroForm
