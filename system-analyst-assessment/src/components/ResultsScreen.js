import { Confetti } from '@/components/magicui/confetti'
import { Button } from '@/components/ui/button'
import 'highlight.js/styles/github.css'
import {
    BookOpen,
    Zap,
    BarChart3,
    Share2,
    RefreshCw,
    Award,
    TrendingUp,
    Code,
    Database,
    Globe,
    Lock,
    Users,
    Layout,
    Server,
    FileText,
    Copy,
    CheckCircle
} from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import AILoader from './AILoader'

// Helper to get category icon
const getCategoryIcon = (key) => {
    const icons = {
        documentation: FileText,
        modeling: Layout,
        api: Globe,
        database: Database,
        messaging: Server,
        system_design: Code,
        security: Lock,
        analytical: TrendingUp,
        communication: Users,
    };
    return icons[key] || Zap;
};

// Helper to determine skill level based on score
const getSkillLevel = (score) => {
    if (score >= 90) return { label: 'Senior', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' };
    if (score >= 70) return { label: 'Middle', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 40) return { label: 'Junior', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    return { label: 'Novice', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
};

// Short actionable advice per category based on score ranges
const getCategoryAdvice = (categoryKey, score) => {
    const advice = {
        documentation: {
            low: "Изучите шаблоны User Story и Use Case.",
            mid: "Освойте Docs as Code (Mermaid, AsciiDoc).",
            high: "Внедряйте стандарты документации в команду."
        },
        modeling: {
            low: "Разберитесь с базовыми нотациями BPMN.",
            mid: "Практикуйте сложные диаграммы состояний.",
            high: "Оптимизируйте бизнес-процессы через модели."
        },
        api: {
            low: "Поймите разницу между GET и POST.",
            mid: "Изучите RESTful Best Practices и Swagger.",
            high: "Проектируйте Backward Compatible API."
        },
        database: {
            low: "Освойте SELECT, JOIN и типы данных.",
            mid: "Разберитесь с индексами и нормализацией.",
            high: "Изучите NoSQL и оптимизацию запросов."
        },
        // Fallbacks for others...
    };

    const level = score >= 80 ? 'high' : score >= 50 ? 'mid' : 'low';
    return advice[categoryKey]?.[level] || "Продолжайте практиковаться и изучать новые материалы.";
};


// Expert tips dictionary based on categories (expanded)
const EXPERT_TIPS = {
	documentation: {
		title: 'Документация как продукт',
		text: 'Хорошая документация — это не просто текст, это интерфейс вашего решения для разработчиков. Используйте подход "Docs as Code" и помните: если этого нет в Confluence/Jira, этого не существует.',
	},
	modeling: {
		title: 'Моделирование процессов',
		text: 'BPMN — это стандарт, но иногда простая Activity diagram понятнее. Главное правило: одна диаграмма должна отвечать на один вопрос. Не пытайтесь уместить весь мир на одной схеме.',
	},
	api: {
		title: 'Проектирование API',
		text: 'REST — это база, но не забывайте про идемпотентность методов. Всегда думайте о том, как клиент будет обрабатывать ошибки и изменения в контракте (Backward Compatibility).',
	},
	database: {
		title: 'Работа с данными',
		text: 'Нормализация — это хорошо для теории, но в высоконагруженных системах денормализация спасает жизнь. Учитесь находить баланс между целостностью данных и скоростью чтения.',
	},
	messaging: {
		title: 'Асинхронность',
		text: 'В микросервисах "Eventual Consistency" — ваш лучший друг и худший враг. Всегда проектируйте систему с учетом того, что сообщение может прийти дважды или не прийти вовсе.',
	},
	system_design: {
		title: 'Системный дизайн',
		text: 'Начинайте с нефункциональных требований (NFR). Именно они определяют архитектуру, а не фичи. Scalability, Reliability, Maintainability — три кита.',
	},
	security: {
		title: 'Безопасность',
		text: 'Security by Design. Не оставляйте безопасность "на потом". Авторизация, аутентификация и защита персональных данных должны быть заложены в фундамент.',
	},
	analytical: {
		title: 'Аналитическое мышление',
		text: 'Задавайте "5 почему". Ваша задача — не просто записать требования заказчика, а понять истинную боль бизнеса и предложить решение, которое может отличаться от "хотелок".',
	},
	communication: {
		title: 'Коммуникации',
		text: 'Soft skills для аналитика важнее, чем знание SQL. Умение договориться с бизнесом и объяснить задачу разработчикам на их языке — вот ваша суперсила.',
	},
}

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
	const [copied, setCopied] = useState(false)
	const confettiRef = useRef(null)

    // Calculate percentile (mock logic for demo)
    const percentile = useMemo(() => {
        const base = results.overallScore;
        let p = 0;
        if (base < 40) p = base * 0.5;
        else if (base < 60) p = 20 + (base - 40);
        else if (base < 80) p = 40 + (base - 60) * 2;
        else p = 80 + (base - 80);
        return Math.min(99, Math.round(p));
    }, [results.overallScore]);

    // Find the weakest category
    const weakestCategory = useMemo(() => {
        if (!results.categories) return null;
        const sorted = Object.entries(results.categories).sort(([, a], [, b]) => a.score - b.score);
        return sorted[0]; // [key, data]
    }, [results.categories]);

    const expertTip = weakestCategory ? EXPERT_TIPS[weakestCategory[0]] : null;

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

	return (
		<div className='min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24'>
			<Confetti
				ref={confettiRef}
				className='absolute left-0 top-0 z-0 size-full pointer-events-none'
			/>

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                 <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">E</span>
                    <span>Evaly.ru</span>
                 </div>
                 <div className="text-sm font-medium text-slate-500">
                    Анализ компетенций 2025
                 </div>
            </div>

			<div className='max-w-4xl mx-auto px-4 pt-12'>

                {/* 1. Hero / Digest Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6 border border-indigo-100">
                        ✨ Ваш результат готов
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {level.level}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
                        {level.description}
                    </p>
                </div>

                {/* 2. Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Score Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-200 transition-colors">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-80 transition-opacity"></div>

                        <div>
                            <div className="text-slate-500 font-medium mb-1 flex items-center gap-2">
                                <Award className="w-4 h-4" /> Общий балл
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold text-slate-900 tracking-tighter">
                                    {results.overallScore}
                                </span>
                                <span className="text-2xl text-slate-400 font-medium">/100</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700">Лучше, чем {percentile}% участников</span>
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                             <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${percentile}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Level Progress Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-slate-900/20 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>

                        <div className="relative z-10">
                            <div className="text-slate-400 font-medium mb-1 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Следующий уровень
                            </div>
                            <div className="text-3xl font-bold tracking-tight mb-2">
                                {level.nextLevel}
                            </div>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                {level.level === 'Senior'
                                    ? 'Вершина достигнута. Время вести за собой.'
                                    : 'Осталось немного усилий для перехода на новый грейд.'}
                            </p>
                        </div>

                        <div className="relative z-10 mt-6">
                            <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                                <span>Прогресс</span>
                                <span>{results.overallScore}% / {level.nextLevelScore}%</span>
                            </div>
                             <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                <div
                                    className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((results.overallScore / level.nextLevelScore) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Expert Insight Section (Highlighted Weakness) */}
                {expertTip && (
                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-8 mb-12 relative overflow-hidden">
                         <div className="absolute top-4 right-4 text-amber-500/20">
                            <Zap className="w-24 h-24 rotate-12" />
                         </div>
                         <div className="relative z-10">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <Zap className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">Совет эксперта</div>
                                    <div className="font-bold text-slate-900">Зона роста: {weakestCategory[1].name}</div>
                                </div>
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 mb-2">&quot;{expertTip.title}&quot;</h3>
                             <p className="text-slate-700 leading-relaxed max-w-xl">
                                 {expertTip.text}
                             </p>
                         </div>
                     </div>
                )}

                {/* 4. Skills Breakdown (New Grid Layout) */}
                <div className="mb-16">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Карта компетенций
                        </h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(results.categories)
                            .sort(([, a], [, b]) => b.score - a.score)
                            .map(([key, data]) => {
                                const Icon = getCategoryIcon(key);
                                const skillInfo = getSkillLevel(data.score);
                                const advice = getCategoryAdvice(key, data.score);

                                return (
                                    <div key={key} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col">

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${skillInfo.bg} ${skillInfo.color}`}>
                                                {skillInfo.label}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{data.name}</h3>
                                        <div className="text-3xl font-bold text-slate-900 mb-4">
                                            {data.score}<span className="text-lg text-slate-400 font-medium">%</span>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${data.score}%`,
                                                    backgroundColor: data.score >= 80 ? '#10b981' : data.score >= 60 ? '#6366f1' : '#f59e42'
                                                }}
                                            />
                                        </div>

                                        <p className="text-xs text-slate-500 mt-auto pt-4 border-t border-slate-50 leading-relaxed">
                                            {advice}
                                        </p>
                                    </div>
                                );
                            })}
                     </div>
                </div>

                {/* 5. AI Recommendations */}
                <div className="mb-16">
                     <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Ваша стратегия роста
                     </h2>

                    {aiRecommendations ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600 prose-li:text-slate-600">
                             <ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeHighlight]}
							>
								{aiRecommendations}
							</ReactMarkdown>
                        </div>
                    ) : (
                         isGeneratingRecommendations ? (
                             <AILoader message="Искусственный интеллект анализирует ваши ответы..." />
                         ) : (
                             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center text-slate-500">
                                 Рекомендации недоступны
                             </div>
                         )
                    )}
                </div>

                {/* 6. Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 md:static md:bg-transparent md:border-0 md:p-0">
                    <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 h-12 rounded-xl"
                            onClick={onCopyReport}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Копировать отчет
                        </Button>

                        {resultId && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 h-12 rounded-xl"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 2000)
                                }}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                {copied ? 'Скопировано!' : 'Поделиться'}
                            </Button>
                        )}

                         <Button
                            size="lg"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl shadow-lg shadow-indigo-600/20"
                            onClick={onRestart}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Пройти заново
                        </Button>
                    </div>
                </div>

                {/* Support Project - Subtle */}
                <div className="mt-12 mb-24 text-center">
                    <button
                        onClick={() => window.open('https://donate.stream/donate_68f0f783320e3', '_blank')}
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <span>💜</span>
                        <span>Поддержать проект</span>
                    </button>
                </div>

			</div>
		</div>
	)
}

export default ResultsScreen
