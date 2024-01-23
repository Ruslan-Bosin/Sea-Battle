import django.contrib.auth.forms as default_forms
import django.contrib.auth.models as default_models
from django.contrib.auth import get_user_model
from django import forms
from django.utils.translation import gettext_lazy as _

from auth_users import models

User = get_user_model()


class LoginForm(default_forms.AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields[
            "username"
        ].widget = (
            forms.TextInput()
        )  #            attrs={'class': 'form-control form-control-lg mb-2', 'placeholder': _('Username'),}
        self.fields[
            "password"
        ].widget = (
            forms.TextInput()
        )  #             attrs={'class': 'form-control form-control-lg mb-2', 'placeholder': _('Username'),}


class PasswordChangeForm(default_forms.PasswordChangeForm):
    pass


class PasswordResetForm(default_forms.PasswordResetForm):
    pass


class PasswordResetConfirmForm(default_forms.SetPasswordForm):
    pass


class SignUpForm(default_forms.UserCreationForm):
    email = forms.EmailField(
        label=_("Ваш email"),
        widget=forms.EmailInput(),
    )

    def clean_email(self):
        """Checks email to unique"""
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(_("Этот email уже используется"))
        return email

    # def save(self, commit: bool = True) -> models.ActivationToken:
    #     """set extra fields to user."""
    #     return

    class Meta:
        model = User
        fields = [
            User.email.field.name,
            User.username.field.name,
            f"{User.password.field.name}1",
            f"{User.password.field.name}2",
        ]
