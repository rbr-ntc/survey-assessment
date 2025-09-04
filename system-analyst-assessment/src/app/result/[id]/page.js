// Генерируем мета-теги для страницы результатов
export async function generateMetadata({ params }) {
	const { id } = params

	return {
		title: `Результаты оценки системного аналитика | ID: ${id}`,
		description:
			'Просмотрите результаты комплексной оценки навыков системного аналитика. Детальный анализ компетенций, уровень развития и персональные AI-рекомендации.',
		keywords:
			'результаты оценки, системный аналитик, компетенции, уровень развития, AI рекомендации',
		openGraph: {
			title: `Результаты оценки системного аналитика | ID: ${id}`,
			description:
				'Просмотрите результаты комплексной оценки навыков системного аналитика. Детальный анализ компетенций, уровень развития и персональные AI-рекомендации.',
			type: 'website',
			url: `https://evaly.ru/result/${id}`,
			images: [
				{
					url: 'https://evaly.ru/og-results.png',
					width: 1200,
					height: 630,
					alt: 'Результаты оценки навыков системного аналитика',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `Результаты оценки системного аналитика | ID: ${id}`,
			description:
				'Просмотрите результаты комплексной оценки навыков системного аналитика. Детальный анализ компетенций, уровень развития и персональные AI-рекомендации.',
			images: ['https://evaly.ru/og-results.png'],
		},
		alternates: {
			canonical: `https://evaly.ru/result/${id}`,
		},
		robots: 'noindex, nofollow', // Страницы результатов не индексируем
	}
}

export default function ResultPage({ params }) {
	return <ResultPageClient params={params} />
}
