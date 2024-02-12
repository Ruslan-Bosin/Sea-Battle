from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from . import views

urlpatterns = [
    path("get_shots/", views.GetShots.as_view(), name="get_shots"),
    path("make_shot", views.MakeShot.as_view(), name="make_shot"),
    path("add_shots", views.AddShots.as_view(), name="add_shots"),
    path("delete_prize", views.DeletePrize.as_view(), name="delete_prize"),
    path("add_user_to_game", views.AddUser.as_view(), name="add_user"),
    path(
        "remove_user_from_game",
        views.RemoveClientFromGame.as_view(),
        name="remove_user",
    ),
    path("remove_game", views.RemoveGameView.as_view(), name="remove_game"),
    path("editfield", views.EditField.as_view(), name="editfield"),
    path("send_email", views.SendEmailView.as_view(), name="send_email"),
    path("get_cells_from_game", views.GetCellsFromGame.as_view(), name="get_cells"),
    path("get_prizes_from_game", views.GetPrizesFromGame.as_view(), name="get_prizes"),
    path("get_users_from_game", views.GetUsersFromGame.as_view(), name="get_users"),
    path(
        "get_game_info_admin", views.GetAllForInfoView.as_view(), name="get_game_info"
    ),
    path("token", views.CustomObtainTokenPairView.as_view(), name="token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register", views.CreateUserView.as_view(), name="register"),
    path("update_pass", views.UpdatePassUserView.as_view(), name="update_pass"),
    path("work_check", views.WorkCheck.as_view(), name="work_check"),
    path(
        "upload_prize_avatar/",
        views.PrizeUploadView.as_view(),
        name="upload_prize_avatar",
    ),
    path(
        "get_admin_created_games",
        views.AdminCreatedGamesView.as_view(),
        name="admin_created",
    ),
    path("get_user_games", views.GetUserGames.as_view(), name="user_games"),
    path("pass_reset", views.GetUserFromPassToken.as_view(), name="pass_reset"),
    path("token_check", views.CheckToken.as_view(), name="token_check"),
    path("get_user", views.GetUserFromToken.as_view(), name="get_user"),
    path(
        "update_quantity/", views.UpdateCellAfterShoot.as_view(), name="update_quantity"
    ),
    path("get_prize/", views.GetPrize.as_view(), name="get_prize"),
    path("send_email_token", views.SendEmailToken.as_view(), name="send_email"),
    path(
        "reset_email_token", views.ResetEmailToken.as_view(), name="reset_email_token"
    ),
    path("support-request/", views.SupportRequest.as_view(), name="support_request"),
    path("get_user_viewer/", views.GetUserInfoViewer.as_view(), name="user_viewer"),
    path("get_admin_viewer/", views.GetAdminInfoViewer.as_view(), name="admin_viewer"),
    path("update_username/", views.UpdateUsername.as_view(), name="update_username"),
    path("update_avatar/", views.UpdateUserAvatar.as_view(), name="update_avatar"),
    path("change_prize", views.ChangePrize.as_view(), name="change_prize"),
    path("create_field", views.CreateField.as_view(), name="create_field"),
    path("prize_list", views.GetUserPrizeList.as_view(), name="prize_list"),
    path(
        "prize_list_admin", views.GetAdminPrizeList.as_view(), name="prize_list_admin"
    ),
]
