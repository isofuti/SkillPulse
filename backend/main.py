from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import time
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
import numpy as np
from datetime import datetime, timedelta
import calendar
from fastapi.responses import StreamingResponse
import json
import asyncio
import httpx
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загрузка необходимых данных NLTK
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading NLTK data...")
    nltk.download('stopwords')
    print("NLTK data downloaded successfully")

# Инициализация стоп-слов
try:
    russian_stopwords = set(stopwords.words('russian'))
except LookupError:
    print("Error loading Russian stopwords. Using empty set.")
    russian_stopwords = set()

load_dotenv()

app = FastAPI(title="HR SkillPulse API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VacancyInfo(BaseModel):
    id: int
    name: str
    salary_from: Optional[float] = None
    salary_to: Optional[float] = None
    salary_currency: Optional[str] = None
    area: Dict[str, Any]
    has_salary: bool = False

class VacancyRequest(BaseModel):
    query: str
    areas: List[int]  # Список ID регионов
    per_page: Optional[int] = 100
    page: Optional[int] = 1

class VacancyStats(BaseModel):
    total_vacancies: int
    unique_vacancies: int
    vacancies_with_salary: int
    vacancies_without_salary: int
    average_salary: Optional[float] = None
    median_salary: Optional[float] = None
    salary_distribution: Dict[str, int]
    word_cloud: Dict[str, int]
    area_stats: Dict[str, Dict[str, Any]]

def clean_text(text: str) -> str:
    """Очистка текста от специальных символов и цифр"""
    if not text:
        return ""
    # Удаляем специальные символы, оставляем буквы, цифры и некоторые специальные символы
    text = re.sub(r'[^a-zA-Zа-яА-ЯёЁ0-9\s\+\#\.]', ' ', text)
    # Приводим к нижнему регистру
    text = text.lower()
    # Удаляем лишние пробелы
    text = ' '.join(text.split())
    return text

def get_word_frequency(text: str) -> Dict[str, int]:
    """Получение частоты слов с учетом технических терминов"""
    if not text:
        return {}
        
    # Список технических терминов и навыков, которые нужно сохранить
    tech_terms = {
        'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
        'node.js', 'django', 'flask', 'fastapi', 'spring', 'hibernate',
        'sql', 'postgresql', 'mysql', 'mongodb', 'redis',
        'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'git', 'ci/cd', 'jenkins', 'gitlab', 'github',
        'rest', 'graphql', 'api', 'microservices',
        'html', 'css', 'sass', 'less', 'bootstrap',
        'linux', 'unix', 'windows', 'macos',
        'agile', 'scrum', 'kanban',
        'jira', 'confluence', 'bitbucket',
        'tensorflow', 'pytorch', 'keras',
        'machine learning', 'ai', 'ml', 'data science',
        'devops', 'sre', 'qa', 'testing',
        'frontend', 'backend', 'fullstack',
        'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust',
        'swift', 'kotlin', 'android', 'ios',
        'security', 'cybersecurity',
        'blockchain', 'web3', 'solidity'
    }
    
    # Добавляем технические термины в нижнем регистре
    tech_terms = {term.lower() for term in tech_terms}
    
    words = clean_text(text).split()
    
    # Фильтруем слова
    filtered_words = []
    for word in words:
        # Сохраняем технические термины
        if word in tech_terms:
            filtered_words.append(word)
        # Сохраняем слова длиной более 2 символов, не являющиеся стоп-словами
        elif len(word) > 2 and word not in russian_stopwords:
            filtered_words.append(word)
    
    # Создаем словарь частот
    word_freq = Counter(filtered_words)
    
    # Сортируем по частоте и берем топ-50
    return dict(word_freq.most_common(50))

def get_salary_distribution(salaries: List[float]) -> Dict[str, int]:
    """Создание гистограммы зарплат"""
    if not salaries:
        return {}
    
    # Создаем бины для гистограммы
    min_salary = min(salaries)
    max_salary = max(salaries)
    bin_size = (max_salary - min_salary) / 10
    bins = [min_salary + i * bin_size for i in range(11)]
    
    # Создаем гистограмму
    hist, _ = np.histogram(salaries, bins=bins)
    
    # Форматируем метки бинов
    labels = [f"{int(bins[i])}-{int(bins[i+1])}" for i in range(len(bins)-1)]
    
    # Создаем словарь распределения
    distribution = {label: int(count) for label, count in zip(labels, hist)}
    return distribution

def get_date_range(days: int) -> tuple:
    """Возвращает даты начала и конца периода в формате YYYY-MM-DD"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

async def get_vacancy_data(query: str, area: int, date_from: str, date_to: str, page: int = 0) -> dict:
    """Получение данных о вакансиях с учетом ограничений API"""
    try:
        params = {
            'text': query,
            'area': area,
            'date_from': date_from,
            'date_to': date_to,
            'page': page,
            'per_page': 100
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get('https://api.hh.ru/vacancies', params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        logger.error(f"Ошибка при запросе к API: {str(e)}")
        return {}

@app.get("/")
async def root():
    return {"message": "HR SkillPulse API is running"}

@app.post("/api/vacancies/stats", response_model=VacancyStats)
async def get_vacancy_stats(request: VacancyRequest):
    try:
        # Получаем полную статистику по всем вакансиям
        all_salaries, all_texts, area_stats, total_vacancies, vacancies_with_salary, vacancies_without_salary = get_all_vacancies(
            request.query, request.areas
        )
        
        # Получаем данные для текущей страницы
        current_page_vacancies = []
        for area in request.areas:
            url = "https://api.hh.ru/vacancies"
            params = {
                "text": request.query,
                "area": area,
                "per_page": request.per_page,
                "page": request.page - 1  # API использует 0-based индексацию
            }
            
            data = get_vacancy_data(url, params)
            current_page_vacancies.extend(data.get("items", []))
        
        # Обработка данных для текущей страницы
        vacancy_info_list = []
        for vacancy in current_page_vacancies:
            if not isinstance(vacancy, dict):
                continue
                
            salary = vacancy.get("salary", {}) or {}
            salary_from = salary.get("from")
            salary_to = salary.get("to")
            has_salary = bool(salary_from or salary_to)
            
            employer = vacancy.get("employer", {}) or {}
            company_name = employer.get("name", "Компания не указана")
            
            vacancy_info = VacancyInfo(
                id=str(vacancy.get("id", "")),
                name=vacancy.get("name", "Название не указано"),
                url=vacancy.get("alternate_url", ""),
                salary_from=salary_from,
                salary_to=salary_to,
                company_name=company_name,
                requirements=vacancy.get("snippet", {}).get("requirement") if vacancy.get("snippet") else None,
                description=vacancy.get("snippet", {}).get("responsibility") if vacancy.get("snippet") else None,
                has_salary=has_salary
            )
            vacancy_info_list.append(vacancy_info)
        
        # Расчет статистики
        average_salary = sum(all_salaries) / len(all_salaries) if all_salaries else 0
        median_salary = sorted(all_salaries)[len(all_salaries)//2] if all_salaries else 0
        
        # Анализ текстов
        combined_text = " ".join(all_texts)
        word_cloud = get_word_frequency(combined_text)
        
        # Распределение зарплат
        salary_distribution = get_salary_distribution(all_salaries)
        
        return VacancyStats(
            total_vacancies=total_vacancies,
            vacancies_with_salary=vacancies_with_salary,
            vacancies_without_salary=vacancies_without_salary,
            average_salary=average_salary,
            median_salary=median_salary,
            vacancies=vacancy_info_list,
            salary_distribution=salary_distribution,
            word_cloud=word_cloud,
            area_stats=area_stats
        )
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data from HH API: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/vacancies/stream")
async def stream_vacancies(query: str, areas: str):
    """Эндпоинт для стриминга данных о вакансиях в реальном времени"""
    area_ids = [int(area) for area in areas.split(',')]
    
    async def event_generator():
        # Сначала получаем общее количество вакансий
        total_vacancies = 0
        for area in area_ids:
            date_from, date_to = get_date_range(30)  # Используем последние 30 дней для подсчета
            data = await get_vacancy_data(query, area, date_from, date_to)
            if data and 'found' in data:
                total_vacancies += data['found']
        
        # Отправляем начальные данные
        partial = {
            "total_vacancies": total_vacancies,
            "unique_vacancies": 0,
            "vacancies_with_salary": 0,
            "vacancies_without_salary": 0,
            "average_salary": None,
            "median_salary": None,
            "salary_distribution": {},
            "word_cloud": {},
            "area_stats": {},
            "vacancies": []
        }
        yield f"data: {json.dumps(partial, ensure_ascii=False)}\n\n"
        
        # Собираем данные по периодам
        processed_vacancy_ids = set()
        all_salaries = []
        all_words = []
        area_stats = {}
        vacancies_list = []
        
        # Разбиваем запрос на более мелкие периоды
        periods = [
            (0, 7, "Последние 7 дней"),
            (7, 14, "7-14 дней назад"),
            (14, 21, "14-21 дней назад"),
            (21, 30, "21-30 дней назад"),
            (30, 45, "30-45 дней назад"),
            (45, 60, "45-60 дней назад"),
            (60, 75, "60-75 дней назад"),
            (75, 90, "75-90 дней назад")
        ]
        
        for start_days, end_days, period_name in periods:
            date_to, _ = get_date_range(start_days)
            date_from, _ = get_date_range(end_days)
            
            logger.info(f"Обработка периода {period_name}: с {date_from} по {date_to}")
            
            for area in area_ids:
                area_name = f"area_{area}"
                if area_name not in area_stats:
                    area_stats[area_name] = {
                        "total": 0,
                        "with_salary": 0,
                        "without_salary": 0,
                        "average_salary": None,
                        "median_salary": None
                    }
                
                # Получаем первую страницу для определения общего количества страниц
                data = await get_vacancy_data(query, area, date_from, date_to)
                if not data or 'pages' not in data:
                    continue
                
                total_pages = data.get('pages', 0)
                logger.info(f"Регион {area}: найдено {data.get('found', 0)} вакансий, всего страниц: {total_pages}")
                
                # Обрабатываем все страницы
                for page in range(total_pages):
                    try:
                        page_data = await get_vacancy_data(query, area, date_from, date_to, page)
                        
                        if not page_data or 'items' not in page_data:
                            continue
                        
                        for item in page_data.get('items', []):
                            if not item or 'id' not in item:
                                continue
                                
                            if item['id'] not in processed_vacancy_ids:
                                processed_vacancy_ids.add(item['id'])
                                
                                # Обработка зарплаты
                                salary_info = item.get('salary', {}) or {}
                                salary_from = salary_info.get('from')
                                salary_to = salary_info.get('to')
                                has_salary = bool(salary_from or salary_to)
                                
                                if has_salary:
                                    salary = salary_from if salary_from else salary_to
                                    if salary:
                                        all_salaries.append(salary)
                                        area_stats[area_name]["with_salary"] += 1
                                else:
                                    area_stats[area_name]["without_salary"] += 1
                                
                                # Обработка текста
                                name = item.get('name', '')
                                snippet = item.get('snippet', {}) or {}
                                requirement = snippet.get('requirement', '')
                                responsibility = snippet.get('responsibility', '')
                                
                                text = f"{name} {requirement} {responsibility}"
                                words = clean_text(text).split()
                                all_words.extend(words)
                                
                                # Добавляем вакансию в список
                                vacancy = {
                                    "id": item['id'],
                                    "name": name,
                                    "salary": {
                                        "from": salary_from,
                                        "to": salary_to,
                                        "currency": salary_info.get('currency', 'RUR')
                                    },
                                    "employer": item.get('employer', {}).get('name', ''),
                                    "area": item.get('area', {}).get('name', ''),
                                    "url": item.get('alternate_url', ''),
                                    "description": f"{requirement}\n{responsibility}",
                                    "published_at": item.get('published_at', '')
                                }
                                vacancies_list.append(vacancy)
                                
                                area_stats[area_name]["total"] += 1
                        
                        # Отправляем промежуточные результаты
                        partial = {
                            "total_vacancies": total_vacancies,
                            "unique_vacancies": len(processed_vacancy_ids),
                            "vacancies_with_salary": sum(1 for s in all_salaries if s is not None),
                            "vacancies_without_salary": len(processed_vacancy_ids) - sum(1 for s in all_salaries if s is not None),
                            "average_salary": float(np.mean(all_salaries)) if all_salaries else None,
                            "median_salary": float(np.median(all_salaries)) if all_salaries else None,
                            "salary_distribution": get_salary_distribution(all_salaries),
                            "word_cloud": dict(Counter(all_words).most_common(50)),
                            "area_stats": {k: {
                                "total": int(v["total"]),
                                "with_salary": int(v["with_salary"]),
                                "without_salary": int(v["without_salary"]),
                                "average_salary": float(v["average_salary"]) if v["average_salary"] else None,
                                "median_salary": float(v["median_salary"]) if v["median_salary"] else None
                            } for k, v in area_stats.items()},
                            "vacancies": vacancies_list
                        }
                        yield f"data: {json.dumps(partial, ensure_ascii=False)}\n\n"
                        
                    except Exception as e:
                        logger.error(f"Ошибка при обработке страницы {page}: {str(e)}")
                        continue
                    
                    await asyncio.sleep(0.25)  # Задержка между запросами
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 