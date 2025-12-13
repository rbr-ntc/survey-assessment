const AILoader = ({ message = 'ИИ анализирует ваши ответы...' }) => {
	return (
		<div className='flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-soft max-w-2xl mx-auto'>
			{/* Modern AI Abstract Animation */}
			<div className='relative w-24 h-24 mb-8 flex items-center justify-center'>
				{/* Core */}
				<div className='absolute inset-0 bg-indigo-500/10 rounded-full animate-ping' style={{ animationDuration: '3s' }}></div>
                <div className='absolute inset-4 bg-indigo-500/20 rounded-full animate-ping' style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>

                {/* Icon */}
                <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white animate-pulse">
                        <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.92993 4.92999L7.75993 7.75999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.92993 19.07L7.75993 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.24 7.75999L19.07 4.92999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Orbiting particles */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
                </div>
                 <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-indigo-400 rounded-full translate-x-1/2 translate-y-1/2 blur-[1px]"></div>
                </div>

			</div>

			{/* Text Content */}
			<div className='text-center max-w-md'>
				<h3 className='text-xl font-bold text-slate-900 mb-3 tracking-tight'>
					Генерация AI-рекомендаций
				</h3>
				<p className='text-slate-500 text-base leading-relaxed mb-8'>
                    {message}
                </p>

				{/* Progress Line */}
				<div className='w-full h-1 bg-slate-100 rounded-full overflow-hidden relative'>
					<div className='absolute inset-0 bg-indigo-600 w-1/3 animate-[shimmer_1.5s_infinite] translate-x-[-100%]'
                         style={{
                             animationName: 'slide',
                             animationTimingFunction: 'linear',
                             backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
                         }}>
                    </div>
				</div>
                <style jsx>{`
                    @keyframes slide {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
			</div>
		</div>
	)
}

export default AILoader
