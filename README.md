## Backend (FastAPI + MongoDB)

Бэкенд будет располагаться в папке `backend` на одном уровне с папкой `system-analyst-assessment`.

- Python 3.10+
- FastAPI
- MongoDB (локально или в облаке)

### Стартовая структура:

```
backend/
  app/
    main.py
    models.py
    db.py
    routers/
      questions.py
      results.py
      recommendations.py
  requirements.txt
  README.md
```

### Запуск (после создания):

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---
# Full redeploy triggered at Wed Sep  3 15:47:18 MSK 2025
