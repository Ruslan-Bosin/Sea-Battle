from typing import Any
from django.http import HttpRequest, HttpResponse, HttpResponse as HttpResponse
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views import View
from django.http import Http404



import game.models


class GetImageByPrize(View):
    def get(self, request, prize_id):
        prize = game.models.Prize.objects.filter(id=prize_id).first()
        if prize is None:
            raise Http404("Prize does not exists")
        if prize.avatar:        
            with open(prize.avatar.path, 'rb') as image_file:
                image_data = image_file.read()

            # Отправляем содержимое изображения в HTTP-ответе
            return HttpResponse(image_data, content_type='image/jpeg')  # Измените content_type по необходимости
        return HttpResponse("no image")


class GameView(TemplateView):
    template_name = "game/game_about.html"

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        request.session["game_id"] = int(kwargs.get("pk"))
        return super().get(request, *args, **kwargs)
