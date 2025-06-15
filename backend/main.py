from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import time
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import numpy as np
from datetime import datetime, timedelta
import calendar
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio
import httpx
import logging
from sse_starlette.sse import EventSourceResponse
import string
import statistics

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Скачиваем необходимые данные NLTK
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

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
    allow_origins=["http://localhost:3000"],  # Явно указываем разрешенный origin
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
            'page': page,
            'per_page': 100,
            'period': 30
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'HH-User-Agent': 'api-client/1.0'
        }
        
        logger.info(f"Запрос к API с параметрами: {params}")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get('https://api.hh.ru/vacancies', params=params, headers=headers)
                logger.info(f"Статус ответа: {response.status_code}")
                response.raise_for_status()
                data = response.json()
                logger.info(f"Получено вакансий: {len(data.get('items', []))}")
                if len(data.get('items', [])) == 0:
                    logger.warning(f"API вернул 0 вакансий. Ответ: {data}")
                return data
            except httpx.HTTPError as e:
                logger.error(f"Ошибка HTTP при запросе к API: {str(e)}")
                logger.error(f"URL: {e.request.url}")
                logger.error(f"Статус: {e.response.status_code if e.response else 'No response'}")
                logger.error(f"Текст ответа: {e.response.text if e.response else 'No response'}")
                return {}
            except Exception as e:
                logger.error(f"Неожиданная ошибка при запросе к API: {str(e)}")
                return {}
    except Exception as e:
        logger.error(f"Ошибка при создании клиента: {str(e)}")
        return {}

async def get_all_vacancies(query: str, areas: List[int]) -> tuple:
    """Получение и обработка всех вакансий для анализа"""
    logger.info(f"Начало получения вакансий для запроса: {query}, регионы: {areas}")
    
    all_salaries = []
    all_texts = []
    area_stats = {}
    total_vacancies = 0
    vacancies_with_salary = 0
    vacancies_without_salary = 0
    word_cloud = {}  # Инициализируем word_cloud в начале функции
    
    for area in areas:
        logger.info(f"Обработка региона {area}")
        area_vacancies = []
        area_salaries = []
        area_texts = []
        
        # Получаем первую страницу для подсчета общего количества
        first_page = await get_vacancy_data(query, area, "", "", 0)
        if not first_page:
            logger.warning(f"Не удалось получить данные для региона {area}")
            continue
            
        total_pages = first_page.get('pages', 0)
        total_vacancies += first_page.get('found', 0)
        logger.info(f"Найдено вакансий: {first_page.get('found', 0)}, страниц: {total_pages}")
        
        # Обрабатываем первую страницу
        for vacancy in first_page.get('items', []):
            salary = vacancy.get('salary', {})
            if salary:
                salary_from = salary.get('from')
                salary_to = salary.get('to')
                if salary_from or salary_to:
                    avg_salary = (salary_from + salary_to) / 2 if salary_from and salary_to else (salary_from or salary_to)
                    area_salaries.append(avg_salary)
                    vacancies_with_salary += 1
                else:
                    vacancies_without_salary += 1
            
            # Собираем тексты для анализа
            text_parts = []
            if vacancy.get('snippet', {}).get('requirement'):
                text_parts.append(vacancy['snippet']['requirement'])
            if vacancy.get('snippet', {}).get('responsibility'):
                text_parts.append(vacancy['snippet']['responsibility'])
            if text_parts:
                area_texts.append(' '.join(text_parts))
        
        logger.info(f"Обработана первая страница. Вакансий с зарплатой: {len(area_salaries)}")
        
        # Получаем остальные страницы
        for page in range(1, min(total_pages, 20)):  # Ограничиваем 20 страницами
            logger.info(f"Получение страницы {page + 1} из {total_pages}")
            page_data = await get_vacancy_data(query, area, "", "", page)
            if not page_data:
                logger.warning(f"Не удалось получить данные для страницы {page + 1}")
                continue
                
            for vacancy in page_data.get('items', []):
                salary = vacancy.get('salary', {})
                if salary:
                    salary_from = salary.get('from')
                    salary_to = salary.get('to')
                    if salary_from or salary_to:
                        avg_salary = (salary_from + salary_to) / 2 if salary_from and salary_to else (salary_from or salary_to)
                        area_salaries.append(avg_salary)
                        vacancies_with_salary += 1
                    else:
                        vacancies_without_salary += 1
                
                # Собираем тексты для анализа
                text_parts = []
                if vacancy.get('snippet', {}).get('requirement'):
                    text_parts.append(vacancy['snippet']['requirement'])
                if vacancy.get('snippet', {}).get('responsibility'):
                    text_parts.append(vacancy['snippet']['responsibility'])
                if text_parts:
                    area_texts.append(' '.join(text_parts))
        
        # Сохраняем статистику по региону
        area_stats[str(area)] = {
            'total_vacancies': len(area_vacancies),
            'average_salary': sum(area_salaries) / len(area_salaries) if area_salaries else 0,
            'vacancies_with_salary': len(area_salaries),
            'vacancies_without_salary': len(area_vacancies) - len(area_salaries)
        }
        
        # Добавляем данные в общие списки
        all_salaries.extend(area_salaries)
        all_texts.extend(area_texts)
        
        logger.info(f"Завершена обработка региона {area}. Всего вакансий: {len(area_vacancies)}, с зарплатой: {len(area_salaries)}")
    
    # Создаем облако слов из всех собранных текстов
    if all_texts:
        combined_text = " ".join(all_texts)
        word_cloud = get_word_frequency(combined_text)
    
    logger.info(f"Анализ завершен. Всего вакансий: {total_vacancies}, с зарплатой: {vacancies_with_salary}")
    return all_salaries, all_texts, area_stats, total_vacancies, vacancies_with_salary, vacancies_without_salary, word_cloud

@app.get("/")
async def root():
    return {"message": "HR SkillPulse API is running"}

@app.post("/api/vacancies/stats")
async def get_vacancy_stats(request: VacancyRequest):
    """Получение статистики по вакансиям"""
    try:
        logger.info(f"Начало поиска вакансий для запроса: {request.query}, регионы: {request.areas}")
        
        # Получаем текущую дату и дату 30 дней назад
        date_to = datetime.now().strftime("%Y-%m-%d")
        date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        all_vacancies = []
        total_vacancies = 0
        unique_vacancies = 0
        vacancies_with_salary = 0
        vacancies_without_salary = 0
        total_salary = 0
        salaries = []
        word_cloud = {}
        area_stats = {}
        processed_ids = set()  # Множество для отслеживания уникальных ID
        vacancies_list = []  # Список для хранения информации о вакансиях
        
        # Обрабатываем каждый регион
        for area in request.areas:
            try:
                logger.info(f"Обработка региона {area}")
                page = 0
                while True:
                    try:
                        data = await get_vacancy_data(request.query, area, date_from, date_to, page)
                        if not data or 'items' not in data:
                            logger.warning(f"Нет данных для региона {area}")
                            break
                            
                        vacancies = data['items']
                        logger.info(f"Получено вакансий: {len(vacancies)}")
                        
                        if not vacancies:
                            break
                            
                        all_vacancies.extend(vacancies)
                        total_vacancies += len(vacancies)
                        
                        # Обрабатываем каждую вакансию
                        for vacancy in vacancies:
                            try:
                                # Проверяем уникальность по ID
                                if vacancy['id'] not in processed_ids:
                                    processed_ids.add(vacancy['id'])
                                    unique_vacancies += 1
                                    
                                    # Добавляем информацию о вакансии в список
                                    vacancy_info = {
                                        'id': vacancy['id'],
                                        'name': vacancy['name'],
                                        'company': vacancy['employer']['name'],
                                        'description': vacancy.get('snippet', {}).get('requirement', ''),
                                        'url': vacancy['alternate_url'],
                                        'salary': {
                                            'from': vacancy.get('salary', {}).get('from'),
                                            'to': vacancy.get('salary', {}).get('to'),
                                            'currency': vacancy.get('salary', {}).get('currency', 'RUR')
                                        } if vacancy.get('salary') else None
                                    }
                                    vacancies_list.append(vacancy_info)
                                    
                                    # Анализируем зарплату
                                    if vacancy.get('salary'):
                                        vacancies_with_salary += 1
                                        salary = 0
                                        
                                        # Проверяем все варианты зарплаты
                                        if vacancy['salary'].get('from') and vacancy['salary'].get('to'):
                                            salary = (vacancy['salary']['from'] + vacancy['salary']['to']) / 2
                                        elif vacancy['salary'].get('from'):
                                            salary = vacancy['salary']['from']
                                        elif vacancy['salary'].get('to'):
                                            salary = vacancy['salary']['to']
                                            
                                        if salary > 0:
                                            total_salary += salary
                                            salaries.append(salary)
                                    else:
                                        vacancies_without_salary += 1
                                        
                                    # Анализируем описание
                                    if vacancy.get('snippet', {}).get('requirement'):
                                        try:
                                            words = extract_words(vacancy['snippet']['requirement'])
                                            for word in words:
                                                word_cloud[word] = word_cloud.get(word, 0) + 1
                                        except Exception as e:
                                            logger.error(f"Ошибка при обработке текста: {str(e)}")
                                            
                                    # Собираем статистику по регионам
                                    area_id = str(vacancy.get('area', {}).get('id', 0))
                                    if area_id not in area_stats:
                                        area_stats[area_id] = {
                                            'total': 0,
                                            'with_salary': 0,
                                            'total_salary': 0
                                        }
                                    area_stats[area_id]['total'] += 1
                                    if vacancy.get('salary'):
                                        area_stats[area_id]['with_salary'] += 1
                                        salary = 0
                                        if vacancy['salary'].get('from') and vacancy['salary'].get('to'):
                                            salary = (vacancy['salary']['from'] + vacancy['salary']['to']) / 2
                                        elif vacancy['salary'].get('from'):
                                            salary = vacancy['salary']['from']
                                        elif vacancy['salary'].get('to'):
                                            salary = vacancy['salary']['to']
                                        if salary > 0:
                                            area_stats[area_id]['total_salary'] += salary
                            except Exception as e:
                                logger.error(f"Ошибка при обработке вакансии: {str(e)}")
                                continue
                    
                        # Проверяем, есть ли еще страницы
                        if len(vacancies) < request.per_page:
                            break
                            
                        page += 1
                    except Exception as e:
                        logger.error(f"Ошибка при получении страницы {page}: {str(e)}")
                        break
            except Exception as e:
                logger.error(f"Ошибка при обработке региона {area}: {str(e)}")
                continue
                
        # Рассчитываем среднюю и медианную зарплату
        try:
            average_salary = round(total_salary / vacancies_with_salary) if vacancies_with_salary > 0 else 0
            median_salary = round(statistics.median(salaries)) if salaries else 0
        except Exception as e:
            logger.error(f"Ошибка при расчете зарплат: {str(e)}")
            average_salary = 0
            median_salary = 0
        
        # Рассчитываем среднюю зарплату по регионам
        for area_id in area_stats:
            try:
                if area_stats[area_id]['with_salary'] > 0:
                    area_stats[area_id]['average_salary'] = round(area_stats[area_id]['total_salary'] / area_stats[area_id]['with_salary'])
                else:
                    area_stats[area_id]['average_salary'] = 0
            except Exception as e:
                logger.error(f"Ошибка при расчете зарплаты для региона {area_id}: {str(e)}")
                area_stats[area_id]['average_salary'] = 0
                
        # Формируем ответ
        response = {
            "total_vacancies": total_vacancies,
            "unique_vacancies": unique_vacancies,
            "vacancies_with_salary": vacancies_with_salary,
            "vacancies_without_salary": vacancies_without_salary,
            "average_salary": average_salary,
            "median_salary": median_salary,
            "word_cloud": word_cloud,
            "area_stats": area_stats,
            "vacancies": vacancies_list,  # Добавляем список вакансий
            "salary_distribution": {  # Добавляем распределение зарплат
                "min": min(salaries) if salaries else 0,
                "max": max(salaries) if salaries else 0,
                "distribution": [
                    {"range": "0-50000", "count": len([s for s in salaries if s <= 50000])},
                    {"range": "50000-100000", "count": len([s for s in salaries if 50000 < s <= 100000])},
                    {"range": "100000-150000", "count": len([s for s in salaries if 100000 < s <= 150000])},
                    {"range": "150000-200000", "count": len([s for s in salaries if 150000 < s <= 200000])},
                    {"range": "200000+", "count": len([s for s in salaries if s > 200000])}
                ]
            }
        }
        
        logger.info(f"Статистика собрана: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Ошибка при сборе статистики: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vacancies/stream")
async def stream_vacancies(request: Request):
    """Эндпоинт для стриминга данных о вакансиях"""
    query = request.query_params.get('query', '')
    areas = [int(area) for area in request.query_params.get('areas', '').split(',') if area]
    
    if not query or not areas:
        return JSONResponse(
            status_code=400,
            content={"error": "Необходимо указать query и areas"}
        )
    
    async def generate():
        try:
            # Получаем полную статистику по всем вакансиям
            all_salaries, all_texts, area_stats, total_vacancies, vacancies_with_salary, vacancies_without_salary, word_cloud = await get_all_vacancies(
                query, areas
            )
            
            # Рассчитываем статистику
            average_salary = sum(all_salaries) / len(all_salaries) if all_salaries else 0
            median_salary = sorted(all_salaries)[len(all_salaries)//2] if all_salaries else 0
            
            # Распределение зарплат
            salary_ranges = {
                '0-50000': 0,
                '50000-100000': 0,
                '100000-150000': 0,
                '150000-200000': 0,
                '200000+': 0
            }
            
            for salary in all_salaries:
                if salary < 50000:
                    salary_ranges['0-50000'] += 1
                elif salary < 100000:
                    salary_ranges['50000-100000'] += 1
                elif salary < 150000:
                    salary_ranges['100000-150000'] += 1
                elif salary < 200000:
                    salary_ranges['150000-200000'] += 1
                else:
                    salary_ranges['200000+'] += 1
            
            # Формируем итоговый ответ
            result = {
                'total_vacancies': total_vacancies,
                'unique_vacancies': len(set(all_texts)),
                'vacancies_with_salary': vacancies_with_salary,
                'vacancies_without_salary': vacancies_without_salary,
                'average_salary': average_salary,
                'median_salary': median_salary,
                'salary_distribution': salary_ranges,
                'area_stats': area_stats,
                'word_cloud': word_cloud
            }
            
            yield f"data: {json.dumps(result)}\n\n"
            
        except Exception as e:
            logger.error(f"Ошибка при обработке запроса: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type='text/event-stream'
    )

@app.get("/analyze")
async def analyze_vacancies(query: str, areas: str):
    """Анализ вакансий с использованием SSE для обновления прогресса"""
    try:
        # Преобразуем строку с регионами в список
        area_list = [int(area) for area in areas.split(',')]
        
        async def event_generator():
            try:
                # Отправляем начальное сообщение
                yield "data: {\"status\": \"started\", \"message\": \"Начало анализа\"}\n\n"
                
                # Получаем данные о вакансиях
                all_salaries, all_texts, area_stats, total_vacancies, vacancies_with_salary, vacancies_without_salary, word_cloud = await get_all_vacancies(query, area_list)
                
                if not all_salaries and not all_texts:
                    yield "data: {\"status\": \"error\", \"message\": \"Не удалось получить данные о вакансиях\"}\n\n"
                    return
                
                # Отправляем сообщение о начале анализа
                yield "data: {\"status\": \"processing\", \"message\": \"Анализ данных...\"}\n\n"
                
                # Анализируем зарплаты
                salary_stats = analyze_salaries(all_salaries)
                
                # Анализируем тексты
                text_stats = analyze_texts(all_texts)
                
                # Формируем итоговый результат
                result = {
                    "status": "completed",
                    "message": "Анализ завершен",
                    "data": {
                        "salary_stats": salary_stats,
                        "text_stats": text_stats,
                        "area_stats": area_stats,
                        "total_vacancies": total_vacancies,
                        "vacancies_with_salary": vacancies_with_salary,
                        "vacancies_without_salary": vacancies_without_salary,
                        "word_cloud": word_cloud
                    }
                }
                
                # Отправляем результат
                yield f"data: {json.dumps(result)}\n\n"
                
            except Exception as e:
                logger.error(f"Ошибка при анализе: {str(e)}")
                yield f"data: {{\"status\": \"error\", \"message\": \"Ошибка при анализе: {str(e)}\"}}\n\n"
        
        return EventSourceResponse(event_generator())
        
    except Exception as e:
        logger.error(f"Ошибка при обработке запроса: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_words(text: str) -> list:
    """Извлекает значимые слова из текста"""
    # Удаляем HTML-теги
    text = re.sub(r'<[^>]+>', '', text)
    
    # Удаляем специальные символы и приводим к нижнему регистру
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Разбиваем на слова
    words = text.split()
    
    # Удаляем стоп-слова и короткие слова
    stop_words = {'и', 'в', 'во', 'не', 'что', 'он', 'на', 'я', 'с', 'со', 'как', 'а', 'то', 'все', 'она', 'так', 'его', 'но', 'да', 'ты', 'к', 'у', 'же', 'вы', 'за', 'бы', 'по', 'только', 'ее', 'мне', 'было', 'вот', 'от', 'меня', 'еще', 'нет', 'о', 'из', 'ему', 'теперь', 'когда', 'даже', 'ну', 'вдруг', 'ли', 'если', 'уже', 'или', 'ни', 'быть', 'был', 'него', 'до', 'вас', 'нибудь', 'опять', 'уж', 'вам', 'ведь', 'там', 'потом', 'себя', 'ничего', 'ей', 'может', 'они', 'тут', 'где', 'есть', 'надо', 'ней', 'для', 'мы', 'тебя', 'их', 'чем', 'была', 'сам', 'чтоб', 'без', 'будто', 'чего', 'раз', 'тоже', 'себе', 'под', 'будет', 'ж', 'тогда', 'кто', 'этот', 'того', 'потому', 'этого', 'какой', 'совсем', 'ним', 'здесь', 'этом', 'один', 'почти', 'мой', 'тем', 'чтобы', 'нее', 'сейчас', 'были', 'куда', 'зачем', 'всех', 'никогда', 'можно', 'при', 'наконец', 'два', 'об', 'другой', 'хоть', 'после', 'над', 'больше', 'тот', 'через', 'эти', 'нас', 'про', 'всего', 'них', 'какая', 'много', 'разве', 'три', 'эту', 'моя', 'впрочем', 'хорошо', 'свою', 'этой', 'перед', 'иногда', 'лучше', 'чуть', 'том', 'нельзя', 'такой', 'им', 'более', 'всегда', 'конечно', 'всю', 'между'}
    words = [word for word in words if word not in stop_words and len(word) > 2]
    
    return words

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 