from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from pydantic import BaseModel
from typing import List, Optional, Dict
import httpx
import asyncio
from datetime import datetime
import json
import csv
import xml.etree.ElementTree as ET
from io import StringIO
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

def format_vacancy_for_export(vacancy: dict) -> dict:
    """Форматирует вакансию для экспорта"""
    salary = vacancy.get('salary', {})
    salary_text = ""
    if salary:
        if salary.get('from') and salary.get('to'):
            salary_text = f"{salary['from']} - {salary['to']} {salary.get('currency', 'RUR')}"
        elif salary.get('from'):
            salary_text = f"от {salary['from']} {salary.get('currency', 'RUR')}"
        elif salary.get('to'):
            salary_text = f"до {salary['to']} {salary.get('currency', 'RUR')}"
    
    return {
        'id': vacancy.get('id', ''),
        'name': vacancy.get('name', ''),
        'salary': salary_text,
        'employer': vacancy.get('employer', {}).get('name', 'Не указано'),
        'area': vacancy.get('area', {}).get('name', 'Не указано'),
        'url': vacancy.get('alternate_url', ''),
        'snippet': vacancy.get('snippet', {}).get('requirement', '') or vacancy.get('snippet', {}).get('responsibility', '') or 'Описание отсутствует',
        'published_at': vacancy.get('published_at', ''),
        'schedule': vacancy.get('schedule', {}).get('name', 'Не указано'),
        'experience': vacancy.get('experience', {}).get('name', 'Не указано'),
        'employment': vacancy.get('employment', {}).get('name', 'Не указано')
    }

def export_to_csv(vacancies: List[dict], stats: dict, query: str, areas: List[str]) -> str:
    """Экспортирует данные в CSV формат"""
    output = StringIO()
    writer = csv.writer(output)
    
    # Записываем статистику
    writer.writerow(['Анализ рынка вакансий'])
    writer.writerow([])
    writer.writerow(['Параметр', 'Значение'])
    writer.writerow(['Поисковый запрос', query])
    writer.writerow(['Регионы', ', '.join(areas)])
    writer.writerow(['Всего вакансий', stats['total_vacancies']])
    writer.writerow(['Уникальных вакансий', stats['unique_vacancies']])
    writer.writerow(['С зарплатой', stats['vacancies_with_salary']])
    writer.writerow(['Без зарплаты', stats['vacancies_without_salary']])
    writer.writerow(['Средняя зарплата', stats['average_salary']])
    writer.writerow(['Медианная зарплата', stats['median_salary']])
    writer.writerow([])
    
    # Записываем распределение зарплат
    writer.writerow(['Распределение зарплат'])
    for range_name, count in stats['salary_ranges'].items():
        writer.writerow([range_name, count])
    writer.writerow([])
    
    # Записываем облако слов
    writer.writerow(['Облако слов'])
    for word, weight in stats['word_cloud'].items():
        writer.writerow([word, weight])
    writer.writerow([])
    
    # Записываем вакансии
    writer.writerow(['Список вакансий'])
    writer.writerow(['ID', 'Название', 'Зарплата', 'Компания', 'Регион', 'URL', 'Описание', 'Дата публикации', 'График', 'Опыт', 'Тип занятости'])
    
    for vacancy in vacancies:
        # Вакансии уже отформатированы, но salary может быть объектом
        salary_text = vacancy.get('salary', '')
        if isinstance(salary_text, dict):
            # Если salary - это объект, форматируем его
            if salary_text.get('from') and salary_text.get('to'):
                salary_text = f"{salary_text['from']} - {salary_text['to']} {salary_text.get('currency', 'RUR')}"
            elif salary_text.get('from'):
                salary_text = f"от {salary_text['from']} {salary_text.get('currency', 'RUR')}"
            elif salary_text.get('to'):
                salary_text = f"до {salary_text['to']} {salary_text.get('currency', 'RUR')}"
            else:
                salary_text = "Не указана"
        
        writer.writerow([
            vacancy.get('id', ''),
            vacancy.get('name', ''),
            salary_text,
            vacancy.get('employer', ''),
            vacancy.get('area', ''),
            vacancy.get('url', ''),
            vacancy.get('snippet', ''),
            vacancy.get('published_at', ''),
            vacancy.get('schedule', ''),
            vacancy.get('experience', ''),
            vacancy.get('employment', '')
        ])
    
    # Добавляем BOM для правильного отображения кириллицы в Excel
    csv_content = output.getvalue()
    return '\ufeff' + csv_content

def export_to_xml(vacancies: List[dict], stats: dict, query: str, areas: List[str]) -> str:
    """Экспортирует данные в XML формат"""
    root = ET.Element('vacancy_analysis')
    
    # Метаданные
    metadata = ET.SubElement(root, 'metadata')
    ET.SubElement(metadata, 'query').text = query
    ET.SubElement(metadata, 'areas').text = ', '.join(areas)
    ET.SubElement(metadata, 'export_date').text = datetime.now().isoformat()
    
    # Статистика
    statistics = ET.SubElement(root, 'statistics')
    ET.SubElement(statistics, 'total_vacancies').text = str(stats['total_vacancies'])
    ET.SubElement(statistics, 'unique_vacancies').text = str(stats['unique_vacancies'])
    ET.SubElement(statistics, 'vacancies_with_salary').text = str(stats['vacancies_with_salary'])
    ET.SubElement(statistics, 'vacancies_without_salary').text = str(stats['vacancies_without_salary'])
    ET.SubElement(statistics, 'average_salary').text = str(stats['average_salary'])
    ET.SubElement(statistics, 'median_salary').text = str(stats['median_salary'])
    
    # Распределение зарплат
    salary_ranges = ET.SubElement(root, 'salary_ranges')
    for range_name, count in stats['salary_ranges'].items():
        range_elem = ET.SubElement(salary_ranges, 'range')
        ET.SubElement(range_elem, 'name').text = range_name
        ET.SubElement(range_elem, 'count').text = str(count)
    
    # Облако слов
    word_cloud = ET.SubElement(root, 'word_cloud')
    for word, weight in stats['word_cloud'].items():
        word_elem = ET.SubElement(word_cloud, 'word')
        ET.SubElement(word_elem, 'text').text = word
        ET.SubElement(word_elem, 'weight').text = str(weight)
    
    # Вакансии
    vacancies_elem = ET.SubElement(root, 'vacancies')
    for vacancy in vacancies:
        # Вакансии уже отформатированы, но salary может быть объектом
        salary_text = vacancy.get('salary', '')
        if isinstance(salary_text, dict):
            # Если salary - это объект, форматируем его
            if salary_text.get('from') and salary_text.get('to'):
                salary_text = f"{salary_text['from']} - {salary_text['to']} {salary_text.get('currency', 'RUR')}"
            elif salary_text.get('from'):
                salary_text = f"от {salary_text['from']} {salary_text.get('currency', 'RUR')}"
            elif salary_text.get('to'):
                salary_text = f"до {salary_text['to']} {salary_text.get('currency', 'RUR')}"
            else:
                salary_text = "Не указана"
        
        vacancy_elem = ET.SubElement(vacancies_elem, 'vacancy')
        ET.SubElement(vacancy_elem, 'id').text = str(vacancy.get('id', ''))
        ET.SubElement(vacancy_elem, 'name').text = vacancy.get('name', '')
        ET.SubElement(vacancy_elem, 'salary').text = salary_text
        ET.SubElement(vacancy_elem, 'employer').text = vacancy.get('employer', '')
        ET.SubElement(vacancy_elem, 'area').text = vacancy.get('area', '')
        ET.SubElement(vacancy_elem, 'url').text = vacancy.get('url', '')
        ET.SubElement(vacancy_elem, 'snippet').text = vacancy.get('snippet', '')
        ET.SubElement(vacancy_elem, 'published_at').text = vacancy.get('published_at', '')
        ET.SubElement(vacancy_elem, 'schedule').text = vacancy.get('schedule', '')
        ET.SubElement(vacancy_elem, 'experience').text = vacancy.get('experience', '')
        ET.SubElement(vacancy_elem, 'employment').text = vacancy.get('employment', '')
    
    return ET.tostring(root, encoding='unicode', method='xml')

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

@router.post("/export/json")
async def export_vacancies_json(search: VacancySearch):
    """Экспорт вакансий в JSON формате"""
    try:
        # Получаем данные
        result = await get_vacancy_stats(search)
        
        # Получаем названия регионов
        areas_names = []
        for area_id in search.areas:
            try:
                area_name = await area_service.get_area_name(area_id)
                areas_names.append(area_name)
            except Exception as e:
                print(f"Ошибка при получении названия региона {area_id}: {str(e)}")
                areas_names.append(f"Регион {area_id}")
        
        # Добавляем метаданные
        export_data = {
            "metadata": {
                "query": search.query,
                "areas": areas_names,
                "export_date": datetime.now().isoformat(),
                "format": "json"
            },
            "statistics": result,
            "vacancies": result["vacancies"]
        }
        
        # Возвращаем JSON файл
        filename = f"вакансии_{search.query}_{'_'.join(areas_names)}.json"
        # Кодируем имя файла для безопасной передачи
        import urllib.parse
        encoded_filename = urllib.parse.quote(filename)
        
        return Response(
            content=json.dumps(export_data, ensure_ascii=False, indent=2),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
            }
        )
        
    except Exception as e:
        print(f"Ошибка при экспорте JSON: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export/csv")
async def export_vacancies_csv(search: VacancySearch):
    """Экспорт вакансий в CSV формате"""
    try:
        # Получаем данные
        result = await get_vacancy_stats(search)
        
        # Получаем названия регионов
        areas_names = []
        for area_id in search.areas:
            try:
                area_name = await area_service.get_area_name(area_id)
                areas_names.append(area_name)
            except Exception as e:
                print(f"Ошибка при получении названия региона {area_id}: {str(e)}")
                areas_names.append(f"Регион {area_id}")
        
        # Генерируем CSV - используем отформатированные вакансии
        csv_content = export_to_csv(result["vacancies"], result, search.query, areas_names)
        
        # Возвращаем CSV файл
        filename = f"вакансии_{search.query}_{'_'.join(areas_names)}.csv"
        import urllib.parse
        encoded_filename = urllib.parse.quote(filename)
        
        return Response(
            content=csv_content,
            media_type="text/csv; charset=utf-8",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
            }
        )
        
    except Exception as e:
        print(f"Ошибка при экспорте CSV: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export/xml")
async def export_vacancies_xml(search: VacancySearch):
    """Экспорт вакансий в XML формате"""
    try:
        # Получаем данные
        result = await get_vacancy_stats(search)
        
        # Получаем названия регионов
        areas_names = []
        for area_id in search.areas:
            try:
                area_name = await area_service.get_area_name(area_id)
                areas_names.append(area_name)
            except Exception as e:
                print(f"Ошибка при получении названия региона {area_id}: {str(e)}")
                areas_names.append(f"Регион {area_id}")
        
        # Генерируем XML
        xml_content = export_to_xml(result["vacancies"], result, search.query, areas_names)
        
        # Возвращаем XML файл
        filename = f"вакансии_{search.query}_{'_'.join(areas_names)}.xml"
        import urllib.parse
        encoded_filename = urllib.parse.quote(filename)
        
        return Response(
            content=xml_content,
            media_type="application/xml",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
            }
        )
        
    except Exception as e:
        print(f"Ошибка при экспорте XML: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ... rest of the code ... 