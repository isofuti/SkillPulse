from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.vacancies import router as vacancies_router
from app.api.areas import router as areas_router

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене заменить на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(vacancies_router, prefix="/api/vacancies", tags=["vacancies"])
app.include_router(areas_router, prefix="/api/areas", tags=["areas"])

@app.get("/")
async def root():
    return {"message": "SkillPulse API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "SkillPulse API is running"} 