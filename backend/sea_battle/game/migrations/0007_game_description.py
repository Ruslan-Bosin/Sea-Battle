# Generated by Django 5.0.1 on 2024-02-12 15:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("game", "0006_shots_touched"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="description",
            field=models.TextField(
                default="",
                help_text="описани поля",
                max_length=1200,
                verbose_name="описание",
            ),
        ),
    ]
