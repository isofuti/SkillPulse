# HR SkillPulse

Аналитическая платформа для HR-специалистов, позволяющая анализировать рынок вакансий и получать инсайты о востребованных навыках.

## Функциональность

- 🔍 Поиск вакансий по ключевым словам и регионам
- 📊 Анализ распределения зарплат
- 📈 Визуализация требований к навыкам
- 🎯 Облако слов из описаний вакансий
- 📋 Детальная информация о каждой вакансии
- 💾 Сохранение истории поиска
- 📊 Сравнение зарплат по регионам
- 📈 Анализ трендов на рынке труда

## Технологии

### Backend
- FastAPI
- Python 3.11+
- PostgreSQL
- SQLAlchemy + Alembic
- HH API для получения данных о вакансиях
- Matplotlib для визуализации
- WordCloud для создания облака слов
- Docker

### Frontend
- React
- Material-UI
- Chart.js
- React Word Cloud
- Docker

## Установка и запуск

### Через Docker (рекомендуется)

1. Установите Docker и Docker Compose

2. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/hr-skillpulse.git
cd hr-skillpulse
```

3. Запустите приложение:
```bash
docker compose up -d
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Локальная разработка

#### Backend

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
```

2. Установите зависимости:
```bash
cd backend
pip install -r requirements.txt
```

3. Создайте файл `.env` в директории `backend`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_skillpulse
HH_API_URL=https://api.hh.ru
HH_API_TIMEOUT=30
```

4. Примените миграции:
```bash
alembic upgrade head
```

5. Запустите сервер:
```bash
uvicorn app.main:app --reload
```

#### Frontend

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Запустите приложение:
```bash
npm start
```

## Структура проекта

```
hr-skillpulse/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `GET /api/areas` - Получение списка регионов
- `POST /api/vacancies/stats` - Получение статистики по вакансиям
  - Параметры:
    - `query`: поисковый запрос
    - `areas`: список ID регионов
- `GET /api/vacancies/history` - Получение истории поиска
- `POST /api/vacancies/compare` - Сравнение зарплат по регионам
- `GET /api/vacancies/trends` - Получение трендов на рынке труда

## База данных

Проект использует PostgreSQL. Для локальной разработки база данных запускается в Docker контейнере.

Параметры подключения:
- Host: localhost
- Port: 5432
- Database: hr_skillpulse
- Username: postgres
- Password: postgres

## Планы по развитию

- [ ] Добавление фильтров по опыту работы
- [ ] Анализ требований к образованию
- [ ] Экспорт данных в Excel
- [ ] Уведомления о новых вакансиях
- [ ] Интеграция с другими job-агрегаторами
- [ ] Система рекомендаций вакансий
- [ ] Анализ конкурентов
- [ ] Генерация отчетов 