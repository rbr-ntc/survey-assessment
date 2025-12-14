import { Geist, Geist_Mono } from 'next/font/google'
import { AssessmentProvider } from '../components/AssessmentContext'
import { AuthProvider } from '../contexts/AuthContext'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata = {
	title:
		'Оценка навыков системного аналитика | Комплексное тестирование и AI-рекомендации',
	description:
		'Пройдите комплексную оценку навыков системного аналитика. 142 вопроса, определение уровня Junior/Middle/Senior, детальный анализ компетенций и персональные AI-рекомендации для развития.',
	keywords:
		'системный аналитик, оценка навыков, тестирование, компетенции, junior middle senior, AI рекомендации, развитие карьеры, системный анализ',
	authors: [{ name: 'Survey Assessment Team' }],
	creator: 'Survey Assessment Team',
	publisher: 'Survey Assessment',
	robots:
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		url: 'https://evaly.ru',
		siteName: 'Оценка навыков системного аналитика',
		title:
			'Оценка навыков системного аналитика | Комплексное тестирование и AI-рекомендации',
		description:
			'Пройдите комплексную оценку навыков системного аналитика. 142 вопроса, определение уровня Junior/Middle/Senior, детальный анализ компетенций и персональные AI-рекомендации для развития.',
		images: [
			{
				url: 'https://evaly.ru/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Оценка навыков системного аналитика - Комплексное тестирование и AI-рекомендации',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@survey_assessment',
		creator: '@survey_assessment',
		title:
			'Оценка навыков системного аналитика | Комплексное тестирование и AI-рекомендации',
		description:
			'Пройдите комплексную оценку навыков системного аналитика. 142 вопроса, определение уровня Junior/Middle/Senior, детальный анализ компетенций и персональные AI-рекомендации для развития.',
		images: ['https://evaly.ru/og-image.png'],
	},
	alternates: {
		canonical: 'https://evaly.ru',
	},
	verification: {
		google: 'yZRBAnn_3C8ipP1yom8Fplj6tWSqSISXOHRAINH2YBg',
		yandex: '697f7b063b705153',
	},
	other: {
		'msapplication-TileColor': '#3b82f6',
		'theme-color': '#3b82f6',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'default',
		'apple-mobile-web-app-title': 'Оценка системного аналитика',
		'application-name': 'Оценка системного аналитика',
		'format-detection': 'telephone=no',
	},
}

export default function RootLayout({ children }) {
	return (
		<html lang='ru'>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<link rel='icon' href='/favicon.ico' />
				<link rel='apple-touch-icon' href='/icon-192x192.png' />
				<meta name='theme-color' content='#3b82f6' />
				<meta name='msapplication-TileColor' content='#3b82f6' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-status-bar-style' content='default' />
				<meta
					name='apple-mobile-web-app-title'
					content='Оценка системного аналитика'
				/>
				<meta name='application-name' content='Оценка системного аналитика' />
				<meta name='format-detection' content='telephone=no' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen`}
			>
				<AuthProvider>
					<AssessmentProvider>{children}</AssessmentProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
