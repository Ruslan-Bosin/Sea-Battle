from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import (
    LoginView,
    PasswordChangeView,
    PasswordChangeDoneView,
    PasswordResetCompleteView,
)
from django.http import Http404
from django.http import HttpResponse
from django.views import View
from django.views.generic import FormView, TemplateView
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _


import auth_users.forms
import auth_users.models
import game.models



class GetImageByUser(View):
    def get(self, request, user_id):
        user = auth_users.models.User.objects.filter(id=user_id).first()
        print(user)
        print(user.avatar)
        if user is None:
            raise Http404("User does not exist")
        if user.avatar:
            print(user.avatar.path)    
            # Открываем изображение и читаем его содержимое
            with open(user.avatar.path, 'rb') as image_file:
                image_data = image_file.read()

            # Отправляем содержимое изображения в HTTP-ответе
            return HttpResponse(image_data, content_type='image/jpeg')  # Измените content_type по необходимости
        return HttpResponse("no image")


class GetImageByPrize(View):
    def get(self, request, prize_id):
        prize = game.models.Prize.objects.filter(id=prize_id).first()
        if prize is None:
            raise Http404("Prize does not exists")
        
        with open(prize.avatar.path, 'rb') as image_file:
            image_data = image_file.read()

        # Отправляем содержимое изображения в HTTP-ответе
        return HttpResponse(image_data, content_type='image/jpeg')  # Измените content_type по необходимости


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
