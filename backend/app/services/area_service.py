from typing import List, Dict
import httpx
from app.core.config import settings

class AreaService:
    def __init__(self):
        self.base_url = settings.HH_API_URL
        self.timeout = settings.HH_API_TIMEOUT

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