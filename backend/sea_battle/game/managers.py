from django.db import models


class ShotsManager(models.Manager):
    def get_shots_from_user_and_game(self, user_id, game_id):
        return self.get_queryset().filter(user=user_id, game=game_id)


class PrizesManager(models.Manager):
    def get_prizes_from_game(self, game_id):
        return self.get_queryset().filter(game=game_id)


class CellsManager(models.Manager):
    def get_cells_from_game(self, game_id):
        # print(game_id)
        return self.get_queryset().filter(game=game_id)
