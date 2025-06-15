from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict
import httpx
import asyncio
from datetime import datetime
import json
from collections import Counter
import re
from app.core.config import settings
from app.services.hh_service import HHService
from app.services.word_cloud_service import WordCloudService
from app.services.area_service import AreaService

router = APIRouter()
hh_service = HHService()
word_cloud_service = WordCloudService()
area_service = AreaService()

class VacancySearch(BaseModel):
    query: str
    areas: List[int]
    per_page: int = 100

def calculate_salary_ranges(vacancies: List[dict]) -> Dict[str, int]:
    """Рассчитывает распределение зарплат по диапазонам"""
    ranges = {
        '0-50000': 0,
        '50000-100000': 0,
        '100000-150000': 0,
        '150000-200000': 0,
        '200000-250000': 0,
        '250000-300000': 0,
        '300000+': 0
    }
    
    for vacancy in vacancies:
        if not vacancy.get('salary'):
            continue
            
        salary = vacancy['salary']
        if salary.get('from') is not None:
            amount = salary['from']
        elif salary.get('to') is not None:
            amount = salary['to']
        else:
            continue
            
        if amount < 50000:
            ranges['0-50000'] += 1
        elif amount < 100000:
            ranges['50000-100000'] += 1
        elif amount < 150000:
            ranges['100000-150000'] += 1
        elif amount < 200000:
            ranges['150000-200000'] += 1
        elif amount < 250000:
            ranges['200000-250000'] += 1
        elif amount < 300000:
            ranges['250000-300000'] += 1
        else:
            ranges['300000+'] += 1
            
    return ranges

@router.post("/stats")
async def get_vacancy_stats(search: VacancySearch):
    try:
        print("\n=== Начало обработки запроса ===")
        print(f"Запрос: {search.query}, регионы: {search.areas}")
        
        # Получаем вакансии
        vacancies = await hh_service.search_vacancies(
            query=search.query,
            areas=search.areas,
            per_page=search.per_page
        )
        
        print(f"\nПолучено вакансий: {len(vacancies)}")
        
        if not vacancies:
            print("Нет вакансий, возвращаем пустой результат")
            return {
                "total_vacancies": 0,
                "unique_vacancies": 0,
                "vacancies_with_salary": 0,
                "vacancies_without_salary": 0,
                "average_salary": 0,
                "median_salary": 0,
                "word_cloud": {},
                "salary_ranges": {
                    '0-50000': 0,
                    '50000-100000': 0,
                    '100000-150000': 0,
                    '150000-200000': 0,
                    '200000-250000': 0,
                    '250000-300000': 0,
                    '300000+': 0
                },
                "vacancies": []
            }

        # Считаем статистику
        total_vacancies = len(vacancies)
        unique_vacancies = len(set(v['id'] for v in vacancies))
        vacancies_with_salary = sum(1 for v in vacancies if v.get('salary'))
        vacancies_without_salary = total_vacancies - vacancies_with_salary
        
        print(f"\nСтатистика:")
        print(f"- Всего вакансий: {total_vacancies}")
        print(f"- Уникальных вакансий: {unique_vacancies}")
        print(f"- С зарплатой: {vacancies_with_salary}")
        print(f"- Без зарплаты: {vacancies_without_salary}")
        
        # Считаем среднюю и медианную зарплату
        salaries = []
        for v in vacancies:
            if v.get('salary'):
                salary = v['salary']
                if salary.get('from') is not None and salary.get('from') > 0:
                    salaries.append(salary['from'])
                elif salary.get('to') is not None and salary.get('to') > 0:
                    salaries.append(salary['to'])
        
        average_salary = int(sum(salaries) / len(salaries)) if salaries else 0
        median_salary = int(sorted(salaries)[len(salaries)//2]) if salaries else 0
        
        print(f"\nЗарплаты:")
        print(f"- Средняя: {average_salary}")
        print(f"- Медианная: {median_salary}")
        print(f"- Примеры зарплат: {salaries[:5] if salaries else 'Нет зарплат'}")
        
        # Создаем облако слов
        word_cloud = word_cloud_service.create_word_cloud(vacancies)
        print(f"\nОблако слов:")
        print(f"- Количество слов: {len(word_cloud)}")
        print(f"- Примеры слов: {dict(list(word_cloud.items())[:5])}")
        
        # Рассчитываем распределение зарплат
        salary_ranges = calculate_salary_ranges(vacancies)
        
        print(f"\nРаспределение зарплат:")
        for range_name, count in salary_ranges.items():
            print(f"- {range_name}: {count}")
        
        # Форматируем вакансии для фронтенда
        formatted_vacancies = []
        for v in vacancies:
            formatted_vacancy = {
                'id': v.get('id', ''),
                'name': v.get('name', ''),
                'salary': v.get('salary', {}),
                'employer': v.get('employer', {}).get('name', 'Не указано'),
                'area': v.get('area', {}).get('name', 'Не указано'),
                'url': v.get('alternate_url', ''),
                'snippet': v.get('snippet', {}).get('requirement', '') or v.get('snippet', {}).get('responsibility', '') or 'Описание отсутствует',
                'published_at': v.get('published_at', ''),
                'schedule': v.get('schedule', {}).get('name', 'Не указано'),
                'experience': v.get('experience', {}).get('name', 'Не указано'),
                'employment': v.get('employment', {}).get('name', 'Не указано')
            }
            formatted_vacancies.append(formatted_vacancy)
        
        result = {
            "total_vacancies": total_vacancies,
            "unique_vacancies": unique_vacancies,
            "vacancies_with_salary": vacancies_with_salary,
            "vacancies_without_salary": vacancies_without_salary,
            "average_salary": average_salary,
            "median_salary": median_salary,
            "word_cloud": word_cloud,
            "salary_ranges": salary_ranges,
            "vacancies": formatted_vacancies
        }
        
        print("\n=== Обработка запроса завершена ===")
        return result
        
    except Exception as e:
        print(f"\nОшибка: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ... rest of the code ... 