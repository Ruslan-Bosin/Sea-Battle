from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from . import views

urlpatterns = [
    path("get_shots/", views.GetShots.as_view()),
    path("make_shot", views.MakeShot.as_view()),
    path("add_shots", views.AddShots.as_view()),
    path("delete_prize", views.DeletePrize.as_view()),
    path("send_email", views.SendEmailView.as_view()),
    path("get_cells_from_game", views.GetCellsFromGame.as_view()),
    path("token", views.CustomObtainTokenPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', views.CreateUserView.as_view()),
    path("work_check", views.WorkCheck.as_view()),
    path('reset-password/request/', views.PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('upload_avatar/', views.UploadAvatarView.as_view(), name='upload_avatar'),
    path('upload_prize_avatar/', views.PrizeUploadView.as_view(), name='upload_prize_avatar'),
    path("get_admin_created_games", views.AdminCreatedGamesView.as_view()),
    path("get_user_games", views.GetUserGames.as_view()),
    path("pass_reset", views.GetUserFromPassToken.as_view()),
    path("token_check", views.CheckToken.as_view()),
    path("get_user", views.GetUserFromToken.as_view())
]
