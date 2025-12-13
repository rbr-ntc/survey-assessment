import { Confetti } from '@/components/magicui/confetti'
import 'highlight.js/styles/github.css'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import AILoader from './AILoader'
import { Button } from '@/components/ui/button'

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
		if (score >= 80) return '🌟 Эксперт'
		if (score >= 60) return '✅ Хороший уровень'
		if (score >= 40) return '📈 Требует развития'
		return '⚠️ Приоритет'
	}

	return (
		<div className='min-h-screen bg-slate-50/50 py-12'>
			<Confetti
				ref={confettiRef}
				className='absolute left-0 top-0 z-0 size-full pointer-events-none'
			/>
			<div className='max-w-5xl mx-auto px-4'>

                {/* Header Card */}
				<div className='bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-slate-100 mb-8 text-center relative overflow-hidden'>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="mb-6 inline-flex p-4 bg-slate-50 rounded-2xl text-6xl shadow-inner border border-slate-100">
                        {level.icon}
                    </div>

                    <h1 className='text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight'>
                        {level.level}
                    </h1>
                    <p className='text-lg text-slate-500 max-w-2xl mx-auto mb-8'>
                        {level.description}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
                        <div className="text-center">
                            <div className='text-5xl font-bold mb-1' style={{ color: getScoreColor(results.overallScore) }}>
                                {results.overallScore}%
                            </div>
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Общий балл</div>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-slate-100" />
                        <div className="text-center">
                            <div className='text-5xl font-bold text-slate-700 mb-1'>
                                {level.minYears}+
                            </div>
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Лет опыта (avg)</div>
                        </div>
                    </div>
				</div>

                {/* Progress Card */}
                <div className='bg-white rounded-2xl p-8 shadow-soft border border-slate-100 mb-8'>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
                        <div>
                            <h2 className='text-xl font-bold text-slate-900'>
                                Прогресс до уровня <span className="text-indigo-600">{level.nextLevel}</span>
                            </h2>
                             <p className='text-sm text-slate-500 mt-1'>
                                {level.level === 'Senior'
                                    ? 'Вы достигли вершины! Время быть ментором.'
                                    : `Еще немного усилий для перехода на следующий уровень.`}
                            </p>
                        </div>
                        <div className="text-right text-sm font-medium text-slate-600">
                            Цель: <span className="text-slate-900 font-bold">{level.nextLevelScore}%</span>
                        </div>
                    </div>

                    <div className='w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden'>
                        <div
                            className='h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden'
                            style={{
                                backgroundColor: getScoreColor(results.overallScore),
                                width: `${Math.min(results.overallScore, 100)}%`,
                            }}
                        >
                             <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'}}></div>
                        </div>
                    </div>
                </div>

                {/* Competencies Grid */}
				<div className='mb-12'>
					<h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                        <span>📊</span> Детальная аналитика
                    </h2>
					<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
						{Object.entries(results.categories)
							.sort(([, a], [, b]) => b.score - a.score)
							.map(([category, data]) => (
								<div
									key={category}
									className='bg-white rounded-xl p-6 border shadow-sm transition-all hover:shadow-md flex flex-col justify-between'
                                    style={{
                                        borderColor: 'var(--border)'
                                    }}
								>
									<div className='flex justify-between items-start mb-4'>
										<div>
											<div className='font-bold text-slate-900 text-lg mb-0.5'>
												{data.name}
											</div>
											<div className='text-xs font-medium text-slate-400'>
												Вес категории: {data.weight}x
											</div>
										</div>
										<span
											className='text-xl font-bold px-2 py-1 rounded-md bg-slate-50'
											style={{ color: getScoreColor(data.score) }}
										>
											{data.score}%
										</span>
									</div>

                                    <div className="mt-auto">
                                        <div className='w-full bg-slate-100 rounded-full h-2 mb-3'>
                                            <div
                                                className='h-2 rounded-full transition-all duration-1000'
                                                style={{
                                                    backgroundColor: getScoreColor(data.score),
                                                    width: `${data.score}%`,
                                                }}
                                            />
                                        </div>
                                        <div className='text-xs font-medium text-slate-500 flex items-center gap-1.5'>
                                            {getCategoryLabel(data.score)}
                                        </div>
                                    </div>
								</div>
							))}
					</div>
				</div>

                {/* Strengths & Weaknesses */}
				<div className='mb-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 relative overflow-hidden'>
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl text-emerald-900 pointer-events-none">💪</div>
						<h3 className='text-xl font-bold mb-6 text-emerald-900 flex items-center gap-2 relative z-10'>
							Сильные стороны
						</h3>
						<ul className='space-y-3 relative z-10'>
							{results.strengths && results.strengths.length > 0 ? (
								results.strengths.map((s, idx) => (
									<li key={idx} className='flex items-start gap-3 text-emerald-800 font-medium'>
										<span className="mt-1 w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-xs">✓</span>
										<span>
											{s.name} <span className="opacity-60 text-sm">({s.score}%)</span>
										</span>
									</li>
								))
							) : (
								<li className="text-emerald-700 italic">Требуют развития</li>
							)}
						</ul>
					</div>
					<div className='bg-rose-50/50 border border-rose-100 rounded-2xl p-8 relative overflow-hidden'>
                         <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl text-rose-900 pointer-events-none">🎯</div>
						<h3 className='text-xl font-bold mb-6 text-rose-900 flex items-center gap-2 relative z-10'>
							Зоны роста
						</h3>
						<ul className='space-y-3 relative z-10'>
							{results.weaknesses && results.weaknesses.length > 0 ? (
								results.weaknesses.map((w, idx) => (
									<li key={idx} className='flex items-start gap-3 text-rose-800 font-medium'>
										<span className="mt-1 w-5 h-5 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs">!</span>
										<span>
											{w.name} <span className="opacity-60 text-sm">({w.score}%)</span>
										</span>
									</li>
								))
							) : (
								<li className="text-rose-700 italic">Все компетенции на отличном уровне</li>
							)}
						</ul>
					</div>
				</div>

                {/* AI Recommendations */}
				{aiRecommendations && (
					<div className='mb-12'>
                        <div className='mb-8'>
                             <div className='bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6'>
                                <div className='flex items-center gap-4'>
                                     <div className='w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl'>☕</div>
                                     <div>
                                        <h3 className='text-lg font-bold text-slate-900'>
                                            Вам понравился тест?
                                        </h3>
                                        <p className='text-slate-600 text-sm'>
                                            Поддержите проект, чтобы мы могли развивать AI-функции.
                                        </p>
                                     </div>
                                </div>
                                <Button
                                    onClick={() =>
                                        window.open(
                                            'https://donate.stream/donate_68f0f783320e3',
                                            '_blank'
                                        )
                                    }
                                    className='bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/20 whitespace-nowrap'
                                >
                                    <span>💜</span>
                                    <span className="ml-2">Поддержать проект</span>
                                </Button>
                             </div>
                        </div>

						<h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3'>
                            <span className="text-3xl">🤖</span>
                            Персональные рекомендации AI
                        </h2>
						<div className='bg-white rounded-2xl p-8 shadow-soft border border-slate-100 prose prose-slate prose-headings:font-bold prose-a:text-indigo-600 max-w-none'>
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
					<div className='mb-12'>
						<AILoader message='ИИ анализирует ваши ответы и составляет персональный план развития...' />

                         <div className='mt-8 max-w-2xl mx-auto'>
                             <div className='bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center'>
                                <p className='text-slate-500 mb-4 text-sm'>
                                    Пока мы готовим результаты, вы можете поддержать проект
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open(
                                            'https://donate.stream/donate_68f0f783320e3',
                                            '_blank'
                                        )
                                    }
                                    className='gap-2'
                                >
                                    <span>☕</span>
                                    Поддержать автора
                                </Button>
                             </div>
                        </div>
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center mt-12 pb-12'>
					{resultId && (
						<Button
                            variant="secondary"
                            size="lg"
							onClick={() => {
								navigator.clipboard.writeText(shareUrl)
								setCopied(true)
								setTimeout(() => setCopied(false), 1500)
							}}
							className='bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-200'
						>
							{copied ? 'Скопировано!' : '🔗 Поделиться ссылкой'}
						</Button>
					)}
					<Button
                        variant="outline"
                        size="lg"
						onClick={onCopyReport}
                        className="bg-white"
					>
						📋 Скопировать отчет
					</Button>
					<Button
                        size="lg"
						onClick={onRestart}
                        className="bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/20"
					>
						🔄 Пройти заново
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ResultsScreen
