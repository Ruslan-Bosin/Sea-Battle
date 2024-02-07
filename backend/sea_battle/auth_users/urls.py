import django.contrib.auth.views as default_views
import django.urls

import auth_users.forms as auth_forms
import auth_users.views as auth_views

app_name = "authorisation"

urlpatterns = [
    django.urls.path("user_image/<int:user_id>", auth_views.GetImageByUser.as_view(), name="image"),
    django.urls.path("check_token/", auth_views.CheckTokenView.as_view()),
    django.urls.path(
        "login/",
        auth_views.MyLoginView.as_view(),
        name="login",
    ),
    django.urls.path(
        "logout/",
        default_views.LogoutView.as_view(
            template_name="base.html",
        ),
        name="logout",
    ),
    django.urls.path(
        "password_change/",
        default_views.PasswordChangeView.as_view(
            template_name="auth_users/password_change.html",
            form_class=auth_forms.PasswordChangeForm,
        ),
        name="password_change",
    ),
    django.urls.path(
        "password_change/done/",
        auth_views.MyChangePasswordDone.as_view(),
        name="password_change_done",
    ),
    django.urls.path(
        "password_reset/",
        default_views.PasswordResetView.as_view(
            template_name="auth_users/password_reset.html",
            form_class=auth_forms.PasswordResetForm,
        ),
        name="password_reset",
    ),
    django.urls.path(
        "reset/done/",
        auth_views.MyPasswordResetComplete.as_view(),
        name="password_reset_complete",
    ),
    django.urls.path(
        "signup/",
        auth_views.SignUp.as_view(),
        name="signup",
    ),
    django.urls.path(
        "signup/done", auth_views.SignUpDone.as_view(), name="signup_done"
    ),
]
