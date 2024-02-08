from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.conf import settings
from pytz import timezone, utc
from datetime import datetime
import uuid
import os


import auth_users.utils


def user_avatar_upload_path(instance, filename):
    return os.path.join("user_avatars", filename)
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
        related_name="users",
        help_text=_("игры в которых участвует пользователь"),
        blank=True
    )
    avatar = models.ImageField(_("Avatar"), upload_to=user_avatar_upload_path, blank=True, null=True)
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


class CheckEmailToken(models.Model):
    email = models.EmailField(verbose_name=_('почта'), unique=True)
    token = models.UUIDField(verbose_name=_('код активации'), default=uuid.uuid4)
    created = models.DateTimeField(
        verbose_name=_('Дата и время создания'),
        auto_now_add=True,
    )

    expire = models.DateTimeField(
        verbose_name=_('Дата и время истечения'),
        default=auth_users.utils.get_token_expire,
    )

    def expired(self) -> bool:
        tz = timezone(settings.TIME_ZONE)
        expire = self.expire.replace(tzinfo=utc).astimezone(tz)
        exp = expire < datetime.now(tz=tz)
        if exp:
            self.delete()
        return exp