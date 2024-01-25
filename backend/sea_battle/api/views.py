from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.db.models import Count, Q, Sum
from rest_framework import status
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import get_object_or_404

import api.serializers
import game.models
import auth_users.models


class CheckToken(APIView):
    def get(sel, request, *args, **kwargs):
        return Response({"message": "done"})


class WorkCheck(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "it works"})

    def post(self, request, *args, **kwargs):
        resp = request.data
        resp["message"] = "works"
        print(resp)
        return Response(resp)


class CreateUserView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        admin_code = request.data.get('admin_code')

        if username is None or email is None or password is None:
            return Response({'error': 'This url have 3 required params: username, email, password'})

        if len(auth_users.models.User.objects.filter(email=email)) != 0:
            return Response({'error': 'user with this email is already exists'})

        password = make_password(password)

        if admin_code == settings.ADMIN_CODE:
            user = auth_users.models.User.objects.create(username=username, email=email, password=password)
            admin = auth_users.models.Admins.objects.create(user=user)
            admin.save()
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = api.serializers.CustomTokenObtainPairSerializer.get_token(user)
            response_data = {
                'access_token': str(access_token),
                'refresh_token': str(refresh),
            }
        else:
            user = auth_users.models.User.objects.create(username=username, email=email, password=password)
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = api.serializers.CustomTokenObtainPairSerializer.get_token(user)
            response_data = {
                'access_token': str(access_token),
                'refresh_token': str(refresh),
            }
        return Response(response_data, status=status.HTTP_201_CREATED)


class CustomObtainTokenPairView(TokenObtainPairView):
    serializer_class = api.serializers.CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if email is None or password is None:
            return Response({'error': 'Both email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        print(user)
        if user is not None:
            response = super(CustomObtainTokenPairView, self).post(request, *args, **kwargs)
            refresh = RefreshToken.for_user(user)
            response.data['refresh'] = str(refresh)
            # response.data['access'] = str(api.serializers.CustomTokenObtainPairSerializer.get_token(user))
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



class AdminCreatedGamesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        admin_id = request.GET.get("admin_id")
        user = auth_users.models.User.objects.filter(id=admin_id).first()
        try:
            admin = user.admin
        except:
            return Response({"error": "Could not find admin with this id"})
        created = admin.created_games.all().prefetch_related('cells').annotate(
            cell_count_with_condition=Count('cells', filter=Q(cells__used=True, cells__is_prize=True))
        ).only('id', 'size')
        resp = api.serializers.GameSerializer(
            instance=created,
            many=True
        )
        return Response(resp.data)

class GetUserGames(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user_id = request.GET.get("user_id")
        user = auth_users.models.User.objects.filter(pk=user_id).first()
        if user is None:
            return Response({"errror": "user does not exists"})
        select_related_fields = [field.name for field in user.games.all().first()._meta.get_fields() if field.is_relation and field.related_model]
        print(select_related_fields)
        user_games = user.games.prefetch_related('shots').annotate(shots_quantity=Sum('shots__quanity', default=0))

        serializer_for_queryset = api.serializers.UserGameSerializer(
            instance=user_games,
            many=True
        )

        return Response(serializer_for_queryset.data)

class GetShots(APIView):
    def get(self, request):
        # Извлекаем набор всех записей из таблицы Capital
        # queryset = Capital.objects.all()
        user_id, game_id = request.GET.get("user"), request.GET.get("game")
        queryset = game.models.Shots.objects.get_shots_from_user_and_game(
            user_id, game_id
        )
        # Создаём сериалайзер для извлечённого наборa записей
        serializer_for_queryset = api.serializers.ShotsSerializer(
            instance=queryset,  # Передаём набор записей
            many=True,  # На вход подается именно набор, а не одна запись
        )
        return Response(serializer_for_queryset.data)


class GetCellsFromGame(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print(request.GET)
        game_id = int(request.GET.get("game"))
        if request.GET.get("shooted") == "True":
            shooted = True
        elif request.GET.get("shooted") == "False":
            shooted = False
        else:
            return Response(
                {"message": "Error in shooted par, it must be 'True' or 'False'"}
            )
        queryset = game.models.Cell.objects.filter(game=game_id, used=shooted)
        serializer_for_queryset = api.serializers.CellSerializer(
            instance=queryset, many=True
        )
        print(queryset)
        return Response(serializer_for_queryset.data)


class MakeShot(APIView):
    def get(self, request):
        user_id, game_id = request.GET.get("user"), request.GET.get("game")
        queryset = game.models.Shots.objects.get_shots_from_user_and_game(
            user_id, game_id
        )
        data = {"message": "You have not shots"}
        ok_data = {"message": "Ok"}
        if len(queryset) == 0:
            return Response(data)
        shot = queryset.first()
        if shot.quanity == 0:
            return Response(data)
        shot.quanity -= 1
        shot.save()
        return Response(ok_data)


class AddShots(APIView):
    def get(self, request):
        ok_data = {"message": "Ok"}
        user_id, game_id = request.GET.get("user"), request.GET.get("game")
        quanity = int(request.GET.get("quanity"))
        queryset = game.models.Shots.objects.get_shots_from_user_and_game(
            user_id, game_id
        )
        if len(queryset) == 0:
            game.models.Shots.objects.create(user=user_id, game=game_id, quanity=0)
        shot = queryset.first()
        shot.quanity += quanity
        shot.save()
        return Response(ok_data)


class DeletePrize(APIView):
    def post(self, request, *args, **kwargs):
        serializer = api.serializers.DeletePrizeSerializer(data=request.data)
        if serializer.is_valid():
            # Получите данные из сериализатора
            row = serializer.validated_data.get("row")
            column = serializer.validated_data.get("column")
            game_id = serializer.validated_data.get("game_id")

            # Найдите объекты для удаления
            objects_to_delete = game.models.Prize.objects.filter(
                game=game_id, column=column, row=row
            )

            # Удалите найденные объекты
            objects_to_delete.delete()

            return Response(
                {"message": "Objects deleted successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        subject = request.data.get("subject")
        recipient_list = [request.data.get("email")]
        text = request.data.get("message")
        from_email = settings.DEFAULT_FROM_EMAIL
        send_mail(subject, text, from_email, recipient_list)
        return Response({"message": "Ok"}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = get_object_or_404(auth_users.models.User, email=email)

        # Generate a password reset token
        token = default_token_generator.make_token(user)

        # Build the reset link
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://yourfrontenddomain.com/reset-password/{uidb64}/{token}/"

        # Send reset link to user's email
        # Use your email sending mechanism (e.g., Django's send_mail)
        send_mail(
            'Password Reset',
            f'Click the following link to reset your password: {reset_url}',
            'from@example.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'message': 'Password reset link sent successfully.'})


class GetUserFromPassToken(APIView):

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        request_user_id = int(request.data.get("user_id"))
        new_password = request.data.get("password")
        if token is None or request_user_id is None or new_password:
            return Response({'error': 'Bad request'}, status.HTTP_400_BAD_REQUEST)
        activ_token_obj = auth_users.models.UserActivityToken.objects.filter(token=token).first()
        if activ_token_obj is None:
            return Response({"error": "token does not exists"})
        time = timezone.now()
        if (time - activ_token_obj.created_at) // 3600 < settings.PASSWORD_RESET_TIME:
            return Response({"error": "The token has expired"})
        user_id = activ_token_obj.user.id
        if int(user_id) != request_user_id:
            return Response({"error": "Wrong user"})
        
        user = activ_token_obj.user
        user.password = make_password(new_password)
        user.save()

        return Response({"message": "done"})
    


class GetUserFromToken(APIView):

    # permission_classes = [Is]

    pass