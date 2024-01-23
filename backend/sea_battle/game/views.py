from typing import Any
from django.http import HttpRequest, HttpResponse, HttpResponse as HttpResponse
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _



class GameView(TemplateView):
    template_name = "game/game_about.html"

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        request.session["game_id"] = int(kwargs.get("pk"))
        return super().get(request, *args, **kwargs)
