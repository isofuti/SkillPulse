# HR SkillPulse

HR SkillPulse - это современная система анализа вакансий и навыков для HR-специалистов.

## Возможности

- Анализ вакансий и требований к кандидатам
- Визуализация данных с помощью графиков и диаграмм
- Генерация отчетов в PDF формате
- Поиск и фильтрация вакансий
- Анализ трендов на рынке труда

## Технологии

### Frontend
- React 18
- Material-UI
- Chart.js для графиков
- D3.js для визуализации данных
- PDFMake для генерации PDF-отчетов
- React Router для навигации

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas для анализа данных
- NLTK для обработки текста

## Установка и запуск

### Требования
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

## Структура проекта

```
hr-skillpulse/
├── frontend/           # React приложение
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── pages/     # Страницы приложения
│   │   └── utils/     # Вспомогательные функции
│   └── package.json
│
└── backend/           # FastAPI приложение
    ├── app/
    │   ├── models/    # Модели данных
    │   ├── routes/    # API endpoints
    │   └── services/  # Бизнес-логика
    └── requirements.txt
```

## Генерация отчетов

Система поддерживает генерацию PDF-отчетов со следующими возможностями:
- Текстовые данные с поддержкой кириллицы
- Таблицы с данными
- Графики и диаграммы
- Облако тегов
- Автоматическое форматирование

## Лицензия

MIT 