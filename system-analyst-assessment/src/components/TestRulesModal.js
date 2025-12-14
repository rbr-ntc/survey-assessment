const TestRulesModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
				{/* Заголовок */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<div className='flex items-center gap-3'>
						<div className='text-3xl'>📋</div>
						<h2 className='text-2xl font-bold text-gray-800'>
							Правила тестирования
						</h2>
					</div>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
						aria-label="Закрыть"
					>
						<span aria-hidden="true">×</span>
					</button>
				</div>

				{/* Содержимое */}
				<div className='p-6 space-y-6'>
					{/* Основные правила */}
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<div className='flex items-start gap-3'>
							<div className='text-blue-600 text-xl'>💡</div>
							<div>
								<h3 className='font-semibold text-blue-800 mb-2'>
									Главное правило
								</h3>
								<p className='text-blue-700'>
									Это <strong>самооценка ваших навыков</strong>. Чем честнее вы
									отвечаете, тем точнее будет оценка и полезнее рекомендации для
									развития.
								</p>
							</div>
						</div>
					</div>

					{/* Правила ответов */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
							<span className='text-green-600'>✅</span>
							Как отвечать правильно
						</h3>
						<div className='grid gap-3'>
							<div className='flex items-start gap-3 p-3 bg-green-50 rounded-lg'>
								<div className='text-green-600 text-lg'>🎯</div>
								<div>
									<p className='font-medium text-green-800'>Отвечайте честно</p>
									<p className='text-green-700 text-sm'>
										Не ищите ответы в интернете. Оценивайте свои реальные знания
										и опыт.
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3 p-3 bg-yellow-50 rounded-lg'>
								<div className='text-yellow-600 text-lg'>❓</div>
								<div>
									<p className='font-medium text-yellow-800'>
										Не знаете ответ? Пишите &quot;Не знаю&quot;
									</p>
									<p className='text-yellow-700 text-sm'>
										Это нормально! Лучше честно признать, чем угадывать.
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg'>
								<div className='text-blue-600 text-lg'>📊</div>
								<div>
									<p className='font-medium text-blue-800'>
										Выбирайте наиболее подходящий вариант
									</p>
									<p className='text-blue-700 text-sm'>
										Если нет идеального ответа, выберите тот, который ближе к
										вашему опыту.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Особенности теста */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
							<span className='text-purple-600'>🔍</span>
							Особенности теста
						</h3>
						<div className='grid gap-3'>
							<div className='flex items-start gap-3 p-3 bg-purple-50 rounded-lg'>
								<div className='text-purple-600 text-lg'>🎲</div>
								<div>
									<p className='font-medium text-purple-800'>
										Разные уровни сложности
									</p>
									<p className='text-purple-700 text-sm'>
										В тесте есть вопросы для Junior, Middle и Senior уровней. Не
										переживайте, если не знаете сложные вопросы.
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3 p-3 bg-orange-50 rounded-lg'>
								<div className='text-orange-600 text-lg'>🧪</div>
								<div>
									<p className='font-medium text-orange-800'>
										Есть &quot;соль&quot; в ответах
									</p>
									<p className='text-orange-700 text-sm'>
										Некоторые варианты ответов могут содержать выдуманные
										технологии или неправильные названия. Это нормально!
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3 p-3 bg-indigo-50 rounded-lg'>
								<div className='text-indigo-600 text-lg'>⚖️</div>
								<div>
									<p className='font-medium text-indigo-800'>
										Все ответы имеют баллы
									</p>
									<p className='text-indigo-700 text-sm'>
										Даже если выбранный ответ не идеален, он все равно дает
										баллы. Система учитывает все варианты.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Время и процесс */}
					<div className='bg-gray-50 rounded-lg p-4'>
						<h3 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
							<span className='text-gray-600'>⏱️</span>
							Время и процесс
						</h3>
						<ul className='text-gray-700 space-y-1 text-sm'>
							<li>• Тест займет 15-20 минут</li>
							<li>• Можно вернуться к предыдущим вопросам</li>
							<li>• Результаты сохраняются автоматически</li>
							<li>• AI-рекомендации генерируются после завершения</li>
						</ul>
					</div>
				</div>

				{/* Кнопки */}
				<div className='flex gap-3 p-6 border-t border-gray-200'>
					<button
						onClick={onClose}
						className='flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition'
					>
						Отмена
					</button>
					<button
						onClick={onConfirm}
						className='flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition'
					>
						Понятно, начать тест
					</button>
				</div>
			</div>
		</div>
	)
}

export default TestRulesModal
