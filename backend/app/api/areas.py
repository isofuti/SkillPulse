from fastapi import APIRouter, HTTPException
from typing import List
from app.services.area_service import AreaService

router = APIRouter()
area_service = AreaService()

@router.get("/")
async def get_areas() -> List[dict]:
    """Получение списка регионов"""
    try:
        print("Получение списка регионов")
        areas = await area_service.get_areas()
        print(f"Получено регионов: {len(areas)}")
        return areas
    except Exception as e:
        print(f"Ошибка при получении регионов: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 