# Generated by Django 5.0.1 on 2024-02-12 11:40

import auth_users.utils
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("auth_users", "0003_checkemailtoken"),
    ]

    operations = [
        migrations.CreateModel(
            name="ResetEmailTokenModels",
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
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="почта"
                    ),
                ),
                (
                    "token",
                    models.UUIDField(
                        default=uuid.uuid4, verbose_name="код восстановления"
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Дата и время создания"
                    ),
                ),
                (
                    "expire",
                    models.DateTimeField(
                        default=auth_users.utils.get_token_expire,
                        verbose_name="Дата и время истечения",
                    ),
                ),
            ],
        ),
    ]
