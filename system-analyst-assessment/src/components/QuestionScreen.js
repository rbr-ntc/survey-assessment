const typeStyles = {
	case: {
		label: 'Кейс',
		icon: '💼',
		className: 'bg-indigo-100 text-indigo-700',
	},
	practical: {
		label: 'Практика',
		icon: '⚡',
		className: 'bg-emerald-100 text-emerald-700',
	},
	theory: {
		label: 'Теория',
		icon: '📚',
		className: 'bg-blue-100 text-blue-700',
	},
	soft: {
		label: 'Soft',
		icon: '🤝',
		className: 'bg-pink-100 text-pink-700',
	},
	// Можно добавить другие типы при необходимости
}

const QuestionTypeBadge = ({ type }) => {
	const style = typeStyles[type] || {
		label: type,
		icon: '❓',
		className: 'bg-gray-200 text-gray-700',
	}
	return (
		<span
			className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${style.className}`}
		>
			<span className='mr-1'>{style.icon}</span>
			{style.label}
		</span>
	)
}

const QuestionScreen = ({
	question,
	category,
	answers,
	handleAnswer,
	handlePrev,
	handleNext,
	currentQuestionIndex,
	questionsLength,
	progress,
	onFinish,
}) => (
	<div className='flex items-center justify-center min-h-screen'>
		<div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8'>
			{/* Категория */}
			<div className='flex items-center gap-3 mb-2'>
				<span className='text-2xl'>{category.icon}</span>
				<span className='font-semibold text-gray-700 text-lg'>
					{category.name}
				</span>
			</div>
			{/* Прогрессбар */}
			<div className='mb-2'>
				<div className='flex justify-between items-center mb-1'>
					<span className='text-sm text-gray-500'>
						Вопрос {currentQuestionIndex + 1} из {questionsLength}
					</span>
					<span className='text-sm text-gray-500'>{Math.round(progress)}%</span>
				</div>
				<div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
					<div
						className='h-2 rounded-full bg-blue-400 transition-all duration-300'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			{/* Тип вопроса и сам вопрос */}
			<div className='mb-4'>
				<QuestionTypeBadge type={question.type} />
				<h2 className='text-xl font-bold text-gray-900 mb-2'>
					{question.question}
				</h2>
			</div>
			{/* Варианты ответа */}
			<div className='flex flex-col gap-3'>
				{question.options.map(option => (
					<label
						key={option.value}
						className={`
							flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all select-none
							min-h-[56px] max-w-full focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2
							$ {
								answers[question.id] === option.value
									? 'border-blue-400 bg-blue-50'
									: 'border-gray-200 bg-gray-50 hover:border-blue-200'
							}
						`}
					>
						<input
							type='radio'
							name={question.id}
							value={option.value}
							checked={answers[question.id] === option.value}
							onChange={() => handleAnswer(option.value)}
							className='sr-only'
						/>
						<span
							className={`
								flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all shrink-0
								$ {
									answers[question.id] === option.value
										? 'border-blue-500'
										: 'border-gray-300 bg-white'
								}
							`}
							style={{ minWidth: 20, minHeight: 20 }}
						>
							{answers[question.id] === option.value && (
								<span className='block w-3 h-3 rounded-full bg-blue-500' />
							)}
						</span>
						<span className='text-gray-900 text-base break-words text-left max-w-[600px]'>
							{option.text}
						</span>
					</label>
				))}
			</div>
			{/* Индикатор процента завершения */}
			<div className='text-center text-gray-500 text-sm mt-4 mb-2'>
				{Math.round(progress)}% завершено
			</div>
			{/* Кнопки навигации */}
			<div className='flex justify-between mt-6 gap-4'>
				<button
					onClick={handlePrev}
					disabled={currentQuestionIndex === 0}
					className='px-6 py-3 rounded-lg bg-gray-200 text-gray-600 font-semibold transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					Назад
				</button>
				<button
					onClick={
						currentQuestionIndex === questionsLength - 1 ? onFinish : handleNext
					}
					disabled={!answers[question.id]}
					className='px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{currentQuestionIndex === questionsLength - 1 ? 'Завершить' : 'Далее'}
				</button>
			</div>
		</div>
	</div>
)

export default QuestionScreen
