import { Confetti } from '@/components/magicui/confetti'
import 'highlight.js/styles/github.css' // или другой стиль
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

const ResultsScreen = ({
	menteeInfo,
	results,
	level,
	categories,
	getScoreColor,
	isGeneratingRecommendations,
	aiRecommendations,
	onRestart,
	onCopyReport,
	resultId,
}) => {
	const [showShare, setShowShare] = useState(false)
	const [copied, setCopied] = useState(false)
	const confettiRef = useRef(null)
	const shareUrl = resultId
		? `${
				typeof window !== 'undefined' ? window.location.origin : ''
		  }/result/${resultId}`
		: ''

	useEffect(() => {
		if (confettiRef.current) {
			confettiRef.current.fire()
		}
	}, [])

	function getCategoryLabel(score) {
		if (score >= 80) return '🌟 Экспертный уровень'
		if (score >= 60) return '✅ Хороший уровень'
		if (score >= 40) return '📈 Требует развития'
		return '⚠️ Приоритет для улучшения'
	}

	if (aiRecommendations) {
		console.log('aiRecommendations:', JSON.stringify(aiRecommendations))
	}

	return (
		<div className='min-h-screen bg-gray-100 py-8'>
			      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
			<div className='max-w-4xl mx-auto'>
				<div className='bg-white rounded-2xl p-8 shadow-xl'>
					{/* Заголовок с уровнем */}
					<div className='text-center mb-12'>
						<div className='text-7xl mb-4'>{level.icon}</div>

						<h1 className='text-3xl font-bold mb-2'>
							{menteeInfo.name}, ваш уровень: {level.level}
						</h1>
						<p className='text-lg text-gray-500 mb-4'>{level.description}</p>
						<div
							className='text-6xl font-bold'
							style={{ color: getScoreColor(results.overallScore) }}
						>
							{results.overallScore}%
						</div>
						<p className='text-gray-500'>
							Типичный опыт для уровня: {level.minYears} лет
						</p>
					</div>
					{/* Прогресс до следующего уровня */}
					<div className='mb-12 p-6 bg-gray-50 rounded-xl'>
						<h2 className='text-xl font-bold mb-4'>
							Прогресс до уровня {level.nextLevel}
						</h2>
						<div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
							<div
								className='h-4 rounded-full transition-all duration-1000'
								style={{
									backgroundColor: getScoreColor(results.overallScore),
									width: `${Math.min(results.overallScore, 100)}%`,
								}}
							/>
						</div>
						<p className='text-xs text-gray-500'>
							{level.level === 'Senior'
								? 'Вы достигли высокого уровня! Рассмотрите роль архитектора или техлида.'
								: `Необходимо набрать ${level.nextLevelScore} % для перехода на следующий уровень.`}
						</p>
					</div>
					{/* Детальные результаты по категориям */}
					<div className='mb-12'>
						<h2 className='text-2xl font-bold mb-6'>
							Детальный анализ компетенций
						</h2>
						<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
							{Object.entries(results.categories)
								.sort(([, a], [, b]) => b.score - a.score)
								.map(([category, data]) => (
									<div
										key={category}
										className='bg-gray-50 rounded-xl p-5 border-2 flex flex-col justify-between'
										style={{
											borderColor:
												data.score >= 80
													? '#d1fae5'
													: data.score >= 60
													? '#dbeafe'
													: data.score >= 40
													? '#fed7aa'
													: '#fee2e2',
										}}
									>
										<div className='flex justify-between items-center mb-3'>
											<div className='flex items-center gap-3'>
												<span className='text-2xl'>
													{/* иконка можно добавить по желанию */}
												</span>
												<div>
													<div className='font-semibold text-sm'>
														{data.name}
													</div>
													<div className='text-xs text-gray-500'>
														Вес: {data.weight}x
													</div>
												</div>
											</div>
											<span
												className='text-xl font-bold'
												style={{ color: getScoreColor(data.score) }}
											>
												{data.score}%
											</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
											<div
												className='h-2 rounded-full transition-all duration-500'
												style={{
													backgroundColor: getScoreColor(data.score),
													width: `${data.score}%`,
												}}
											/>
										</div>
										<div className='text-xs mt-2 text-gray-600 font-medium'>
											{getCategoryLabel(data.score)}
										</div>
									</div>
								))}
						</div>
					</div>
					{/* Сводка сильных и слабых сторон */}
					<div className='mb-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-emerald-100 rounded-xl p-6'>
							<h3 className='text-lg font-bold mb-4 text-emerald-900 flex items-center gap-2'>
								💪 Сильные стороны
							</h3>
							<ul className='list-none p-0'>
								{results.strengths && results.strengths.length > 0 ? (
									results.strengths.map((s, idx) => (
										<li key={idx} className='mb-2 flex items-center gap-2'>
											<span>✓</span>
											<span>
												{s.name} ({s.score}%)
											</span>
										</li>
									))
								) : (
									<li>Требуют развития</li>
								)}
							</ul>
						</div>
						<div className='bg-rose-100 rounded-xl p-6'>
							<h3 className='text-lg font-bold mb-4 text-rose-900 flex items-center gap-2'>
								📚 Зоны развития
							</h3>
							<ul className='list-none p-0'>
								{results.weaknesses && results.weaknesses.length > 0 ? (
									results.weaknesses.map((w, idx) => (
										<li key={idx} className='mb-2 flex items-center gap-2'>
											<span>→</span>
											<span>
												{w.name} ({w.score}%)
											</span>
										</li>
									))
								) : (
									<li>Все компетенции на хорошем уровне</li>
								)}
							</ul>
						</div>
					</div>
					{/* AI-рекомендации */}
					{aiRecommendations && (
						<div className='mb-8'>
							<h2 className='text-2xl font-bold mb-4'>
								AI-рекомендации для развития
							</h2>
							<div className='bg-amber-50 rounded-xl p-6 text-gray-800 prose prose-blue max-w-none'>
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									rehypePlugins={[rehypeHighlight]}
								>
									{aiRecommendations}
								</ReactMarkdown>
							</div>
						</div>
					)}
					{isGeneratingRecommendations && (
						<div className='mb-8 text-center text-blue-500 font-semibold'>
							Генерируем рекомендации...
						</div>
					)}

					{/* Кнопки */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
						{resultId && (
							<button
								onClick={() => {
									navigator.clipboard.writeText(shareUrl)
									setCopied(true)
									setTimeout(() => setCopied(false), 1500)
								}}
								className='px-6 py-3 rounded-lg bg-amber-200 text-amber-900 font-semibold transition hover:bg-amber-300'
							>
								{copied ? 'Скопировано!' : 'Скопировать ссылку'}
							</button>
						)}
						<button
							onClick={onCopyReport}
							className='px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold transition hover:bg-gray-300'
						>
							Скопировать отчёт
						</button>
						<button
							onClick={onRestart}
							className='px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold transition hover:bg-blue-600'
						>
							Пройти заново
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResultsScreen
