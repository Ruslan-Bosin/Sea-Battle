from django.core.validators import EmailValidator
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError



email_validator = EmailValidator(_("Введите корректный адрес электронной почты."))

def validate_email(value: str):
    try:
        email_validator(value)
    except:
        return True
    return False

def validate_password(value: str):
    if len(value) <= 8:
        return (True, "Длина пароля должна быть больше 8")
    elif value.lower() == value:
        return (True, "Пароль должен содержать как заглавные, так и строчные буквы")
    elif not any([e.isdigit() for e in value]):
        return (True, "Пароль должен содержать цифры")
    return (False, "ok")
