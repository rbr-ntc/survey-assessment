const AILoader = ({ message = 'ИИ анализирует ваши ответы...' }) => {
	return (
		<div className='flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200'>
			{/* Анимированные звездочки ИИ */}
			<div className='relative mb-6'>
				{/* Центральная звезда */}
				<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse'>
					<span className='text-2xl text-white font-bold'>🤖</span>
				</div>

				{/* Вращающиеся звездочки вокруг центра */}
				<div className='absolute inset-0 animate-spin'>
					<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
						<div className='w-4 h-4 bg-yellow-400 rounded-full animate-ping'></div>
					</div>
					<div className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2'>
						<div
							className='w-3 h-3 bg-green-400 rounded-full animate-ping'
							style={{ animationDelay: '0.5s' }}
						></div>
					</div>
					<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
						<div
							className='w-3 h-3 bg-purple-400 rounded-full animate-ping'
							style={{ animationDelay: '1s' }}
						></div>
					</div>
					<div className='absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2'>
						<div
							className='w-4 h-4 bg-red-400 rounded-full animate-ping'
							style={{ animationDelay: '1.5s' }}
						></div>
					</div>
				</div>

				{/* Дополнительные звездочки с разными задержками */}
				<div
					className='absolute top-2 right-2 animate-bounce'
					style={{ animationDelay: '0.2s' }}
				>
					<div className='w-2 h-2 bg-pink-400 rounded-full'></div>
				</div>
				<div
					className='absolute bottom-2 left-2 animate-bounce'
					style={{ animationDelay: '0.4s' }}
				>
					<div className='w-2 h-2 bg-orange-400 rounded-full'></div>
				</div>
				<div
					className='absolute top-2 left-2 animate-bounce'
					style={{ animationDelay: '0.6s' }}
				>
					<div className='w-2 h-2 bg-teal-400 rounded-full'></div>
				</div>
				<div
					className='absolute bottom-2 right-2 animate-bounce'
					style={{ animationDelay: '0.8s' }}
				>
					<div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
				</div>
			</div>

			{/* Текст загрузки */}
			<div className='text-center'>
				<h3 className='text-lg font-semibold text-gray-800 mb-2'>
					Генерация AI-рекомендаций
				</h3>
				<p className='text-gray-600 text-sm mb-4'>{message}</p>

				{/* Прогресс-бар */}
				<div className='w-48 h-2 bg-gray-200 rounded-full overflow-hidden'>
					<div className='h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse'></div>
				</div>

				{/* Дополнительные индикаторы */}
				<div className='flex justify-center space-x-2 mt-4'>
					<div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
					<div
						className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'
						style={{ animationDelay: '0.2s' }}
					></div>
					<div
						className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'
						style={{ animationDelay: '0.4s' }}
					></div>
				</div>
			</div>
		</div>
	)
}

export default AILoader
