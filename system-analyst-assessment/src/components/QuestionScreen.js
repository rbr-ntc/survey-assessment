import { Button } from './ui/button'

const typeStyles = {
	case: {
		label: 'Кейс',
		icon: '💼',
		className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
	},
	practical: {
		label: 'Практика',
		icon: '⚡',
		className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
	},
	theory: {
		label: 'Теория',
		icon: '📚',
		className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
	},
	soft: {
		label: 'Soft',
		icon: '🤝',
		className: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
	},
}

const QuestionTypeBadge = ({ type }) => {
	const style = typeStyles[type] || {
		label: type,
		icon: '❓',
		className: 'bg-muted text-muted-foreground',
	}
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 border border-transparent ${style.className}`}
		>
			<span className='mr-0.5'>{style.icon}</span>
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
}) => {
	const currentAnswer = answers[question.id];

	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-muted/20'>
			<div className='w-full max-w-3xl bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-10 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500'>

				{/* Header */}
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-start">
						<div className='flex items-center gap-3'>
							<span className='text-2xl p-2 bg-secondary rounded-md'>{category.icon}</span>
							<div>
								<span className='font-bold text-foreground text-lg block leading-tight'>
									{category.name}
								</span>
								<span className='text-xs text-muted-foreground'>
									Вопрос {currentQuestionIndex + 1} из {questionsLength}
								</span>
							</div>
						</div>
						<div className='text-right hidden sm:block'>
							<span className='text-2xl font-bold text-primary'>{Math.round(progress)}%</span>
							<span className='text-xs text-muted-foreground block'>завершено</span>
						</div>
					</div>

					<div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
						<div
							className='h-2 rounded-full bg-primary transition-all duration-500 ease-out'
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				{/* Question */}
				<div className='space-y-4'>
					<QuestionTypeBadge type={question.type} />
					<h2 className='text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight'>
						{question.question}
					</h2>
				</div>

				{/* Options */}
				<div className='grid gap-3'>
					{question.options.map(option => {
						const isSelected = currentAnswer === option.value;
						return (
							<label
								key={option.value}
								className={`
									group flex items-start sm:items-center gap-4 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none relative overflow-hidden
									${isSelected
										? 'border-primary bg-primary/5 ring-1 ring-primary/20'
										: 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
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

								{/* Custom Radio */}
								<div className={`
									flex items-center justify-center w-5 h-5 mt-0.5 sm:mt-0 rounded-full border transition-all shrink-0
									${isSelected
										? 'border-primary bg-primary text-primary-foreground'
										: 'border-muted-foreground/30 bg-transparent group-hover:border-primary/50'
									}
								`}>
									{isSelected && (
										<div className='w-2 h-2 rounded-full bg-current shadow-sm' />
									)}
								</div>

								<span className={`text-base leading-relaxed ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
									{option.text}
								</span>
							</label>
						)
					})}
				</div>

				{/* Navigation */}
				<div className='flex justify-between items-center pt-4 border-t border-border mt-auto'>
					<Button
						variant="ghost"
						onClick={handlePrev}
						disabled={currentQuestionIndex === 0}
						className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
					>
						← Назад
					</Button>

					<Button
						onClick={
							currentQuestionIndex === questionsLength - 1 ? onFinish : handleNext
						}
						disabled={!currentAnswer}
						size="lg"
						className={`
							px-8 font-semibold shadow-lg shadow-primary/20 transition-all duration-300
							${!currentAnswer ? 'opacity-50 grayscale' : 'hover:scale-[1.02] active:scale-[0.98]'}
						`}
					>
						{currentQuestionIndex === questionsLength - 1 ? 'Завершить' : 'Далее'}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default QuestionScreen
