# 🎨 Glassmorphism Design System

## Концепция

Современный дизайн в стиле Apple Glass с эффектом матового стекла, прозрачности и глубины.

---

## 🎨 Цветовая палитра

### Основные цвета:

```css
/* Фон */
--bg-primary: #0a0e27; /* Темный фон */
--bg-secondary: #1a1f3a; /* Вторичный фон */
--bg-glass: rgba(255, 255, 255, 0.1); /* Стеклянный фон */

/* Акценты */
--accent-primary: #667eea; /* Индиго */
--accent-secondary: #764ba2; /* Фиолетовый */
--accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Текст */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-muted: rgba(255, 255, 255, 0.5);

/* Границы */
--border-glass: rgba(255, 255, 255, 0.2);
--border-glow: rgba(255, 255, 255, 0.3);
```

---

## 🧩 Компоненты

### Glass Card

```css
.glass-card {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1);
	padding: 24px;
	transition: all 0.3s ease;
}

.glass-card:hover {
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.3);
	box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15);
	transform: translateY(-2px);
}
```

### Glass Button

```css
.glass-button {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 12px;
	padding: 12px 24px;
	color: var(--text-primary);
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.glass-button::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.2),
		transparent
	);
	transition: left 0.5s;
}

.glass-button:hover::before {
	left: 100%;
}

.glass-button:hover {
	background: rgba(255, 255, 255, 0.25);
	border-color: rgba(255, 255, 255, 0.4);
	box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
	transform: translateY(-1px);
}

.glass-button:active {
	transform: translateY(0);
}
```

### Glass Input

```css
.glass-input {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 12px;
	padding: 12px 16px;
	color: var(--text-primary);
	font-size: 16px;
	transition: all 0.3s ease;
	width: 100%;
}

.glass-input::placeholder {
	color: rgba(255, 255, 255, 0.5);
}

.glass-input:focus {
	outline: none;
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.4);
	box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2), 0 0 20px rgba(102, 126, 234, 0.1);
}
```

### Glass Modal

```css
.glass-modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.glass-modal {
	background: rgba(26, 31, 58, 0.9);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 24px;
	padding: 32px;
	max-width: 500px;
	width: 90%;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
	animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
```

### Glass Navigation

```css
.glass-nav {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding: 16px 24px;
	position: sticky;
	top: 0;
	z-index: 100;
}

.glass-nav-link {
	color: var(--text-secondary);
	padding: 8px 16px;
	border-radius: 8px;
	transition: all 0.3s ease;
	position: relative;
}

.glass-nav-link:hover {
	color: var(--text-primary);
	background: rgba(255, 255, 255, 0.1);
}

.glass-nav-link.active {
	color: var(--text-primary);
	background: rgba(102, 126, 234, 0.2);
	border: 1px solid rgba(102, 126, 234, 0.3);
}
```

---

## 🌈 Градиенты и эффекты

### Gradient Background

```css
.gradient-bg {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
}

.gradient-bg::before {
	content: '';
	position: absolute;
	inset: 0;
	background: radial-gradient(
			circle at 20% 50%,
			rgba(102, 126, 234, 0.3) 0%,
			transparent 50%
		), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3) 0%, transparent
				50%);
	pointer-events: none;
}
```

### Glow Effect

```css
.glow-effect {
	position: relative;
}

.glow-effect::after {
	content: '';
	position: absolute;
	inset: -2px;
	background: linear-gradient(135deg, #667eea, #764ba2);
	border-radius: inherit;
	opacity: 0;
	filter: blur(10px);
	transition: opacity 0.3s ease;
	z-index: -1;
}

.glow-effect:hover::after {
	opacity: 0.5;
}
```

---

## 📱 Адаптивность

### Mobile

```css
@media (max-width: 768px) {
	.glass-card {
		padding: 16px;
		border-radius: 16px;
	}

	.glass-button {
		padding: 10px 20px;
		font-size: 14px;
	}
}
```

### Tablet

```css
@media (min-width: 769px) and (max-width: 1024px) {
	.glass-card {
		padding: 20px;
	}
}
```

---

## 🎭 Анимации

### Fade In

```css
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.fade-in {
	animation: fadeIn 0.5s ease;
}
```

### Scale In

```css
@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.scale-in {
	animation: scaleIn 0.3s ease;
}
```

### Shimmer (для loading)

```css
@keyframes shimmer {
	0% {
		background-position: -1000px 0;
	}
	100% {
		background-position: 1000px 0;
	}
}

.shimmer {
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.1) 0%,
		rgba(255, 255, 255, 0.2) 50%,
		rgba(255, 255, 255, 0.1) 100%
	);
	background-size: 1000px 100%;
	animation: shimmer 2s infinite;
}
```

---

## 💡 Best Practices

1. **Используйте backdrop-filter осторожно** - может быть тяжелым для производительности
2. **Градиенты должны быть тонкими** - не перегружайте дизайн
3. **Контраст текста** - убедитесь, что текст читаем на стеклянном фоне
4. **Fallback для старых браузеров** - добавьте solid background как fallback
5. **Производительность** - используйте `will-change` для анимируемых элементов

---

## 🚀 Примеры использования

### Dashboard Card

```jsx
<div className='glass-card'>
	<h3 className='text-white text-xl font-semibold mb-2'>Прогресс обучения</h3>
	<div className='text-white/70'>Вы прошли 5 из 10 тестов</div>
</div>
```

### Login Form

```jsx
<div className='glass-modal'>
	<h2 className='text-white text-2xl mb-6'>Вход</h2>
	<input type='email' className='glass-input mb-4' placeholder='Email' />
	<input type='password' className='glass-input mb-6' placeholder='Пароль' />
	<button className='glass-button w-full'>Войти</button>
</div>
```

---

**Готово к внедрению! 🎨**
