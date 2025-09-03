import os

from app.deps import verify_api_key
from app.models import RecommendationRequest
from fastapi import APIRouter, Depends, HTTPException, Response
from openai import AsyncOpenAI, OpenAIError

router = APIRouter()

@router.post("/recommendations", response_class=Response, dependencies=[Depends(verify_api_key)])
async def get_recommendations(req: RecommendationRequest):
    user = req.user
    level = req.level
    strengths = req.strengths
    weaknesses = req.weaknesses
    overallScore = req.overallScore

    strong_str = ', '.join(f'{s["name"]} ({s["score"]}%)' for s in strengths) or 'Требуют развития'
    weak_str = ', '.join(f'{w["name"]} ({w["score"]}%)' for w in weaknesses) or 'Нет явных'

    system_prompt = """
Ты — заботливый, мотивирующий и экспертный ментор по развитию системных аналитиков. Пиши живо, с примерами, избегай шаблонов.
"""

    prompt = f"""
Ты — опытный, вдохновляющий и заботливый ментор по развитию системных аналитиков. Твоя задача — не просто дать советы, а реально замотивировать и направить кандидата, учитывая его сильные и слабые стороны.

Кандидат: {user.name}
Опыт: {user.experience}
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

# Персональный план развития для {user.name}

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
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=1.15
        )
        content = response.choices[0].message.content
    except OpenAIError as e:
        print(f"OpenAI error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
    except Exception as e:
        print(f"General error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    return Response(content, media_type="text/markdown")
