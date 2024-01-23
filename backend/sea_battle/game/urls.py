# urls.py
from django.urls import path
import game.views as views


app_name = "game"


urlpatterns = [
    path("about/<int:pk>", views.GameView.as_view(), name="about"),
    # Добавьте другие маршруты, если необходимо
]
