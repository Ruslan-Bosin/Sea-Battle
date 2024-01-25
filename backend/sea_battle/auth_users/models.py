from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
import os

def user_avatar_upload_path(instance, filename):
    return os.path.join("user_avatars", filename)

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

