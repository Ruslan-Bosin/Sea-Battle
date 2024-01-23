from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import (
    LoginView,
    PasswordChangeView,
    PasswordChangeDoneView,
    PasswordResetCompleteView,
)
from django.http import HttpResponse
from django.views.generic import FormView, TemplateView
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _


import auth_users.forms



class CheckTokenView(TemplateView):
    template_name = "auth_users/check_token.html"


class MyLoginView(LoginView):
    form_class = auth_users.forms.LoginForm
    template_name = "auth_users/login.html"
    # success_url = reverse_lazy('authorisation:signup_done')

    def form_valid(self, form: AuthenticationForm) -> HttpResponse:
        return super().form_valid(form)


class MyPasswordChangeView(PasswordChangeView):
    form_class = auth_users.forms.PasswordChangeForm
    template_name = "auth_users/change_password.html"


class MyChangePasswordDone(PasswordChangeDoneView):
    template_name = "auth_users/done.html"

    def get_context_data(self, **kwargs):
        context = super(MyChangePasswordDone, self).get_context_data(**kwargs)
        context["alerts"] = [{"type": "success", "text": _("Пароль успешно изменён")}]
        return context


class MyPasswordResetComplete(PasswordResetCompleteView):
    template_name = "auth_users/done.html"

    def get_context_data(self, **kwargs):
        context = super(MyPasswordResetComplete, self).get_context_data(**kwargs)
        context["alerts"] = [{"type": "success", "text": _("Пароль успешно изменён")}]
        return context


class MyChangePasswordDone(PasswordChangeDoneView):
    """
    Custom password change form

    Returns form that allows user change his password
    """

    template_name = "authorisation/done.html"

    def get_context_data(self, **kwargs):
        context = super(MyChangePasswordDone, self).get_context_data(**kwargs)
        context["alerts"] = [{"type": "success", "text": _("Пароль успешно изменён")}]
        return context


class SignUp(FormView):
    template_name = "auth_users/signup.html"
    form_class = auth_users.forms.SignUpForm
    success_url = reverse_lazy("authorisation:signup_done")


class SignUpDone(TemplateView):
    """Sends confirmation url address"""

    template_name = "auth_users/done.html"

    def get_context_data(self, **kwargs):
        context = super(SignUpDone, self).get_context_data(**kwargs)
        context["alerts"] = [
            {
                "type": "success",
                "text": _("Аккаунт создан! Спасибо!"),
            }
        ]
        return context
