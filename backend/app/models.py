from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class Option(BaseModel):
    value: str
    text: str

class Question(BaseModel):
    id: str
    category: str
    type: str
    question: str
    options: List[Option]

class UserInfo(BaseModel):
    name: str
    email: str
    experience: str

class SubmitRequest(BaseModel):
    user: UserInfo
    answers: Dict[str, str]  # {question_id: selected_value}

class QuestionDetail(BaseModel):
    question_id: str
    question_text: str
    user_answer_value: str
    user_answer_text: str
    correct_answer_value: str
    correct_answer_text: str
    user_score: int
    max_score: int
    explanation: str
    difficulty: str
    learning_tip: str

class Result(BaseModel):
    overallScore: int
    level: dict
    categories: dict
    strengths: list
    weaknesses: list
    recommendations: Optional[str] = None
    question_details: Optional[List[QuestionDetail]] = None

class RecommendationRequest(BaseModel):
    user: UserInfo
    overallScore: int
    level: dict
    strengths: list
    weaknesses: list

class RecommendationResponse(BaseModel):
    recommendations: str

class ResultWithId(Result):
    result_id: str
