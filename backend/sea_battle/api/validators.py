from django.core.validators import EmailValidator
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError



email_validator = EmailValidator(_("Введите корректный адрес электронной почты."))

def validate_email(value):
    try:
        email_validator(value)
    except:
        return True
    return False

def validate_password(value):
    # Пароль должен содержать не менее 8 символов
    if len(value) < 8:
        return True
    return False