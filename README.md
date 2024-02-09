# Инструкция для запуска проекта: 👨‍🦯👨‍🦯👨‍🦯
(рекомендовано использовать python 3.10)

1. Склонируйте репозиторий с github
2. Откройте две консоли (используйте bash для backend на macOS)
3. **Установка backend:** (используйте bash консоль) 
    - Перейдите в папку frontend: `cd backend`
    - Создайте виртуальное окружение: `python -m venv venv` (используйте python3 на macOS)
    - Перейдите в venv: `cd venv`
    - Активируйте venv: `source bin/activate`
    - Перейдите обратно в папку frontend: `cd ..`
    - Установите зависимости: `pip install -r requirements.txt` (используйте pip3 на macOS)
    - Перейдите в sea_battle: `cd sea_battle`
    - Создайте базу данных: `python manage.py makemigrations`, далее: `python manage.py migrate`
    - Запустите сервер: `python manage.py runserver`
4. **Установка frontend:** (используйте вторую консоль)
    - Перейдите в папку backend: `cd frontend`
    - Установите зависимости: `npm install` (полсе установки должно быть написано 8 vulnerabilities, это нормально, ничего предпринимать не нужно)
    - Запустите сервер: `npm start` (в первый раз сервер запускается около минуты)
5. Всё готово! Наслаждайтесь 🤤🤤🤤
