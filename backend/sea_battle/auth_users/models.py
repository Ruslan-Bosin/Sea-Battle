from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator
from django.contrib.auth.validators import UnicodeUsernameValidator

import secrets

class User(AbstractUser):
    """
    Extended User model from AbstractUser
    """

    username_validator = UnicodeUsernameValidator()
    email_validator = EmailValidator()

    username = models.CharField(
        _("username"),
        max_length=150,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        unique=False,
        blank=True,
    )

    email = models.EmailField(
        _("email address"),
        unique=True,
        error_messages={
            "unique": _("A user with that email already exists."),
        },
        validators=[email_validator],
    )

    games = models.ManyToManyField(
        "game.Game",
        related_name=_("игры"),
        help_text=_("игры в которых участвует пользователь"),
        blank=True
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class Admins(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name='admin'
    )

    class Meta:
        verbose_name = _("Админ")
        verbose_name_plural = _("Админы")


class UserActivityToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token:
            # Generate a unique token
            self.token = generate_unique_token()
        super().save(*args, **kwargs)
def generate_unique_token():
    #Необходимо нам тут сделать логичку создания токена. Как вариант снизу
    token = secrets.token_urlsafe(32)
    return token
    pass