from typing import List, Dict, Any
import httpx
import json
import os
from app.core.config import settings
import asyncio

class HHService:
    def __init__(self):
        self.base_url = settings.HH_API_URL
        self.timeout = settings.HH_API_TIMEOUT
        self.headers = {
            "User-Agent": "SkillPulse/1.0 (youngest@example.com)"
        }
        self.areas_cache_file = "areas_cache.json"
        self.areas_cache = self._load_areas_cache()

    def _load_areas_cache(self) -> Dict[str, Any]:
        """Загрузка кэша регионов из файла"""
        if os.path.exists(self.areas_cache_file):
            try:
                with open(self.areas_cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Ошибка при загрузке кэша регионов: {str(e)}")
        return {}

    def _save_areas_cache(self, areas: Dict[str, Any]):
        """Сохранение кэша регионов в файл"""
        try:
            with open(self.areas_cache_file, 'w', encoding='utf-8') as f:
                json.dump(areas, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Ошибка при сохранении кэша регионов: {str(e)}")

    async def get_areas(self) -> List[Dict]:
        """Получение списка регионов"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(f"{self.base_url}/areas")
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Ошибка при получении регионов: {str(e)}")
                raise

    def calculate_salary_ranges(self, vacancies: List[dict]) -> dict:
        """Рассчитывает распределение зарплат по диапазонам"""
        salary_ranges = {
            '0-50000': 0,
            '50000-100000': 0,
            '100000-150000': 0,
            '150000-200000': 0,
            '200000-250000': 0,
            '250000-300000': 0,
            '300000+': 0
        }
        
        print("Calculating salary ranges for", len(vacancies), "vacancies")  # Отладочная информация
        
        for v in vacancies:
            if not v.get('salary'):
                continue
                
            salary = v['salary']
            if salary.get('from') is not None:
                amount = salary['from']
            elif salary.get('to') is not None:
                amount = salary['to']
            else:
                continue
                
            print(f"Processing salary: {amount}")  # Отладочная информация
                
            if amount < 50000:
                salary_ranges['0-50000'] += 1
            elif amount < 100000:
                salary_ranges['50000-100000'] += 1
            elif amount < 150000:
                salary_ranges['100000-150000'] += 1
            elif amount < 200000:
                salary_ranges['150000-200000'] += 1
            elif amount < 250000:
                salary_ranges['200000-250000'] += 1
            elif amount < 300000:
                salary_ranges['250000-300000'] += 1
            else:
                salary_ranges['300000+'] += 1
        
        print("Final salary ranges:", salary_ranges)  # Отладочная информация
        return salary_ranges

    async def search_vacancies(self, query: str, areas: List[int], per_page: int = 100) -> List[Dict]:
        """Поиск вакансий по запросу и регионам"""
        print(f"\nПоиск вакансий: {query} в регионах {areas}")
        
        all_vacancies = []
        seen_ids = set()  # Множество для отслеживания уникальных ID вакансий
        page = 0
        total_pages = 1  # Будет обновлено после первого запроса
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                while page < total_pages:
                    # Формируем параметры запроса
                    params = {
                        'text': query,
                        'per_page': per_page,
                        'page': page,
                        'area': areas,
                        'describe_arguments': 'true'
                    }
                    
                    print(f"Запрос страницы {page + 1}, параметры: {params}")
                    
                    # Делаем запрос к API
                    response = await client.get(f"{self.base_url}/vacancies", params=params)
                    response.raise_for_status()
                    
                    data = response.json()
                    
                    # Получаем общее количество страниц
                    if page == 0:
                        total_pages = min(data.get('pages', 1), 20)  # Ограничиваем 20 страницами (2000 вакансий)
                        print(f"Всего страниц: {total_pages}")
                    
                    # Добавляем только уникальные вакансии
                    vacancies = data.get('items', [])
                    for vacancy in vacancies:
                        vacancy_id = vacancy.get('id')
                        if vacancy_id and vacancy_id not in seen_ids:
                            seen_ids.add(vacancy_id)
                            all_vacancies.append(vacancy)
                    
                    print(f"Получено вакансий на странице {page + 1}: {len(vacancies)}")
                    print(f"Уникальных вакансий после обработки страницы: {len(all_vacancies)}")
                    
                    # Увеличиваем номер страницы
                    page += 1
                    
                    # Добавляем небольшую задержку между запросами
                    if page < total_pages:
                        await asyncio.sleep(0.25)
                
                print(f"Всего получено уникальных вакансий: {len(all_vacancies)}")
                return all_vacancies
                
            except Exception as e:
                print(f"Ошибка при поиске вакансий: {str(e)}")
                raise

    # ... rest of the code ... 