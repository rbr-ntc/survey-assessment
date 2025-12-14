import { Button } from '@/components/ui/button'

const typeStyles = {
	case: {
		label: 'Кейс',
		icon: '💼',
		className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
	},
	practical: {
		label: 'Практика',
		icon: '⚡',
		className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	},
	theory: {
		label: 'Теория',
		icon: '📚',
		className: 'bg-blue-50 text-blue-700 border-blue-200',
	},
	soft: {
		label: 'Soft Skills',
		icon: '🤝',
		className: 'bg-purple-50 text-purple-700 border-purple-200',
	},
}

const QuestionTypeBadge = ({ type }) => {
	const style = typeStyles[type] || {
		label: type,
		icon: '❓',
		className: 'bg-slate-100 text-slate-700 border-slate-200',
	}
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.className}`}
		>
			<span>{style.icon}</span>
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
	<div className='flex flex-col items-center min-h-screen p-4 md:py-12'>
		<div className='w-full max-w-3xl'>
			{/* Header / Progress */}
			<div className='mb-8 flex flex-col gap-4'>
				<div className='flex items-center justify-between text-sm font-medium text-slate-500'>
					<span className='flex items-center gap-2'>
						<span className='text-lg'>{category.icon}</span>
						<span className='text-slate-900'>{category.name}</span>
					</span>
					<span>
						{currentQuestionIndex + 1} / {questionsLength}
					</span>
				</div>
				<div className='w-full bg-slate-100 rounded-full h-1.5 overflow-hidden'>
					<div
						className='h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<div className='bg-white rounded-2xl shadow-soft border border-slate-100 p-6 md:p-10 transition-all'>
				{/* Question Content */}
				<div className='mb-8'>
					<div className='mb-4'>
						<QuestionTypeBadge type={question.type} />
					</div>
					<h2 className='text-2xl md:text-3xl font-bold text-slate-900 leading-tight'>
						{question.question}
					</h2>
				</div>

				{/* Options */}
				<div className='flex flex-col gap-3'>
					{question.options.map(option => {
						const isSelected = answers[question.id] === option.value
						return (
							<label
								key={option.value}
								className={`
									group relative flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
									${
										isSelected
											? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm z-10'
											: 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
									}
								`}
							>
								<input
									type='radio'
									name={question.id}
									value={option.value}
									checked={isSelected}
									onChange={() => handleAnswer(option.value)}
									className='hidden'
								/>

								{/* Radio Circle */}
								<span
									className={`
										flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border transition-all shrink-0
										${
											isSelected
												? 'border-indigo-600 bg-indigo-600'
												: 'border-slate-300 bg-white group-hover:border-indigo-300'
										}
									`}
								>
									<span
										className='w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-200'
										style={{ opacity: isSelected ? 1 : 0 }}
									/>
								</span>

								<span
									className={`text-base leading-relaxed transition-colors ${
										isSelected
											? 'text-indigo-900 font-medium'
											: 'text-slate-700'
									}`}
								>
									{option.text}
								</span>
							</label>
						)
					})}
				</div>

				{/* Footer Navigation */}
				<div className='flex items-center justify-between mt-10 pt-6 border-t border-slate-100'>
					<Button
						variant='ghost'
						onClick={handlePrev}
						disabled={currentQuestionIndex === 0}
						className='text-slate-500 hover:text-slate-900'
					>
						Назад
					</Button>
					<Button
						size='lg'
						onClick={
							currentQuestionIndex === questionsLength - 1
								? onFinish
								: handleNext
						}
						disabled={!answers[question.id]}
						className={`
							px-8 shadow-lg shadow-indigo-500/20 transition-all
							${
								currentQuestionIndex === questionsLength - 1
									? 'bg-slate-900 hover:bg-black'
									: ''
							}
						`}
					>
						{currentQuestionIndex === questionsLength - 1
							? 'Завершить'
							: 'Далее'}
					</Button>
				</div>
			</div>
		</div>
	</div>
)

export default QuestionScreen
