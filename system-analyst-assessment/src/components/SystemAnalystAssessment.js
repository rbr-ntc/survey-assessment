'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import categories from '../lib/categories'
import AILoader from './AILoader'
import { useAssessment } from './AssessmentContext'
import IntroForm from './IntroForm'
import QuestionScreen from './QuestionScreen'
import ResultsScreen from './ResultsScreen'

const SystemAnalystAssessment = () => {
	const router = useRouter()
	const [isProcessingResults, setIsProcessingResults] = useState(false)
	const {
		currentQuestionIndex,
		answers,
		menteeInfo,
		setMenteeInfo,
		showResults,
		showIntro,
		aiRecommendations,
		isGeneratingRecommendations,
		answerQuestion,
		nextQuestion,
		prevQuestion,
		calculateResults,
		getDetailedLevel,
		getScoreColor,
		handleStartAssessment,
		questions,
		results,
		submitResults,
	} = useAssessment()

	const handleFinish = async () => {
		setIsProcessingResults(true)
		try {
			const data = await submitResults()
			if (data && data.result_id) {
				router.push(`/result/${data.result_id}`)
			}
		} catch (error) {
			console.error('Error submitting results:', error)
		} finally {
			setIsProcessingResults(false)
		}
	}

	if (showIntro) {
		return (
			<IntroForm
				menteeInfo={menteeInfo}
				setMenteeInfo={setMenteeInfo}
				handleStartAssessment={handleStartAssessment}
				disabled={
					!menteeInfo.name || !menteeInfo.email || !menteeInfo.experience
				}
				questionsCount={questions.length}
			/>
		)
	}

	if (showResults) {
		const level = results?.level || {}
		const categories = results?.categories || {}

		const onCopyReport = () => {
			const reportText = `Отчет по оценке навыков системного аналитика
====================================================
Имя: ${menteeInfo.name}
Email: ${menteeInfo.email}
Опыт: ${menteeInfo.experience}
Дата: ${new Date().toLocaleDateString()}

РЕЗУЛЬТАТЫ
====================================================
Уровень: ${level.level} (${level.description})
Общий балл: ${results.overallScore}%
Следующий уровень: ${level.nextLevel}

ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ ПО КОМПЕТЕНЦИЯМ
====================================================
${Object.entries(categories)
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
	results.strengths && results.strengths.length > 0
		? results.strengths.map(s => `- ${s.name} (${s.score}%)`).join('\n')
		: 'Требуют развития'
}

ЗОНЫ РАЗВИТИЯ
====================================================
${
	results.weaknesses && results.weaknesses.length > 0
		? results.weaknesses.map(w => `- ${w.name} (${w.score}%)`).join('\n')
		: 'Все компетенции на хорошем уровне'
}

${
	aiRecommendations
		? `\nПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ ОТ AI
====================================================\n${aiRecommendations}`
		: ''
}
`
			navigator.clipboard.writeText(reportText)
			alert('Отчет скопирован в буфер обмена!')
		}

		const onRestart = () => {
			window.location.reload()
		}

		return (
			<ResultsScreen
				menteeInfo={menteeInfo}
				results={results}
				level={level}
				categories={categories}
				getScoreColor={getScoreColor}
				isGeneratingRecommendations={isGeneratingRecommendations}
				aiRecommendations={aiRecommendations}
				onRestart={onRestart}
				onCopyReport={onCopyReport}
				resultId={results?.result_id}
			/>
		)
	}

	const question = questions[currentQuestionIndex]
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100
	const category = categories[question.category]

	// Показываем AI-лоадер во время обработки результатов
	if (isProcessingResults) {
		return (
			<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
				<AILoader message='Обрабатываем ваши ответы и рассчитываем результаты...' />
			</div>
		)
	}

	return (
		<QuestionScreen
			question={question}
			category={category}
			answers={answers}
			handleAnswer={value => answerQuestion(value)}
			handlePrev={prevQuestion}
			handleNext={nextQuestion}
			currentQuestionIndex={currentQuestionIndex}
			questionsLength={questions.length}
			progress={progress}
			onFinish={handleFinish}
		/>
	)
}

export default SystemAnalystAssessment
