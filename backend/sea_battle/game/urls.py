# urls.py
from django.urls import path
import game.views as views


app_name = "game"


urlpatterns = [
    path("prize_image/<int:prize_id>", views.GetImageByPrize.as_view(), name="image"),
    path("about/<int:pk>", views.GameView.as_view(), name="about"),
    # Добавьте другие маршруты, если необходимо
]
