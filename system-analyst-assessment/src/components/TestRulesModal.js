import { useState } from 'react'
import {
  ShieldCheck,
  HelpCircle,
  Zap,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  Brain,
  Scale,
  Play,
  CheckCircle2,
  AlertTriangle,
  GraduationCap
} from 'lucide-react'

const TestRulesModal = ({ isOpen, onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      id: 'main-rule',
      title: 'Главное правило',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      content: (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100/50 ring-4 ring-blue-50 transition-transform duration-500 hover:scale-110">
            <ShieldCheck className="h-10 w-10 text-blue-600" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Честность — залог успеха
            </h3>
            <p className="text-lg leading-relaxed text-gray-600">
              Это <strong>самооценка ваших навыков</strong>. Чем честнее вы
              отвечаете, тем точнее будет оценка и полезнее рекомендации для
              развития.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-to',
      title: 'Как отвечать правильно',
      icon: HelpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-4 rounded-xl border border-green-100 bg-green-50/50 p-4 transition-all hover:bg-green-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-green-100 p-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Отвечайте честно</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Не ищите ответы в интернете. Оценивайте свои реальные знания и опыт.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-yellow-100 bg-yellow-50/50 p-4 transition-all hover:bg-yellow-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-yellow-100 p-2">
                <HelpCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Не знаете? Пишите &quot;Не знаю&quot;
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Это нормально! Лучше честно признать, чем угадывать.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-all hover:bg-blue-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-blue-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Выбирайте лучший вариант
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Если нет идеального ответа, выберите тот, который ближе к вашему опыту.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Особенности теста',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-4 rounded-xl border border-purple-100 bg-purple-50/50 p-4 transition-all hover:bg-purple-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-purple-100 p-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Разные уровни</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Вопросы Junior, Middle и Senior уровней. Не страшно не знать сложные.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4 transition-all hover:bg-orange-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-orange-100 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Ловушки в ответах</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Варианты могут содержать выдуманные технологии или ошибки. Будьте внимательны.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 transition-all hover:bg-indigo-50 hover:shadow-sm">
              <div className="mt-1 rounded-full bg-indigo-100 p-2">
                <Scale className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Умный подсчет</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Даже неидеальный ответ может принести баллы. Система оценивает гибко.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'process',
      title: 'Время и процесс',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      content: (
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100/50 ring-4 ring-indigo-50">
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-6">
              <h4 className="mb-4 font-semibold text-gray-900">Что вас ждет:</h4>
              <ul className="space-y-3">
                {[
                  'Тест займет 15-20 минут',
                  'Можно возвращаться к вопросам',
                  'Автосохранение результатов',
                  'AI-рекомендации в конце'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ]

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const nextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-card relative flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="relative flex flex-col border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar/Dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentStep
                    ? idx === currentStep ? 'w-full bg-indigo-600' : 'w-full bg-indigo-200'
                    : 'w-full bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all ${
                isFirstStep
                  ? 'invisible opacity-0'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              Назад
            </button>

            {isLastStep ? (
              <button
                onClick={onConfirm}
                className="shadow-soft hover:shadow-primary/20 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
              >
                Начать тест
                <Play className="h-5 w-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 font-medium text-white transition-all hover:bg-gray-800 active:scale-95"
              >
                Далее
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestRulesModal
