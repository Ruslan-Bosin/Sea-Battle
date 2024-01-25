# Generated by Django 5.0.1 on 2024-01-25 21:24

import django.db.models.deletion
import game.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth_users", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="название поля",
                        max_length=16,
                        verbose_name="название",
                    ),
                ),
                (
                    "size",
                    models.IntegerField(help_text="размер поля", verbose_name="размер"),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        help_text="кто создал игру",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="created_games",
                        to="auth_users.admins",
                        verbose_name="создатель",
                    ),
                ),
            ],
            options={
                "verbose_name": "игра",
                "verbose_name_plural": "игры",
            },
        ),
        migrations.CreateModel(
            name="Prize",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "avatar",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to=game.models.prize_avatar_upload_path,
                        verbose_name="Avatar",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        help_text="кем создан приз?",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="created_prizes",
                        to="auth_users.admins",
                        verbose_name="создатель",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        help_text="каким пользователем получен приз",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prizes",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="обладатель",
                    ),
                ),
            ],
            options={
                "verbose_name": "приз",
                "verbose_name_plural": "призы",
            },
        ),
        migrations.CreateModel(
            name="Cell",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "coord",
                    models.IntegerField(
                        help_text="номер клетки на поле", verbose_name="номер"
                    ),
                ),
                (
                    "is_prize",
                    models.BooleanField(
                        default=False,
                        help_text="есть ли на клетке приз?",
                        verbose_name="приз",
                    ),
                ),
                (
                    "used",
                    models.BooleanField(
                        default=False,
                        help_text="был ли совершен выстрел на поле",
                        verbose_name="использовано",
                    ),
                ),
                (
                    "game",
                    models.ForeignKey(
                        help_text="к какой игре привязана клетка",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cells",
                        to="game.game",
                        verbose_name="игра",
                    ),
                ),
                (
                    "prize",
                    models.ForeignKey(
                        blank=True,
                        help_text="приз, который находится в клетке",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="cell",
                        to="game.prize",
                        verbose_name="приз",
                    ),
                ),
            ],
            options={
                "verbose_name": "клетка",
                "verbose_name_plural": "клетки",
            },
        ),
        migrations.CreateModel(
            name="Shots",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "quanity",
                    models.IntegerField(
                        help_text="количество выстрелов", verbose_name="количество"
                    ),
                ),
                (
                    "game",
                    models.ForeignKey(
                        help_text="игра в которой выстрелы можно использовать",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="shots",
                        to="game.game",
                        verbose_name="игра",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="пользователь который владеет выстрелом",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="shots",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="стрелок",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "выстрелы",
            },
        ),
    ]
