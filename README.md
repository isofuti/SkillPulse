# SkillPulse

SkillPulse - это аналитическая платформа для HR-специалистов, предоставляющая актуальные данные о рынке труда в реальном времени.

## О проекте

SkillPulse - единственный российский инструмент, который показывает пульс рынка труда с обновлением каждый час и возможностью настроить Telegram-уведомления.

### Миссия
Сделать аналитику рынка труда доступной и актуальной для всех, кто занимается наймом, обучением или управлением персоналом.

### Ценности
- 📊 **Актуальность** - Обновление данных каждый час
- ⚙️ **Простота** - Минимум действий — максимум пользы
- 🚀 **Скорость** - Мгновенные алерты и быстрые отчёты

### Целевая аудитория
- Рекрутинговые агентства
- HR-отделы компаний
- IT-стартапы
- Онлайн-школы (EdTech)

## Технологии

### Frontend
- React 18
- Material-UI 5
- React Router 6
- Styled Components
- Emotion

### Backend
- FastAPI
- Python 3.9+
- PostgreSQL
- Redis

## Установка и запуск

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

## Функциональность

### Анализ рынка труда
- Мониторинг вакансий в реальном времени
- Анализ трендов и зарплат
- Региональная статистика
- Прогнозы развития

### Интеграции
- Telegram-уведомления
- Экспорт в PDF и CSV
- API для внешних систем

## Структура проекта

```
skillpulse/
├── frontend/           # React приложение
│   ├── src/
│   │   ├── assets/    # Статические ресурсы
│   │   ├── components/# React компоненты
│   │   ├── pages/     # Страницы приложения
│   │   └── App.js     # Корневой компонент
│   └── public/        # Публичные файлы
└── backend/           # FastAPI приложение
    ├── app/
    │   ├── api/      # API endpoints
    │   ├── core/     # Ядро приложения
    │   └── models/   # Модели данных
    └── main.py       # Точка входа
```

## Лицензия

MIT

## Контакты

- Email: info@skillpulse.ru
- Telegram: @skillpulse
- Website: https://skillpulse.ru 