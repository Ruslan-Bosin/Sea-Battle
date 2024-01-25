from collections.abc import Iterable
from django.db import models
from django.utils.translation import gettext_lazy as _


import auth_users.models
import game.managers
import os


class Game(models.Model):
    size = models.IntegerField(
        verbose_name=_("размер"),
        help_text=_("размер поля"),
    )
    created_by = models.ForeignKey(
        verbose_name=_("создатель"),
        help_text=_("кто создал игру"),
        to=auth_users.models.Admins,
        related_name="created_games",
        null=True,
        on_delete=models.SET_NULL,
    )

    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)
        for i in range(1, self.size ** 2 + 1):
                Cell.objects.create(game=self, coord=i)

    class Meta:
        verbose_name = _("игра")
        verbose_name_plural = _("игры")



def prize_avatar_upload_path(instance, filename):
    return os.path.join("prize_avatars", filename)


class Prize(models.Model):
    objects = game.managers.PrizesManager()

    user = models.ForeignKey(
        verbose_name=_("обладатель"),
        help_text=_("каким пользователем получен приз"),
        to=auth_users.models.User,
        related_name="prizes",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    created_by = models.ForeignKey(
        verbose_name=_("создатель"),
        help_text=_("кем создан приз?"),
        to=auth_users.models.Admins,
        related_name="created_prizes",
        on_delete=models.SET_NULL,
        null=True,
    )
    avatar = models.ImageField(_("Avatar"), upload_to=prize_avatar_upload_path, blank=True, null=True)

    class Meta:
        verbose_name = _("приз")
        verbose_name_plural = _("призы")


class Shots(models.Model):
    objects = game.managers.ShotsManager()
    quanity = models.IntegerField(
        verbose_name=_("количество"),
        help_text=_("количество выстрелов"),
    )
    user = models.ForeignKey(
        verbose_name=_("стрелок"),
        help_text=_("пользователь который владеет выстрелом"),
        to=auth_users.models.User,
        related_name="shots",
        on_delete=models.CASCADE,
    )
    game = models.ForeignKey(
        verbose_name=_("игра"),
        help_text=_("игра в которой выстрелы можно использовать"),
        related_name="shots",
        to=Game,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name_plural = _("выстрелы")


class Cell(models.Model):
    objects = game.managers.CellsManager()
    game = models.ForeignKey(
        verbose_name=_("игра"),
        help_text=_("к какой игре привязана клетка"),
        to=Game,
        related_name="cells",
        on_delete=models.CASCADE,
    )

    coord = models.IntegerField(
        verbose_name=_("номер"),
        help_text=_("номер клетки на поле")
    )
    is_prize = models.BooleanField(
        verbose_name=_("приз"), help_text=_("есть ли на клетке приз?"), default=False
    )
    used = models.BooleanField(
        verbose_name=_("использовано"),
        help_text=_("был ли совершен выстрел на поле"),
        default=False,
    )
    prize = models.ForeignKey(
        to=Prize,
        verbose_name=_("приз"),
        help_text=_("приз, который находится в клетке"),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="cell",
    )

    class Meta:
        verbose_name = _("клетка")
        verbose_name_plural = _("клетки")
