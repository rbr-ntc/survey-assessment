'use client'
import { createContext, useContext, useState } from 'react'
import categories from '../lib/categories'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'MY_SUPER_SECRET_API_KEY'

const AssessmentContext = createContext()

export const AssessmentProvider = ({ children }) => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState({})
	const [results, setResults] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [aiRecommendations, setAiRecommendations] = useState(null)
	const [menteeInfo, setMenteeInfo] = useState({
		name: '',
		email: '',
		experience: '',
	})
	const [showResults, setShowResults] = useState(false)
	const [showIntro, setShowIntro] = useState(true)
	const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
		useState(false)
	const [questions, setQuestions] = useState([])
	const [isQuestionsLoading, setIsQuestionsLoading] = useState(false)

	// Загрузка вопросов с backend только по запросу
	const fetchQuestions = async () => {
		setIsQuestionsLoading(true)
		setError(null)
		try {
			const res = await fetch(`${API_URL}/questions`, {
				headers: { 'x-api-key': API_KEY },
			})
			if (!res.ok) throw new Error('Ошибка загрузки вопросов')
			const data = await res.json()
			setQuestions(data)
		} catch (e) {
			setError(e.message)
		} finally {
			setIsQuestionsLoading(false)
		}
	}

	const calculateResults = () => {
		const categoryScores = {}
		const categoryMaxScores = {}

		Object.keys(categories).forEach(cat => {
			categoryScores[cat] = 0
			categoryMaxScores[cat] = 0
		})

		questions.forEach(question => {
			const answer = answers[question.id]
			const category = question.category
			const maxScore = 5
			categoryMaxScores[category] += maxScore

			if (answer) {
				const option = question.options.find(opt => opt.value === answer)
				if (option) {
					categoryScores[category] += option.score
				}
			}
		})

		const percentages = {}
		Object.keys(categories).forEach(cat => {
			if (categoryMaxScores[cat] > 0) {
				percentages[cat] = Math.round(
					(categoryScores[cat] / categoryMaxScores[cat]) * 100
				)
			} else {
				percentages[cat] = 0
			}
		})

		// Взвешенный общий балл
		let weightedSum = 0
		let totalWeight = 0
		Object.entries(percentages).forEach(([cat, score]) => {
			weightedSum += score * categories[cat].weight
			totalWeight += categories[cat].weight
		})
		const overallScore = Math.round(weightedSum / totalWeight)

		return { percentages, overallScore }
	}

	const getDetailedLevel = score => {
		if (score >= 85)
			return {
				level: 'Senior',
				icon: '🏆',
				description: 'Экспертный уровень системного аналитика',
				nextLevel: 'Lead/Architect',
				minYears: '5+',
			}
		if (score >= 70)
			return {
				level: 'Middle+',
				icon: '📈',
				description: 'Уверенный Middle с потенциалом роста',
				nextLevel: 'Senior',
				minYears: '3-5',
			}
		if (score >= 55)
			return {
				level: 'Middle',
				icon: '📊',
				description: 'Самостоятельный системный аналитик',
				nextLevel: 'Middle+',
				minYears: '2-3',
			}
		if (score >= 40)
			return {
				level: 'Junior+',
				icon: '📝',
				description: 'Развивающийся Junior',
				nextLevel: 'Middle',
				minYears: '1-2',
			}
		return {
			level: 'Junior',
			icon: '🌱',
			description: 'Начинающий системный аналитик',
			nextLevel: 'Junior+',
			minYears: '0-1',
		}
	}

	// Отправка результатов на backend
	const submitResults = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const payload = { user: menteeInfo, answers }
			console.log('Отправка на /results:', payload)
			const res = await fetch(`${API_URL}/results`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': API_KEY,
				},
				body: JSON.stringify(payload),
			})
			if (!res.ok) throw new Error('Ошибка отправки результатов')
			const data = await res.json()
			setResults(data)
			return data
		} catch (e) {
			setError(e.message)
		} finally {
			setIsLoading(false)
		}
	}

	// Получение AI-рекомендаций с backend
	const fetchRecommendations = async result => {
		setIsGeneratingRecommendations(true)
		setError(null)
		try {
			// Формируем payload только с нужными полями
			const payload = {
				user: result.user || menteeInfo,
				overallScore: result.overallScore,
				level: result.level,
				strengths: result.strengths,
				weaknesses: result.weaknesses,
			}
			console.log('Отправка на /recommendations:', payload)
			const res = await fetch(`${API_URL}/recommendations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': API_KEY,
				},
				body: JSON.stringify(payload),
			})
			if (!res.ok) throw new Error('Ошибка получения рекомендаций')
			const markdown = await res.text()
			setAiRecommendations(markdown)
			return markdown
		} catch (e) {
			setAiRecommendations(
				'Не удалось получить рекомендации. Попробуйте позже.'
			)
			setError(e.message)
		} finally {
			setIsGeneratingRecommendations(false)
		}
	}

	const handleStartAssessment = async userInfo => {
		if (userInfo && userInfo.name && userInfo.email && userInfo.experience) {
			setMenteeInfo(userInfo)
			await fetchQuestions()
			setShowIntro(false)
		} else if (menteeInfo.name && menteeInfo.email && menteeInfo.experience) {
			await fetchQuestions()
			setShowIntro(false)
		}
	}

	const startQuickTest = async testType => {
		setIsLoading(true)
		setError(null)
		try {
			const res = await fetch(`${API_URL}/quick-test`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': API_KEY,
				},
				body: JSON.stringify({ test_type: testType }),
			})
			if (!res.ok) throw new Error('Ошибка запуска быстрого теста')
			const data = await res.json()
			// Перенаправляем на страницу результатов
			window.location.href = `/result/${data.test_id}`
			return data
		} catch (e) {
			setError(e.message)
			throw e
		} finally {
			setIsLoading(false)
		}
	}

	const handleAnswer = value => {
		setAnswers({ ...answers, [questions[currentQuestionIndex].id]: value })
	}

	const handleNext = async () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		} else {
			// Завершено: отправляем результаты и получаем рекомендации
			await submitResults()
		}
	}

	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1)
		}
	}

	const getScoreColor = score => {
		if (score >= 80) return '#059669'
		if (score >= 60) return '#2563eb'
		if (score >= 40) return '#f59e0b'
		return '#ef4444'
	}

	const resetAssessment = () => {
		setCurrentQuestionIndex(0)
		setAnswers({})
		setResults(null)
		setAiRecommendations(null)
		setError(null)
		setMenteeInfo({ name: '', email: '', experience: '' })
		setShowResults(false)
		setShowIntro(true)
	}

	return (
		<AssessmentContext.Provider
			value={{
				currentQuestionIndex,
				setCurrentQuestionIndex,
				answers,
				setAnswers,
				results,
				setResults,
				isLoading,
				setIsLoading,
				error,
				setError,
				aiRecommendations,
				setAiRecommendations,
				menteeInfo,
				setMenteeInfo,
				showResults,
				setShowResults,
				showIntro,
				setShowIntro,
				isGeneratingRecommendations,
				setIsGeneratingRecommendations,
				answerQuestion: handleAnswer,
				nextQuestion: handleNext,
				prevQuestion: handlePrev,
				resetAssessment,
				submitResults,
				fetchRecommendations,
				questions,
				handleStartAssessment,
				startQuickTest,
				calculateResults,
				getDetailedLevel,
				getScoreColor,
				isQuestionsLoading,
			}}
		>
			{children}
		</AssessmentContext.Provider>
	)
}

export const useAssessment = () => useContext(AssessmentContext)
