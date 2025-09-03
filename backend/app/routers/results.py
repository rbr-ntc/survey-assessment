import json
import os
from datetime import datetime
from typing import Dict, List

from app.db import db
from app.deps import verify_api_key
from app.models import Result, ResultWithId, SubmitRequest
from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from openai import AsyncOpenAI, OpenAIError

router = APIRouter()

CATEGORIES = {
    'documentation': {'weight': 1, 'name': 'Документирование'},
    'modeling': {'weight': 1.2, 'name': 'Моделирование процессов'},
    'api': {'weight': 1.1, 'name': 'API Design'},
    'database': {'weight': 1.1, 'name': 'Базы данных'},
    'messaging': {'weight': 1, 'name': 'Асинхронные взаимодействия'},
    'system_design': {'weight': 1.3, 'name': 'Проектирование систем'},
    'security': {'weight': 1, 'name': 'Безопасность'},
    'analytical': {'weight': 1.2, 'name': 'Аналитическое мышление'},
    'communication': {'weight': 1, 'name': 'Коммуникации'},
}

LEVELS = [
    {"level": "Senior", "description": "Экспертный уровень системного аналитика", "nextLevel": "Lead/Architect", "minYears": "5+", "nextLevelScore": 100, "minScore": 85},
    {"level": "Middle+", "description": "Уверенный Middle с потенциалом роста", "nextLevel": "Senior", "minYears": "3-5", "nextLevelScore": 85, "minScore": 70},
    {"level": "Middle", "description": "Самостоятельный системный аналитик", "nextLevel": "Middle+", "minYears": "2-3", "nextLevelScore": 70, "minScore": 55},
    {"level": "Junior+", "description": "Развивающийся Junior", "nextLevel": "Middle", "minYears": "1-2", "nextLevelScore": 55, "minScore": 40},
    {"level": "Junior", "description": "Начинающий системный аналитик", "nextLevel": "Junior+", "minYears": "0-1", "nextLevelScore": 40, "minScore": 0},
]

def get_level(score):
    for lvl in LEVELS:
        if score >= lvl["minScore"]:
            return lvl
    return LEVELS[-1]

async def generate_and_save_recommendations(result_id, user, level, overallScore, strengths, weaknesses, question_details):
    strong_str = ', '.join(f'{s["name"]} ({s["score"]}%)' for s in strengths) or 'Требуют развития'
    weak_str = ', '.join(f'{w["name"]} ({w["score"]}%)' for w in weaknesses) or 'Нет явных'
    system_prompt = """
Ты — заботливый, мотивирующий и экспертный ментор по развитию системных аналитиков. Пиши живо, с примерами, избегай шаблонов.
"""
    prompt = f"""
Ты — опытный, вдохновляющий и заботливый ментор по развитию системных аналитиков. Твоя задача — не просто дать советы, а реально замотивировать и направить кандидата, учитывая его сильные и слабые стороны.

Кандидат: {user['name']}
Опыт: {user['experience']}
Текущий уровень: {level['level']} ({overallScore}%)
Сильные стороны: {strong_str}
Зоны развития: {weak_str}

Твоя задача:
- Проведи глубокий анализ текущего уровня кандидата, выдели не только слабые, но и уникальные сильные стороны.
- Дай персональные советы по развитию именно тех компетенций, которые сейчас отстают, с примерами реальных ситуаций из практики системных аналитиков.
- Составь подробный, но реалистичный план развития на 3 месяца, разбей его по неделям, добавь мотивационные комментарии и лайфхаки.
- Подбери лучшие ресурсы (книги, курсы, статьи, сообщества, желательно на русском), объясни, почему они важны.
- Придумай метрики для отслеживания прогресса, чтобы кандидат мог реально видеть свой рост.
- В конце добавь короткое мотивирующее напутствие, чтобы кандидат поверил в себя.

Формат ответа: только Markdown, с заголовками, списками, выделениями, примерами.

Пример стиля ответа:

# Персональный план развития для {user['name']}

## Анализ текущего уровня
Ты уже хорошо проявил себя в ... (пример). Особенно выделяется ... (пример сильной стороны). Но для следующего шага важно подтянуть ... (пример слабой стороны).

## Ключевые шаги для роста
- ...
- ...

## План на 3 месяца
### Неделя 1-2
- ...
- ...

## Лучшие ресурсы
- ...

## Метрики успеха
- ...

**Ты справишься! Главное — не останавливаться и верить в себя.**
"""
    try:
        client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = await client.chat.completions.create(
            model="gpt-5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=1.15
        )
        recommendations = response.choices[0].message.content
    except Exception as e:
        recommendations = "Не удалось сгенерировать рекомендации. Попробуйте позже."
    await db.results.update_one({"_id": ObjectId(result_id)}, {"$set": {"recommendations": recommendations}})

@router.post("/results", response_model=ResultWithId, dependencies=[Depends(verify_api_key)])
async def submit_results(submit: SubmitRequest, background_tasks: BackgroundTasks):
    # Получаем вопросы из MongoDB
    questions = await db.questions.find({}, {"_id": 0}).to_list(length=None)
    answers = submit.answers
    user = submit.user.dict() if hasattr(submit.user, 'dict') else dict(submit.user)

    # Подсчёт баллов по категориям и сбор деталей по вопросам
    category_scores = {cat: 0 for cat in CATEGORIES}
    category_max_scores = {cat: 0 for cat in CATEGORIES}
    question_details = []

    for q in questions:
        qid = q['id']
        cat = q['category']
        max_score = max(q.get('weights', {}).values()) if 'weights' in q else 5
        category_max_scores[cat] += max_score
        answer = answers.get(qid)
        
        if answer:
            score = q.get('weights', {}).get(answer, 0) if 'weights' in q else 0
            category_scores[cat] += score
            
            # Собираем детали по каждому вопросу
            user_answer_text = next((opt['text'] for opt in q['options'] if opt['value'] == answer), "")
            correct_answer_value = max(q.get('weights', {}).items(), key=lambda x: x[1])[0] if q.get('weights') else ""
            correct_answer_text = next((opt['text'] for opt in q['options'] if opt['value'] == correct_answer_value), "")
            
            question_detail = {
                "question_id": qid,
                "question_text": q['question'],
                "user_answer_value": answer,
                "user_answer_text": user_answer_text,
                "correct_answer_value": correct_answer_value,
                "correct_answer_text": correct_answer_text,
                "user_score": score,
                "max_score": max_score,
                "explanation": f"Пользователь выбрал '{user_answer_text}' (балл: {score}/{max_score})",
                "difficulty": "medium",  # Можно добавить логику определения сложности
                "learning_tip": f"Для улучшения в категории '{CATEGORIES[cat]['name']}' изучите: {q['question']}"
            }
            question_details.append(question_detail)

    # Проценты по категориям + веса
    categories = {}
    for cat in CATEGORIES:
        percent = round((category_scores[cat] / category_max_scores[cat]) * 100) if category_max_scores[cat] > 0 else 0
        categories[cat] = {
            "score": percent,
            "weight": CATEGORIES[cat]["weight"],
            "name": CATEGORIES[cat]["name"]
        }

    # Взвешенный общий балл
    weighted_sum = sum(categories[cat]["score"] * CATEGORIES[cat]['weight'] for cat in CATEGORIES)
    total_weight = sum(CATEGORIES[cat]['weight'] for cat in CATEGORIES)
    overallScore = round(weighted_sum / total_weight)

    level = get_level(overallScore)
    level = dict(level)  # копия, чтобы не менять глобальный LEVELS
    level["nextLevelScore"] = str(level["nextLevelScore"])
    level["minScore"] = str(level["minScore"])

    # Сильные стороны (score >= 70)
    strengths = [
        {"name": categories[cat]["name"], "score": categories[cat]["score"]}
        for cat in categories if categories[cat]["score"] >= 70
    ]
    # Зоны развития (score < 60)
    weaknesses = [
        {"name": categories[cat]["name"], "score": categories[cat]["score"]}
        for cat in categories if categories[cat]["score"] < 60
    ]

    result_doc = {
        "user": user,
        "answers": answers,
        "categories": categories,
        "overallScore": overallScore,
        "level": level,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": None,
        "question_details": question_details,
        "created_at": datetime.utcnow()
    }
    insert_result = await db.results.insert_one(result_doc)
    result_id = str(insert_result.inserted_id)

    # Запускаем генерацию рекомендаций в фоне
    background_tasks.add_task(
        generate_and_save_recommendations,
        result_id,
        user,
        level,
        overallScore,
        strengths,
        weaknesses,
        question_details
    )

    return {
        "result_id": result_id,
        "overallScore": overallScore,
        "level": level,
        "categories": categories,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": None,
        "question_details": question_details
    }

@router.get("/results/{result_id}", dependencies=[Depends(verify_api_key)])
async def get_result_by_id(result_id: str):
    try:
        obj_id = ObjectId(result_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid result id")
    result = await db.results.find_one({"_id": obj_id})
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    user = result.get("user", {})
    safe_user = {"name": user.get("name", ""), "experience": user.get("experience", "")}
    return {
        "user": safe_user,
        "overallScore": result.get("overallScore"),
        "level": result.get("level"),
        "categories": result.get("categories"),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "recommendations": result.get("recommendations", None),
        "question_details": result.get("question_details", []),
        "created_at": result.get("created_at")
    }

@router.post("/quick-test")
async def quick_test(
    test_type: str,
    background_tasks: BackgroundTasks
):
    """
    Быстрый тест с предзаполненными ответами
    test_type: "expert", "intermediate", "beginner", "random"
    """
    
    # Получаем все вопросы
    questions = await db.questions.find({}, {"_id": 0}).to_list(length=None)
    
    if not questions:
        raise HTTPException(status_code=404, detail="Questions not found")
    
    # Генерируем ответы в зависимости от типа теста
    answers = generate_quick_test_answers(questions, test_type)
    
    # Создаем результат теста
    test_result = {
        "user": {"name": f"Quick Test - {test_type.title()}", "experience": "N/A"},
        "answers": answers,
        "created_at": datetime.utcnow()
    }
    
    # Сохраняем в базу
    insert_result = await db.results.insert_one(test_result)
    result_id = str(insert_result.inserted_id)
    
    # Запускаем генерацию рекомендаций в фоне
    background_tasks.add_task(
        generate_and_save_recommendations,
        result_id,
        test_result["user"],
        {"level": "Quick Test", "description": "Quick test result"},
        0,  # overallScore будет вычислен
        [],  # strengths будет вычислен
        [],  # weaknesses будет вычислен
        []   # question_details будет вычислен
    )
    
    return {
        "test_id": result_id,
        "message": f"Quick test completed with {test_type} level answers",
        "answers_count": len(answers)
    }

def generate_quick_test_answers(questions: List[Dict], test_type: str) -> Dict[str, str]:
    """Генерирует предзаполненные ответы для быстрого тестирования"""
    import random
    
    answers = {}
    
    for question in questions:
        if test_type == "expert":
            # Эксперт: в основном правильные ответы (a, b, c)
            if random.random() < 0.8:
                answer = random.choice(["a", "b", "c"])
            else:
                answer = random.choice(["d", "e", "f", "g", "h", "i"])
        elif test_type == "intermediate":
            # Средний уровень: смешанные ответы
            if random.random() < 0.6:
                answer = random.choice(["a", "b", "c"])
            else:
                answer = random.choice(["d", "e", "f", "g", "h", "i"])
        elif test_type == "beginner":
            # Начинающий: в основном неправильные ответы
            if random.random() < 0.3:
                answer = random.choice(["a", "b", "c"])
            else:
                answer = random.choice(["d", "e", "f", "g", "h", "i"])
        elif test_type == "random":
            # Случайные ответы
            answer = random.choice(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
        else:
            # По умолчанию - случайные
            answer = random.choice(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
        
        answers[question["id"]] = answer
    
    return answers

@router.get("/quick-test/{test_id}")
async def get_quick_test_result(test_id: str):
    """Получить результат быстрого теста"""
    try:
        obj_id = ObjectId(test_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid test id")
    
    result = await db.results.find_one({"_id": obj_id})
    
    if not result:
        raise HTTPException(status_code=404, detail="Test result not found")
    
    # Получаем полный результат через существующий endpoint
    return await get_result_by_id(test_id)
