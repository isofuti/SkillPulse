from typing import List, Dict
import httpx
import json
import os
from app.core.config import settings

class AreaService:
    def __init__(self):
        self.base_url = settings.HH_API_URL
        self.timeout = settings.HH_API_TIMEOUT
        self.areas_cache_file = "areas_cache.json"
        self.areas_cache = self._load_areas_cache()

    def _load_areas_cache(self) -> List[Dict]:
        """Загрузка кэша регионов из файла"""
        if os.path.exists(self.areas_cache_file):
            try:
                with open(self.areas_cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Убеждаемся, что это список
                    if isinstance(data, list):
                        return data
                    else:
                        print("Кэш регионов имеет неправильный формат")
                        return []
            except Exception as e:
                print(f"Ошибка при загрузке кэша регионов: {str(e)}")
        return []

    def _find_area_by_id(self, area_id: int, areas: List[Dict]) -> str:
        """Рекурсивный поиск региона по ID"""
        for area in areas:
            if str(area.get('id')) == str(area_id):
                return area.get('name', 'Неизвестный регион')
            if area.get('areas'):
                result = self._find_area_by_id(area_id, area['areas'])
                if result != 'Неизвестный регион':
                    return result
        return 'Неизвестный регион'

    async def get_areas(self) -> List[Dict]:
        """Получение списка регионов с HH API"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(f"{self.base_url}/areas")
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Ошибка при получении регионов: {str(e)}")
                raise

    async def get_area_name(self, area_id: int) -> str:
        """Получение названия региона по ID"""
        try:
            # Сначала ищем в кэше
            if self.areas_cache and len(self.areas_cache) > 0:
                area_name = self._find_area_by_id(area_id, self.areas_cache)
                if area_name != 'Неизвестный регион':
                    return area_name
            
            # Если не найдено в кэше, загружаем свежие данные
            areas = await self.get_areas()
            self.areas_cache = areas
            
            # Сохраняем в кэш
            try:
                with open(self.areas_cache_file, 'w', encoding='utf-8') as f:
                    json.dump(areas, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Ошибка при сохранении кэша регионов: {str(e)}")
            
            return self._find_area_by_id(area_id, areas)
            
        except Exception as e:
            print(f"Ошибка при получении названия региона {area_id}: {str(e)}")
            return f"Регион {area_id}" 