# Инструкция для запуска проекта: 👨‍🦯👨‍🦯👨‍🦯

1. Склонируйте репозиторий с github
2. Откройте две консоли (используйте bash для backend на macOS)
3. **Установка backend:** (используйте bash консоль) 
    - Перейдите в папку frontend: `cd backend`
    - Создайте виртуальное окружение: `python -m venv venv` (используйте python3 на macOS)
    - Перейдите в venv: `cd venv`
    - Активируйте venv: `Scripts\activate.bat` на windows или `source bin/activate` на macOS
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

> * Рекомендовано использовать python 3.10
> * Если используете macOS: убедитесь, что активировали `Install Certificates.command` в папке с python, чтобы избежать ошибки ssl
> * По любым вопросам вы поможете написать нам: https://t.me/SoCuteBoy
> * Документация по проекту: https://docs.google.com/document/d/1Rd32M7F_dqbrQk0Sqa67o7z2g6YrQA0n/edit?usp=sharing&ouid=106435258248534397148&rtpof=true&sd=true
> * Видео работы на площадке ВК: https://vk.com/video358414591_456239051?list=ln-zksE4mVK4XzHMYeEOR
> * Видео работы на площадке YouTube: https://youtu.be/SCWPPOLr_eI
