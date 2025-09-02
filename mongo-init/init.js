// Скрипт инициализации MongoDB для survey-assessment
// Автоматически выполняется при первом запуске контейнера

print('Starting MongoDB initialization...')

// Переключаемся на базу данных assessment
db = db.getSiblingDB('assessment')

try {
	// Удаляем существующую коллекцию questions если она есть
	if (db.questions.exists()) {
		print('Dropping existing questions collection...')
		db.questions.drop()
	}

	// Проверяем наличие файла с вопросами
	const questionsFile =
		'/docker-entrypoint-initdb.d/improved-test-questions.json'

	if (fs.exists(questionsFile)) {
		print('Loading questions from file...')

		// Читаем и парсим JSON файл
		const questionsData = fs.readFileSync(questionsFile, 'utf8')
		const questions = JSON.parse(questionsData)

		// Вставляем вопросы в коллекцию
		const result = db.questions.insertMany(questions)

		print('Successfully inserted ' + result.insertedIds.length + ' questions')

		// Создаем индексы для оптимизации
		print('Creating indexes...')
		db.questions.createIndex({ id: 1 }, { unique: true })
		db.questions.createIndex({ category: 1 })
		db.questions.createIndex({ difficulty: 1 })

		print('Indexes created successfully')

		// Проверяем количество загруженных вопросов
		const count = db.questions.countDocuments()
		print('Total questions in database: ' + count)
	} else {
		print('WARNING: Questions file not found at ' + questionsFile)
		print(
			'Please ensure improved-test-questions.json is copied to mongo-init directory'
		)
	}
} catch (error) {
	print('ERROR during initialization: ' + error.message)
	print('Stack trace: ' + error.stack)
}

print('MongoDB initialization completed.')
