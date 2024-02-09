"""
ASGI config for sea_battle project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.urls import path
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from sea_battle.consumers import CellConsumer, NewGameConsumer



os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sea_battle.settings")

websocket_urlpatterns = [
    path("ws/cell_update/<int:FieldID>", CellConsumer.as_asgi()),
    path("ws/user/new_game/<int:userID>", NewGameConsumer.as_asgi())
]


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
