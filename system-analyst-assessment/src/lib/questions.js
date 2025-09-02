const questions = [
	// Документирование
	{
		id: 'doc1',
		category: 'documentation',
		type: 'case',
		question: 'Команда просит документировать новый REST API. С чего начнете?',
		options: [
			{ value: 'a', text: 'Сразу начну писать примеры запросов', score: 2 },
			{
				value: 'b',
				text: 'Сначала выясню цели API, пользователей и сценарии использования',
				score: 5,
			},
			{ value: 'c', text: 'Скопирую шаблон от другого API', score: 1 },
			{
				value: 'd',
				text: 'Попрошу разработчиков написать документацию',
				score: 1,
			},
		],
	},
	{
		id: 'doc2',
		category: 'documentation',
		type: 'practical',
		question: 'В документации API нужно описать ошибку 429. Что напишете?',
		options: [
			{ value: 'a', text: 'Ошибка 429 - ошибка сервера', score: 1 },
			{
				value: 'b',
				text: 'Too Many Requests - превышен лимит запросов. Повторите позже',
				score: 3,
			},
			{
				value: 'c',
				text: 'Too Many Requests - превышен лимит. Headers: Retry-After, X-RateLimit-*. Стратегия: exponential backoff',
				score: 5,
			},
			{ value: 'd', text: 'Ошибка лимитов', score: 1 },
		],
	},
	{
		id: 'doc3',
		category: 'documentation',
		type: 'case',
		question: 'Документация устарела на год. Как поступите?',
		options: [
			{ value: 'a', text: 'Обновлю когда будет время', score: 1 },
			{
				value: 'b',
				text: 'Проведу аудит, выделю критичные разделы, настрою автообновление где возможно',
				score: 5,
			},
			{ value: 'c', text: 'Перепишу все с нуля', score: 2 },
			{ value: 'd', text: 'Удалю старую, чтобы не путала', score: 1 },
		],
	},
	// Моделирование процессов
	{
		id: 'model1',
		category: 'modeling',
		type: 'case',
		question:
			'Необходимо спроектировать систему обработки заказов. Какую диаграмму создадите первой?',
		options: [
			{ value: 'a', text: 'Детальную диаграмму классов', score: 2 },
			{
				value: 'b',
				text: 'Контекстную диаграмму (C4 Context) для понимания границ системы',
				score: 5,
			},
			{ value: 'c', text: 'Диаграмму развертывания', score: 1 },
			{
				value: 'd',
				text: 'BPMN диаграмму основного процесса заказа',
				score: 4,
			},
		],
	},
	{
		id: 'model2',
		category: 'modeling',
		type: 'practical',
		question:
			'В BPMN диаграмме нужно показать, что менеджер может одобрить или отклонить заказ. Какой элемент используете?',
		options: [
			{ value: 'a', text: 'Параллельный шлюз (Parallel Gateway)', score: 1 },
			{ value: 'b', text: 'Эксклюзивный шлюз (Exclusive Gateway)', score: 5 },
			{ value: 'c', text: 'Событие (Event)', score: 1 },
			{ value: 'd', text: 'Подпроцесс (Subprocess)', score: 2 },
		],
	},
	{
		id: 'model3',
		category: 'modeling',
		type: 'case',
		question: 'Stakeholder не понимает техническую диаграмму. Что сделаете?',
		options: [
			{ value: 'a', text: 'Объясню что означает каждый элемент', score: 2 },
			{
				value: 'b',
				text: 'Создам упрощенную версию с бизнес-терминами и примерами',
				score: 5,
			},
			{ value: 'c', text: 'Скажу что это стандартная нотация', score: 1 },
			{ value: 'd', text: 'Дам ссылку на документацию по нотации', score: 1 },
		],
	},
	// API Design
	{
		id: 'api1',
		category: 'api',
		type: 'practical',
		question:
			'Нужно спроектировать API для работы с большими списками (миллионы записей). Какой подход выберете?',
		options: [
			{ value: 'a', text: 'Вернуть все данные одним запросом', score: 1 },
			{
				value: 'b',
				text: 'Cursor-based pagination с лимитами и метаданными',
				score: 5,
			},
			{ value: 'c', text: 'Offset/limit пагинация', score: 3 },
			{ value: 'd', text: 'Загрузка данных частями через WebSocket', score: 2 },
		],
	},
	{
		id: 'api2',
		category: 'api',
		type: 'case',
		question: 'Клиент жалуется на медленный API. Первое действие?',
		options: [
			{ value: 'a', text: 'Добавлю кеширование', score: 2 },
			{
				value: 'b',
				text: 'Проанализирую метрики: latency по endpoints, N+1 запросы, payload size',
				score: 5,
			},
			{ value: 'c', text: 'Увеличу таймауты', score: 1 },
			{ value: 'd', text: 'Скажу использовать пагинацию', score: 2 },
		],
	},
	{
		id: 'api3',
		category: 'api',
		type: 'practical',
		question: 'Как версионировать REST API?',
		options: [
			{ value: 'a', text: 'Менять endpoints без версий', score: 1 },
			{
				value: 'b',
				text: '/api/v1/users с deprecated headers и migration guide',
				score: 5,
			},
			{ value: 'c', text: 'Версия в query параметре ?version=1', score: 3 },
			{ value: 'd', text: 'Новый поддомен для каждой версии', score: 2 },
		],
	},
	// Базы данных
	{
		id: 'db1',
		category: 'database',
		type: 'case',
		question:
			'В системе есть таблица с 100М записей логов. Запросы тормозят. Решение?',
		options: [
			{ value: 'a', text: 'Добавить больше индексов на все колонки', score: 2 },
			{
				value: 'b',
				text: 'Партиционирование по времени + архивация старых данных + правильные индексы',
				score: 5,
			},
			{ value: 'c', text: 'Перейти на NoSQL', score: 2 },
			{ value: 'd', text: 'Увеличить ресурсы сервера', score: 1 },
		],
	},
	{
		id: 'db2',
		category: 'database',
		type: 'practical',
		question:
			'EXPLAIN показывает full table scan при запросе WHERE status = "active" AND created_at > "2024-01-01". Какой индекс создать?',
		options: [
			{ value: 'a', text: 'INDEX ON status', score: 2 },
			{ value: 'b', text: 'INDEX ON created_at', score: 2 },
			{ value: 'c', text: 'COMPOSITE INDEX ON (status, created_at)', score: 5 },
			{ value: 'd', text: 'INDEX ON id', score: 1 },
		],
	},
	{
		id: 'db3',
		category: 'database',
		type: 'case',
		question:
			'Нужно хранить иерархию категорий товаров (дерево). Какую модель выберете в PostgreSQL?',
		options: [
			{ value: 'a', text: 'Adjacency List (parent_id)', score: 3 },
			{
				value: 'b',
				text: 'Materialized Path + ltree extension для эффективных запросов',
				score: 5,
			},
			{ value: 'c', text: 'Отдельная таблица для каждого уровня', score: 1 },
			{ value: 'd', text: 'JSON поле со всей иерархией', score: 2 },
		],
	},
	// Messaging/Async
	{
		id: 'msg1',
		category: 'messaging',
		type: 'case',
		question:
			'Проектируете систему нотификаций для отправки 1М push-уведомлений. Архитектура?',
		options: [
			{
				value: 'a',
				text: 'Синхронная отправка из основного сервиса',
				score: 1,
			},
			{
				value: 'b',
				text: 'Message Queue (Kafka/RabbitMQ) + воркеры + батчинг + retry + DLQ',
				score: 5,
			},
			{ value: 'c', text: 'Cron job раз в час', score: 2 },
			{ value: 'd', text: 'Отдельный микросервис с REST API', score: 3 },
		],
	},
	{
		id: 'msg2',
		category: 'messaging',
		type: 'practical',
		question:
			'В Kafka нужно обработать события ровно один раз (exactly-once). Как обеспечить?',
		options: [
			{ value: 'a', text: 'Включить auto-commit', score: 1 },
			{
				value: 'b',
				text: 'Idempotent producer + transactional consumer + deduplication by key',
				score: 5,
			},
			{ value: 'c', text: 'Увеличить replication factor', score: 2 },
			{ value: 'd', text: 'Использовать один partition', score: 1 },
		],
	},
	{
		id: 'msg3',
		category: 'messaging',
		type: 'case',
		question:
			'Сообщения в очереди накапливаются быстрее, чем обрабатываются. Решение?',
		options: [
			{ value: 'a', text: 'Удалить старые сообщения', score: 1 },
			{
				value: 'b',
				text: 'Анализ bottleneck → горизонтальное масштабирование consumers → батчинг → приоритизация',
				score: 5,
			},
			{ value: 'c', text: 'Увеличить размер очереди', score: 2 },
			{ value: 'd', text: 'Перезапустить consumers', score: 1 },
		],
	},
	// System Design
	{
		id: 'sys1',
		category: 'system_design',
		type: 'case',
		question: 'Проектируете систему для стриминга видео. Ключевые компоненты?',
		options: [
			{ value: 'a', text: 'Веб-сервер + база данных', score: 1 },
			{
				value: 'b',
				text: 'CDN + Adaptive bitrate + Transcoding + Storage (S3) + Edge servers',
				score: 5,
			},
			{ value: 'c', text: 'Мощный сервер с большим диском', score: 1 },
			{ value: 'd', text: 'Load balancer + несколько серверов', score: 2 },
		],
	},
	{
		id: 'sys2',
		category: 'system_design',
		type: 'practical',
		question: 'Как обеспечить отказоустойчивость системы?',
		options: [
			{ value: 'a', text: 'Бэкапы раз в день', score: 1 },
			{
				value: 'b',
				text: 'Multi-region deployment + Circuit breakers + Health checks + Graceful degradation',
				score: 5,
			},
			{ value: 'c', text: 'Два сервера вместо одного', score: 2 },
			{ value: 'd', text: 'Увеличить таймауты', score: 1 },
		],
	},
	{
		id: 'sys3',
		category: 'system_design',
		type: 'case',
		question: 'Black Friday. Система не выдерживает нагрузку. Быстрые меры?',
		options: [
			{ value: 'a', text: 'Отключить систему на maintenance', score: 1 },
			{
				value: 'b',
				text: 'Rate limiting + отключение некритичных features + автоскейлинг + кеширование',
				score: 5,
			},
			{ value: 'c', text: 'Купить больше серверов', score: 2 },
			{ value: 'd', text: 'Оптимизировать код', score: 2 },
		],
	},
	// Security
	{
		id: 'sec1',
		category: 'security',
		type: 'practical',
		question: 'Как безопасно хранить API ключи сторонних сервисов?',
		options: [
			{ value: 'a', text: 'В коде в отдельном файле config.js', score: 1 },
			{
				value: 'b',
				text: 'Environment variables + Secret Management (Vault/AWS Secrets Manager) + rotation',
				score: 5,
			},
			{ value: 'c', text: 'В базе данных в зашифрованном виде', score: 3 },
			{ value: 'd', text: 'В .env файле в репозитории', score: 1 },
		],
	},
	{
		id: 'sec2',
		category: 'security',
		type: 'case',
		question: 'Обнаружена SQL инъекция в продакшене. Ваши действия?',
		options: [
			{ value: 'a', text: 'Исправить конкретный запрос', score: 2 },
			{
				value: 'b',
				text: 'Hotfix + аудит всех queries + parameterized queries + WAF rules + security review',
				score: 5,
			},
			{ value: 'c', text: 'Откатить последний релиз', score: 2 },
			{ value: 'd', text: 'Добавить валидацию на фронтенде', score: 1 },
		],
	},
	// Аналитическое мышление
	{
		id: 'analytical1',
		category: 'analytical',
		type: 'case',
		question: 'Конверсия упала с 5% до 2% после релиза. Как найти причину?',
		options: [
			{ value: 'a', text: 'Спросить у команды, что поменяли', score: 2 },
			{
				value: 'b',
				text: 'Funnel analysis + A/B test rollback + сегментация по устройствам/гео + user recordings',
				score: 5,
			},
			{ value: 'c', text: 'Откатить релиз', score: 3 },
			{ value: 'd', text: 'Подождать - может само восстановится', score: 1 },
		],
	},
	{
		id: 'analytical2',
		category: 'analytical',
		type: 'practical',
		question: 'Нужно оценить влияние новой фичи. Какие метрики отслеживать?',
		options: [
			{ value: 'a', text: 'Количество кликов на фичу', score: 2 },
			{
				value: 'b',
				text: 'Adoption rate + retention + влияние на key metrics + qualitative feedback',
				score: 5,
			},
			{ value: 'c', text: 'Количество багов', score: 1 },
			{ value: 'd', text: 'Нравится ли команде', score: 1 },
		],
	},
	// Коммуникации
	{
		id: 'comm1',
		category: 'communication',
		type: 'case',
		question:
			'Стейкхолдер требует фичу "прямо сейчас", но есть критический техдолг. Как поступите?',
		options: [
			{ value: 'a', text: 'Сделаю как просят, потом разберемся', score: 1 },
			{
				value: 'b',
				text: 'Risk assessment + impact analysis + варианты с trade-offs + визуализация последствий',
				score: 5,
			},
			{ value: 'c', text: 'Откажусь делать', score: 2 },
			{ value: 'd', text: 'Сделаю быстрый хак', score: 1 },
		],
	},
	{
		id: 'comm2',
		category: 'communication',
		type: 'practical',
		question: 'Как провести эффективную встречу по сбору требований?',
		options: [
			{ value: 'a', text: 'Записывать все что говорят', score: 2 },
			{
				value: 'b',
				text: 'Agenda + контекст заранее + фасилитация + уточняющие вопросы + summary + action items',
				score: 5,
			},
			{ value: 'c', text: 'Показать готовое решение', score: 1 },
			{ value: 'd', text: 'Дать высказаться всем по очереди', score: 3 },
		],
	},
]

export default questions
