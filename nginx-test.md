# 🧪 Тестирование маршрутизации Nginx

## 📍 Примеры запросов и их обработки

### **Frontend запросы (location /)**

```
https://evaly.ru/ → frontend:3000/
https://evaly.ru/questions → frontend:3000/questions
https://evaly.ru/result/123 → frontend:3000/result/123
https://evaly.ru/_next/static/file.js → frontend:3000/_next/static/file.js
```

### **Backend API запросы (location /api/)**

```
https://evaly.ru/api/questions → backend:8000/questions
https://evaly.ru/api/results → backend:8000/results
https://evaly.ru/api/recommendations → backend:8000/recommendations
https://evaly.ru/api/quick-test → backend:8000/quick-test
```

### **Что происходит с URL**

#### **Frontend:**

- Входящий: `https://evaly.ru/questions`
- Nginx передает: `http://frontend:3000/questions`
- **URL остается без изменений**

#### **Backend:**

- Входящий: `https://evaly.ru/api/questions`
- Nginx убирает `/api/` и передает: `http://backend:8000/questions`
- **URL изменяется (убирается /api/)**

## 🔍 **Проверка в браузере**

1. **Frontend:** Откройте `https://evaly.ru/questions`
2. **Backend:** Откройте `https://evaly.ru/api/questions` (должен вернуть JSON)

## 📝 **Логи Nginx**

```bash
# Следить за логами в реальном времени
tail -f /var/log/nginx/access.log

# Пример лога:
# 192.168.1.1 - - [03/Sep/2025:12:00:00 +0300] "GET /questions HTTP/1.1" 200 1234
# 192.168.1.1 - - [03/Sep/2025:12:00:01 +0300] "GET /api/questions HTTP/1.1" 200 5678
```
