from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


import auth_users.models
import game.models

User = get_user_model()


class SendEmailViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_send_email(self):
        url = reverse("send_email")
        data = {
            "subject": "Test Subject",
            "email": "recipient@example.com",
            "message": "Test Message",
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # self.asserteq
        # Добавьте проверки на ожидаемые результаты


class GetPrizeTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.user_1 = User.objects.create_user(
            email="testadmin@mail.com", username="testadmin", password="testpassword"
        )
        self.admin = auth_users.models.Admins.objects.create(user=self.user_1)
        self.game = game.models.Game.objects.create(
            size=4, name="test", description="test", created_by=self.admin
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_get_prize(self):
        url = reverse("get_prize")
        data = {"coord": 1, "game_id": self.game.id}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.get(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class SupportRequestTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_support_request(self):
        url = reverse("support_request")
        data = {
            "mail": "support@example.com",
            "description": "Test support request description",
        }

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.post(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class GetUserInfoViewerTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_get_user_info_viewer(self):
        url = reverse("user_viewer")
        data = {"game_id": 1}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.get(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class GetAdminInfoViewerTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )

        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_get_admin_info_viewer(self):
        url = reverse("admin_viewer")
        data = {"game_id": 1}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.get(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class UpdateUsernameTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_update_username(self):
        url = reverse("update_username")
        data = {"new_username": "newusername"}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.post(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Добавьте проверки на ожидаемые результаты


class CreateFieldTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_create_field(self):
        url = reverse("create_field")
        data = {"size": 10, "name": "New Field", "description": "Field Description"}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.post(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Добавьте проверки на ожидаемые результаты


class GetUserPrizeListTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_get_user_prize_list(self):
        url = reverse("prize_list")
        data = {"sortValue": "alphabet", "filterValue": "1"}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.get(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class GetAdminPrizeListTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def tearDown(self):
        User.objects.all().delete()

    def test_get_admin_prize_list(self):
        url = reverse("prize_list_admin")
        data = {"sortValue": "alphabet", "filterValue": "won"}

        headers = {"Authorization": f"Bearer {self.token}"}

        response = self.client.get(url, data, format="json", headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Добавьте проверки на ожидаемые результаты


class AdminCreatedGamesViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@mail.com", username="testuser", password="testpassword"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.admin = auth_users.models.Admins.objects.create(user=self.user)
        self.game = game.models.Game.objects.create(
            created_by=self.admin, size=3, name="test", description="test"
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_admin_created_games_view_success(self):
        url = reverse("admin_created")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get(url, format="json", headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
