from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.vacancies import router as vacancies_router
from app.api.areas import router as areas_router

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://testskillpulse.netlify.app",
        "https://skillpulse.netlify.app",
        "https://*.netlify.app",
        "https://*.onrender.com",
        "*"  # Временно разрешаем все домены для отладки
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

@app.options("/api/vacancies/stats")
async def options_vacancies_stats():
    return {"message": "CORS preflight successful"} 