'use client'
import { use, useEffect, useRef, useState } from 'react'
import ResultsScreen from '../../../components/ResultsScreen'

export default function ResultPageClient({ params }) {
	const { id } = use(params)
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [copied, setCopied] = useState(false)
	const pollingRef = useRef(null)

	// Первый fetch результата
	useEffect(() => {
		let cancelled = false
		async function fetchInitial() {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/results/${id}`,
					{
						headers: {
							'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
						},
					}
				)
				if (!res.ok) throw new Error('Результат не найден')
				const data = await res.json()
				if (!cancelled) setResult(data)
				if (!data.recommendations && !pollingRef.current) {
					startPolling()
				}
			} catch (e) {
				if (!cancelled) setError(e.message)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		fetchInitial()
		return () => {
			cancelled = true
			if (pollingRef.current) clearInterval(pollingRef.current)
		}
	}, [id, startPolling])

	// Polling только для рекомендаций
	function startPolling() {
		pollingRef.current = setInterval(async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/results/${id}`,
					{
						headers: {
							'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
						},
					}
				)
				if (!res.ok) return
				const data = await res.json()
				if (data.recommendations) {
					setResult(prev => ({
						...prev,
						recommendations: data.recommendations,
					}))
					clearInterval(pollingRef.current)
					pollingRef.current = null
				}
			} catch {}
		}, 3000)
	}

	if (loading) return <div className='p-8 text-center'>Загрузка...</div>
	if (error) return <div className='p-8 text-center text-red-500'>{error}</div>
	if (!result) return null

	const handleCopyReport = () => {
		const reportText = `Отчет по оценке навыков системного аналитика
====================================================
Имя: ${result.user?.name || ''}
Опыт: ${result.user?.experience || ''}
Дата: ${new Date(result.created_at).toLocaleDateString()}

РЕЗУЛЬТАТЫ
====================================================
Уровень: ${result.level?.level || ''} (${result.level?.description || ''})
Общий балл: ${result.overallScore}%
Следующий уровень: ${result.level?.nextLevel || ''}

ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ ПО КОМПЕТЕНЦИЯМ
====================================================
${Object.entries(result.categories || {})
	.sort(([, a], [, b]) => b.score - a.score)
	.map(
		([cat, data]) =>
			`${data.name}: ${data.score}% ${
				data.score >= 70 ? '✅' : data.score >= 50 ? '📈' : '⚠️'
			}`
	)
	.join('\n')}

СИЛЬНЫЕ СТОРОНЫ
====================================================
${
	result.strengths && result.strengths.length > 0
		? result.strengths.map(s => `- ${s.name} (${s.score}%)`).join('\n')
		: 'Требуют развития'
}

ЗОНЫ РАЗВИТИЯ
====================================================
${
	result.weaknesses && result.weaknesses.length > 0
		? result.weaknesses.map(w => `- ${w.name} (${w.score}%)`).join('\n')
		: 'Все компетенции на хорошем уровне'
}

${
	result.recommendations
		? `\nПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ ОТ AI\n====================================================\n${result.recommendations}`
		: ''
}
`
		navigator.clipboard.writeText(reportText)
		alert('Отчет скопирован в буфер обмена!')
	}

	const handleRestart = () => {
		window.location.href = '/'
	}

	return (
		<div>
			<ResultsScreen
				menteeInfo={result.user}
				results={{
					overallScore: result.overallScore,
					level: result.level,
					categories: result.categories,
					strengths: result.strengths,
					weaknesses: result.weaknesses,
				}}
				level={result.level}
				categories={result.categories}
				getScoreColor={score =>
					score >= 80
						? '#10b981'
						: score >= 60
						? '#3b82f6'
						: score >= 40
						? '#f59e42'
						: '#ef4444'
				}
				isGeneratingRecommendations={!result.recommendations}
				aiRecommendations={result.recommendations}
				onCopyReport={handleCopyReport}
				onRestart={handleRestart}
				resultId={id}
			/>
		</div>
	)
}
