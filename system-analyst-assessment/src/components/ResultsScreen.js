import { Confetti } from '@/components/magicui/confetti'
import { Button } from '@/components/ui/button'
import 'highlight.js/styles/github.css'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import AILoader from './AILoader'

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

	return (
		<div className='min-h-screen bg-muted/20 py-8 px-4'>
			<Confetti
				ref={confettiRef}
				className='absolute left-0 top-0 z-0 size-full pointer-events-none'
				onMouseEnter={() => {
					confettiRef.current?.fire({})
				}}
			/>
			<div className='max-w-5xl mx-auto'>
				<div className='bg-card rounded-2xl p-6 sm:p-10 shadow-xl border border-border animate-in fade-in zoom-in duration-500'>
					{/* Заголовок с уровнем */}
					<div className='text-center mb-12 relative'>
						<div className='absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full w-1/2 h-1/2 mx-auto'></div>
						<div className='text-8xl mb-6 transform hover:scale-110 transition-transform cursor-default select-none'>{level.icon}</div>

						<h1 className='text-3xl sm:text-4xl font-bold mb-3 text-foreground tracking-tight'>
							{menteeInfo.name}, ваш уровень: <span className="text-primary">{level.level}</span>
						</h1>
						<p className='text-lg text-muted-foreground mb-6 max-w-2xl mx-auto'>{level.description}</p>

						<div className="flex justify-center items-center gap-4">
							<div
								className='text-7xl font-bold tracking-tighter'
								style={{ color: getScoreColor(results.overallScore) }}
							>
								{results.overallScore}%
							</div>
						</div>

						<p className='text-muted-foreground mt-2'>
							Типичный опыт для уровня: <span className="font-semibold text-foreground">{level.minYears} лет</span>
						</p>
					</div>

					{/* Прогресс до следующего уровня */}
					<div className='mb-12 p-8 bg-secondary/50 rounded-2xl border border-border/50'>
						<div className="flex justify-between items-end mb-4">
							<h2 className='text-xl font-bold text-foreground'>
								Прогресс до уровня {level.nextLevel}
							</h2>
							<span className="text-sm font-medium text-muted-foreground">
								{results.overallScore} / {level.nextLevelScore || 100} %
							</span>
						</div>
						<div className='w-full bg-border rounded-full h-4 mb-3 overflow-hidden'>
							<div
								className='h-4 rounded-full transition-all duration-1000 ease-out relative'
								style={{
									backgroundColor: getScoreColor(results.overallScore),
									width: `${Math.min(results.overallScore, 100)}%`,
								}}
							>
								<div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] w-full" style={{backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', backgroundSize: '200% 100%'}}></div>
							</div>
						</div>
						<p className='text-sm text-muted-foreground'>
							{level.level === 'Senior'
								? 'Вы достигли высокого уровня! Рассмотрите роль архитектора или техлида.'
								: `Вам осталось ${Math.max(0, level.nextLevelScore - results.overallScore)}% до следующего уровня.`}
						</p>
					</div>

					{/* Детальные результаты по категориям */}
					<div className='mb-12'>
						<h2 className='text-2xl font-bold mb-6 text-foreground'>
							Детальный анализ компетенций
						</h2>
						<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
							{Object.entries(results.categories)
								.sort(([, a], [, b]) => b.score - a.score)
								.map(([category, data]) => (
									<div
										key={category}
										className='bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow flex flex-col justify-between group'
									>
										<div className='flex justify-between items-center mb-4'>
											<div className='flex items-center gap-3'>
												<div>
													<div className='font-semibold text-sm text-foreground line-clamp-2'>
														{data.name}
													</div>
													<div className='text-xs text-muted-foreground mt-0.5'>
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
										<div className='w-full bg-secondary rounded-full h-1.5 mb-3'>
											<div
												className='h-1.5 rounded-full transition-all duration-500'
												style={{
													backgroundColor: getScoreColor(data.score),
													width: `${data.score}%`,
												}}
											/>
										</div>
										<div className='text-xs text-muted-foreground font-medium flex items-center gap-1.5'>
											{getCategoryLabel(data.score)}
										</div>
									</div>
								))}
						</div>
					</div>

					{/* Сводка сильных и слабых сторон */}
					<div className='mb-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-emerald-500/10 dark:bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20'>
							<h3 className='text-lg font-bold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2'>
								<span className="p-1 bg-emerald-500/20 rounded-md text-xl">💪</span> Сильные стороны
							</h3>
							<ul className='space-y-3'>
								{results.strengths && results.strengths.length > 0 ? (
									results.strengths.map((s, idx) => (
										<li key={idx} className='flex items-start gap-3 text-sm text-foreground/90'>
											<span className="text-emerald-600 mt-0.5">✓</span>
											<span className="font-medium">
												{s.name} <span className="text-muted-foreground font-normal">({s.score}%)</span>
											</span>
										</li>
									))
								) : (
									<li className="text-muted-foreground text-sm">Требуют развития</li>
								)}
							</ul>
						</div>
						<div className='bg-rose-500/10 dark:bg-rose-500/5 rounded-2xl p-6 border border-rose-500/20'>
							<h3 className='text-lg font-bold mb-4 text-rose-700 dark:text-rose-400 flex items-center gap-2'>
								<span className="p-1 bg-rose-500/20 rounded-md text-xl">📚</span> Зоны развития
							</h3>
							<ul className='space-y-3'>
								{results.weaknesses && results.weaknesses.length > 0 ? (
									results.weaknesses.map((w, idx) => (
										<li key={idx} className='flex items-start gap-3 text-sm text-foreground/90'>
											<span className="text-rose-600 mt-0.5">→</span>
											<span className="font-medium">
												{w.name} <span className="text-muted-foreground font-normal">({w.score}%)</span>
											</span>
										</li>
									))
								) : (
									<li className="text-muted-foreground text-sm">Все компетенции на хорошем уровне</li>
								)}
							</ul>
						</div>
					</div>

					{/* AI-рекомендации */}
					{aiRecommendations && (
						<div className='mb-8'>
							{/* Плашка поддержки над рекомендациями */}
							<div className='mb-8 text-center'>
								<div className='bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-200/50 dark:border-violet-800/50 rounded-2xl p-6'>
									<div className='flex items-center justify-center gap-3 mb-4'>
										<div className='text-3xl'>☕</div>
										<h3 className='text-lg font-semibold text-foreground'>
											Спасибо за прохождение теста!
										</h3>
									</div>
									<p className='text-muted-foreground mb-6 max-w-lg mx-auto'>
										Если результаты оказались полезными, вы можете поддержать
										развитие проекта
									</p>
									<Button
										onClick={() =>
											window.open(
												'https://donate.stream/donate_68f0f783320e3',
												'_blank'
											)
										}
										className='bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/20 px-8'
										size="lg"
									>
										<span>💜</span>
										Поддержать проект
									</Button>
									<p className='text-xs text-muted-foreground mt-4'>
										Добровольная поддержка • Не является оплатой услуг
									</p>
								</div>
							</div>

							<h2 className='text-2xl font-bold mb-6 text-foreground flex items-center gap-3'>
								<span className="text-3xl">🤖</span> AI-рекомендации для развития
							</h2>
							<div className='bg-muted/30 rounded-2xl p-6 sm:p-8 text-foreground prose prose-zinc dark:prose-invert max-w-none border border-border'>
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
						<div className='mb-8'>
							<AILoader message='ИИ анализирует ваши ответы и создает персональные рекомендации...' />

							{/* Кнопка поддержки во время генерации */}
							<div className='mt-8 text-center'>
								<div className='bg-muted/30 border border-border rounded-2xl p-6'>
									<div className='flex items-center justify-center gap-3 mb-4'>
										<div className='text-3xl'>☕</div>
										<h3 className='text-lg font-semibold text-foreground'>
											Пока ждёте результаты...
										</h3>
									</div>
									<p className='text-muted-foreground mb-6 max-w-lg mx-auto'>
										Если тест оказался полезным, вы можете поддержать развитие
										проекта
									</p>
									<Button
										onClick={() =>
											window.open(
												'https://donate.stream/donate_68f0f783320e3',
												'_blank'
											)
										}
										className='bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/20'
									>
										<span>💜</span>
										Поддержать проект
									</Button>
									<p className='text-xs text-muted-foreground mt-4'>
										Добровольная поддержка • Не является оплатой услуг
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Кнопки */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t border-border'>
						{resultId && (
							<Button
								variant="outline"
								onClick={() => {
									navigator.clipboard.writeText(shareUrl)
									setCopied(true)
									setTimeout(() => setCopied(false), 1500)
								}}
								className={`
									border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950
									dark:border-amber-900/50 dark:bg-amber-900/10 dark:text-amber-200 dark:hover:bg-amber-900/20
								`}
							>
								{copied ? 'Скопировано!' : 'Скопировать ссылку'}
							</Button>
						)}
						<Button
							variant="outline"
							onClick={onCopyReport}
							className="bg-background"
						>
							Скопировать отчёт
						</Button>
						<Button
							onClick={onRestart}
							className="shadow-md"
						>
							Пройти заново
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResultsScreen
