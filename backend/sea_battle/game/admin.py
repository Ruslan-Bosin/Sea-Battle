from django.contrib import admin

import game.models


@admin.register(game.models.Game)
class GameAdmin(admin.ModelAdmin):
    pass


@admin.register(game.models.Prize)
class PrizeAdmin(admin.ModelAdmin):
    pass


@admin.register(game.models.Shots)
class ShotsAdmin(admin.ModelAdmin):
    pass


@admin.register(game.models.Cell)
class CellAdmin(admin.ModelAdmin):
    pass
