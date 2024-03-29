import requests
from django.urls import reverse_lazy
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Prefetch
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

import api.serializers
import game.models
import auth_users.models
import api.validators
import sea_battle.utils as utils

class CheckToken(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "done"})



class GetUserFromToken(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        resp = api.serializers.UserSerializer(
            instance=user
        )
        return Response(resp.data)



class GetAllForInfoView(APIView):
    def get(self, request):
        game_id = request.GET.get("game")
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if game_instance is None:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        prizes_queryset = game.models.Prize.objects.prefetch_related("cell").filter(cell__game=game_instance).order_by('cell__used')
        users_queryset = game_instance.users.prefetch_related(Prefetch('shots', queryset=game.models.Shots.objects.filter(game=game_instance)))
        cells = game.models.Cell.objects.filter(game=game_instance)
        statistic_data = {
            "shootsNumber": cells.filter(used=True).count(),
            "missedCount": cells.filter(used=True, is_prize=False).count(),
            "prizesCount": cells.filter(is_prize=True).count(),
            "wonCount": cells.filter(is_prize=True, used=True).count(),
            "unwonCount": cells.filter(is_prize=True, used=False).count(),
            "allCells": cells.count(),
        }
        prizes_serializer = api.serializers.PrizesSerializer(instance=prizes_queryset, many=True)
        users_serializer = api.serializers.UserForAdminSerializer(
            instance=users_queryset,
            many=True
        )
        resp = {"name": game_instance.name, "description": game_instance.description, "editable": game_instance.editable, "statistics": statistic_data, "clientsNumber": len(users_queryset), "clients": users_serializer.data, "prizesNumber": len(prizes_queryset), "prizes": prizes_serializer.data}
        return Response(resp, status=status.HTTP_200_OK)



class WorkCheck(APIView):

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "it works"})

    def post(self, request, *args, **kwargs):
        resp = request.data
        resp["message"] = "works"
        return Response(resp)




class CreateUserView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = api.serializers.CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        email_token = request.data.get('email_token')
        admin_code = request.data.get('admin_code')
        is_admin_reg = request.data.get('is_admin_reg')

        if username is None or email is None or password is None:
            return Response({'message': 'This url have 3 required params: username, email, password'}, status=status.HTTP_400_BAD_REQUEST)

        if len(auth_users.models.User.objects.filter(email=email)) != 0:
            return Response({'message': 'Пользователь с такой почтой уже существует'}, status=status.HTTP_400_BAD_REQUEST)
        
        if api.validators.email_validator(email):
            return Response({'message': 'Введите существующую почту'}, status=status.HTTP_400_BAD_REQUEST)
        
        password_validate, password_status = api.validators.validate_password(password)

        if password_validate:
            return Response({'message': password_status}, status=status.HTTP_400_BAD_REQUEST)

        token = auth_users.models.CheckEmailToken.objects.filter(email=email).first()
        if token is None or token.expired():
            return Response({'message': 'Срок действия кода потверждения почты истек'}, status=status.HTTP_400_BAD_REQUEST)
        if str(token.token) != email_token:
            return Response({'message': 'Неправильный код подтверждения почты'}, status=status.HTTP_400_BAD_REQUEST)

        password = make_password(password)

        if is_admin_reg:
            if admin_code == settings.ADMIN_CODE:
                user = auth_users.models.User.objects.create(username=username, email=email, password=password)
                admin = auth_users.models.Admins.objects.create(user=user)
                admin.save()
                user.save()
            else:
                return Response({'message': 'Неправильный секретный код'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = auth_users.models.User.objects.create(username=username, email=email, password=password)
            user.save()
        response = super(CreateUserView, self).post(request, *args, **kwargs)
        refresh = RefreshToken.for_user(user)
        response.data['refresh'] = str(refresh)
        # return Response({"message": "Ok"}, status=status.HTTP_201_CREATED)
        return Response(response.data, status=status.HTTP_201_CREATED)
        




class CustomObtainTokenPairView(TokenObtainPairView):

    serializer_class = api.serializers.CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        email = request.data.get("email")
        password = request.data.get("password")
        if api.validators.validate_email(email):
            return Response({"message": "invalid email"}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=email, password=password)
        if user is not None:
            response = super(CustomObtainTokenPairView, self).post(request, *args, **kwargs)
            refresh = RefreshToken.for_user(user)
            response.data['refresh'] = str(refresh)
            admin = auth_users.models.Admins.objects.filter(user=user).first()
            if admin is None:
                response.data['role'] = "user"
            else:
                response.data['role'] = 'admin'
            return response
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class SendEmailToken(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if api.validators.validate_email(email):
            return Response({"message": "Укажите существующий адресс электронной почты"})
        
        token = auth_users.models.CheckEmailToken.objects.filter(email=email).first()

        if token is None or token.expired():
            new_token = auth_users.models.CheckEmailToken.objects.create(email=email)
            send_mail(
                'Подтверждение почты',
                f'Ваш код подтверждения: {new_token.token}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({"message": "Ok"})
        return Response({"message": "На эту почту уже отправлено подтверждение"})


class ResetEmailToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if api.validators.validate_email(email):
            return Response({"message": "Укажите существующий адресс электронной почты"})
        if len(auth_users.models.User.objects.filter(email=email)) == 0:
            return Response({'message': 'Пользователь с такой почтой не существует'})
        is_admin = request.data.get("is_admin")
        user = auth_users.models.User.objects.filter(email=email).first()
        admin = auth_users.models.Admins.objects.filter(user=user).first()
        if is_admin and not admin:
            return Response({'message': 'Админа с такой почтой нет'})
        if not is_admin and admin:
            return Response({'message': 'Юзера с такой почтой нет'})



        token = auth_users.models.ResetEmailTokenModels.objects.filter(email=email).first()


        if token is None or token.expired():
            new_token = auth_users.models.ResetEmailTokenModels.objects.create(email=email)
            send_mail(
                'Восстановление пароля',
                f'Ваш код восстановления: {new_token.token}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({"message": "Ok"})
        return Response({"message": "На эту почту уже отправлено подтверждение"})


class UpdatePassUserView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = api.serializers.CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        email_token = request.data.get('email_token')

        if email is None or password is None:
            return Response({'message': 'This url have 2 required params: email, password'},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(auth_users.models.User.objects.filter(email=email)) == 0:
            return Response({'message': 'Пользователь с такой почтой не существует'},
                            status=status.HTTP_400_BAD_REQUEST)
        password_validate, password_status = api.validators.validate_password(password)

        if password_validate:
            return Response({'message': password_status}, status=status.HTTP_400_BAD_REQUEST)

        token = auth_users.models.ResetEmailTokenModels.objects.filter(email=email).first()
        if token is None or token.expired():
            return Response({'message': 'Срок действия кода восстановления истек'}, status=status.HTTP_400_BAD_REQUEST)
        if str(token.token) != email_token:
            return Response({'message': 'Неправильный код восстановления'}, status=status.HTTP_400_BAD_REQUEST)

        password = make_password(password)
        user = auth_users.models.User.objects.filter(email=email).first()
        user.password = password
        user.save()
        response = super(UpdatePassUserView, self).post(request, *args, **kwargs)
        refresh = RefreshToken.for_user(user)
        response.data['refresh'] = str(refresh)
        # return Response({"message": "Ok"}, status=status.HTTP_201_CREATED)
        return Response(response.data, status=status.HTTP_201_CREATED)


class AdminCreatedGamesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        admin_id = request.user.id
        user = auth_users.models.User.objects.filter(id=admin_id).first()
        try:
            admin = user.admin
        except:
            return Response({"error": "Could not find admin with this id"})
        # created = admin.created_games.all().prefetch_related('cells', 'users').annotate(
        #     prizes_out=Count('cells', filter=Q(cells__used=True, cells__is_prize=True)),
        #     prizes_max=Count('cells', filter=Q(cells__is_prize=True)),
        # )
        created = admin.created_games.all().prefetch_related('cells', 'users')
        resp = api.serializers.AdminGameSerializer(
            instance=created,
            many=True
        )
        return Response(resp.data)


class GetUserGames(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        user = auth_users.models.User.objects.filter(pk=user_id).first()
        if user is None:
            return Response({"errror": "user does not exists"})
        user_games = user.games.prefetch_related(Prefetch('shots', queryset=game.models.Shots.objects.filter(user=user)), 'cells').annotate(shots_quantity=Sum('shots__quantity', default=0))
        serializer_for_queryset = api.serializers.UserGameSerializer(
            instance=user_games,
            many=True
        )

        return Response(serializer_for_queryset.data)


class UpdateCellAfterShoot(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user, game_id = request.user, request.data.get("game_id")
        coord = request.data.get("coord")
        this_game = game.models.Game.objects.get(id=game_id)

        if this_game.editable:
            this_game.editable = False
            this_game.save()

        cell = game.models.Cell.objects.get(game__id=game_id, coord=coord)
        cell.used = True
        if cell.is_prize:
            prize = cell.prize
            if prize.user is None:
                prize.user = user
                prize.save()
        cell.save()


        try:
            shot = game.models.Shots.objects.get(user=user, game__id=game_id)
            shot.quantity -= 1
            shot.touched = True
            shot.save()
            if cell.is_prize and cell.prize:
                prize_avatar_url = utils.get_absolute_url(
                    reverse_lazy('game:image', kwargs={'prize_id': cell.prize.id})) if cell.prize.avatar else ""
                return Response({'prize_name': cell.prize.name, 'prize_title': cell.prize.description, "prize_avatar_url": prize_avatar_url}  )
            return Response({'message': 'Quantity and cell updated successfully'}, status=status.HTTP_200_OK)
        except game.models.Shots.DoesNotExist:
            return Response({'error': 'Shot not found or you do not have permission to update quantity'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetShots(APIView):
    def get(self, request):
        user_id, game_id = request.user.id, request.GET.get("game_id")

        queryset = game.models.Shots.objects.get_shots_from_user_and_game(user_id, game_id)

        # Calculate the total quantity of shots
        total_shots = sum([shot.quantity for shot in queryset])

        # Serialize the queryset
        serializer_for_queryset = api.serializers.ShotsSerializer(
            instance=queryset,
            many=True,
        )

        # Add the total quantity to the response data
        response_data = {
            'shots': serializer_for_queryset.data,
            'total_shots': total_shots,
        }

        return Response(response_data)

class GetCellsFromGame(APIView):
    def get(self, request):
        game_id = request.GET.get('game')
        user_id = request.user.id
        try:
            game_instance = game.models.Game.objects.get(id=game_id)
            cells_queryset = game.models.Cell.objects.filter(game=game_instance)
        except game.models.Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        context = {
            'for_admin': (game_instance.created_by.user.id == user_id),
            'size': game_instance.size,
            'user_id': user_id,
        }
        # context = {'editable': game_instance.editable, 'size': game_instance.size}
        serializer = api.serializers.PlacementSerializer(cells_queryset, context=context)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetPrizesFromGame(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        game_id = request.GET.get('game')
        try:
            game_instance = game.models.Game.objects.get(id=game_id)
            prizes_queryset = game.models.Prize.objects.prefetch_related("cell").filter(cell__game=game_instance)
        except game.models.Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = api.serializers.PrizesSerializer(instance=prizes_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetUsersFromGame(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        game_id = request.GET.get('game')
        try:
            game_instance = game.models.Game.objects.get(id=game_id)
            users_queryset = game_instance.users.prefetch_related("shots").annotate(shots_quantity=Sum('shots__quanity', default=0))
        except game.models.Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
    
        serializer = api.serializers.UserForAdminSerializer(
            instance=users_queryset,
            many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

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
        if shot.quantity == 0:
            return Response(data)
        shot.quantity -= 1
        shot.touched = True
        shot.save()
        return Response(ok_data)


class RemoveClientFromGame(APIView):
    def post(self, request):
        user_id, game_id = request.data.get("user_id"), request.data.get("game_id")
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        user_instance = auth_users.models.User.objects.filter(id=user_id).first()
        if game_instance is None:
            return Response({"message": "Invalid game_id"})
        if user_instance is None:
            return Response({"message": "Invalid user_id"})
        if not game_instance.editable:
            return Response({"message": "Пока игра идет пользователей нельзя удалять"})
        shot = game.models.Shots.objects.filter(user=user_instance, game=game_instance).first()
        ok_data = {"message": "Ok"}
        if shot is not None:
            if shot.touched:
                return Response({"message": "Этот пользователь совершил выстрел"})
            else:        
                shot.delete()
        user_instance.games.remove(game_instance)
        return Response(ok_data)
    
class RemoveGameView(APIView):

    def post(self, request):
        game_id = request.data.get("game_id")
        
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if game_instance is None:
            return Response({"message": "game does not exists"})
        if not game_instance.editable:
            return Response({"message": "Игра уже идет"})
        game_instance.delete()
        return Response({"message": "Ok"})
    
class EditField(APIView):

    def post(self, request):
        game_id = request.data.get("game_id")
        new_name = request.data.get("name")
        new_description = request.data.get("description")
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if game_instance is None:
            return Response({"message": "game does not exists"})
        if new_name == "":
            return Response({"message": "Нельзя сделать название игры пустым"})
        game_instance.name = new_name
        game_instance.description = new_description
        game_instance.save()
        return Response({"message": "Ok"})
        

class AddShots(APIView):
    def post(self, request):
        ok_data = {"message": "Ok"}
        user_id, game_id = request.data.get("user"), request.data.get("game")
        user_instance = auth_users.models.User.objects.filter(id=user_id).first()
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        quanity = int(request.data.get("quanity"))
        if user_instance is None or game_instance is None:
            return Response({"message": "wrong game or user id"})
        elif user_id not in [int(user.id) for user in game_instance.users.all()]:
            return Response({"message": "wrong game or user id"})
        queryset = game.models.Shots.objects.get_shots_from_user_and_game(
            user_id, game_id
        )
        if len(queryset) == 0:
            game.models.Shots.objects.create(user=user_instance, game=game_instance, quantity=quanity)
        else:
            shot = queryset.first()
            shot.quantity += quanity
            shot.save()
        return Response(ok_data)



class AddUser(APIView):

    def post(self, request):
        email = request.data.get("email")
        game_id = request.data.get("game")
        user_instance = auth_users.models.User.objects.filter(email=email).first()
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if game_instance is None:
            return Response({"message": "game does not exists"})
        if user_instance is None:
            return Response({"message": "wrong email"})
        if game_instance.users.all().filter(email=email).first() is not None:
            return Response({"message": "this user is already added"})
        if auth_users.models.Admins.objects.filter(user=user_instance).first():
            return Response({"message": "Can`t add admin"})
        game_instance.users.add(user_instance)
        game_instance.save()
        return Response({"message": "Ok"})

class DeletePrize(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        coordinate = int(request.data.get('coordinate'))
        field_id = int(request.data.get('fieldID'))

        cell_to_update = game.models.Cell.objects.filter(
            game_id=field_id, coord=coordinate,
        ).first()

        if cell_to_update:

            cell_to_update.prize = None
            cell_to_update.save(update_fields=['prize'])

            return Response(
                {"message": "Object deleted successfully"},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Object not found"},
                status=status.HTTP_404_NOT_FOUND
            )



class SendEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        subject = request.data.get("subject")
        recipient_list = [request.data.get("email")]
        text = request.data.get("message")
        from_email = settings.DEFAULT_FROM_EMAIL
        send_mail(subject, text, from_email, recipient_list)
        return Response({"message": "Ok"}, status=status.HTTP_200_OK)



class PrizeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        title = request.data.get('name')
        description = request.data.get('description')
        image_file = request.data.get('avatar')
        coordinate = int(request.data.get('coordinate'))
        field_id = int(request.data.get('fieldID'))
        user = request.user
        admin = auth_users.models.Admins.objects.filter(user=user).first()
        if not title:
            return Response({'message': 'Name or title is missing.'}, status=400)

        prize = game.models.Prize.objects.create(name=title, description=description, avatar=image_file, created_by=admin)

        cell = get_object_or_404(game.models.Cell, game_id=field_id, coord=coordinate)
        cell.prize = prize
        cell.is_prize = True
        cell.save()

        return Response({'message': 'Prize created and associated with the cell'}, status=201)




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




class GetPrizeAvatar(APIView):
    permission_classes = [AllowAny]

    def get(self, request, fieldID, coordinate, *args, **kwargs):
        cell = get_object_or_404(game.models.Cell, coord=coordinate, game_id=fieldID)

        if cell.is_prize and cell.prize:
            prize_avatar_url = cell.prize.avatar.url if cell.prize.avatar else None
            return Response({'prize_avatar_url': prize_avatar_url})
        else:
            return Response({'prize_avatar_url': None})



class GetPrize(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        coord = request.GET.get("coord")
        game_id = request.GET.get("game_id")
        cell = get_object_or_404(game.models.Cell, coord=coord, game_id=game_id)

        try:
            if cell.is_prize:
                prize_avatar_url = utils.get_absolute_url(reverse_lazy('game:image', kwargs={'prize_id': cell.prize.id})) if cell.prize.avatar else ""
                if cell.prize.user:
                    return Response({'prize_avatar_url': prize_avatar_url, 'prize_name': str(cell.prize.name), 'prize_title': str(cell.prize.description), 'prize_userName_got': str(cell.prize.user.username)})
                return Response({'prize_avatar_url': prize_avatar_url, 'prize_name': str(cell.prize.name), 'prize_title': str(cell.prize.description)})
            else:
                return Response({'prize_avatar_url': "", 'prize_name': "", 'prize_title': ""})
        except:
            return Response(
                {"message": "Object not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class SupportRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        url = "https://discord.com/api/webhooks/1205224642566950923/nuCofYE5XzEzeREpNzxslsi4LeEgSlQVyxc1DMEo5CaqAKP9rua20ST82A5CLq8Bk4BE"
        data = {
            "avatar_url": "https://cdn.icon-icons.com/icons2/558/PNG/512/support-avatar_icon-icons.com_53645.png",
            "username": "Support",
            "content": f"**Запрос от:** {request.user.email}\n"
                       f"**Контактный email:** {request.data.get('mail')}\n"
                       f"**ID пользователя:** {request.user.id}",
            "embeds": [{
                "description": request.data.get('description')
            }]
        }

        requests.post(url, json=data)
        return Response({"message": "done"})


class GetUserInfoViewer(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        game_id = request.GET.get("game_id")
        user_instance = auth_users.models.User.objects.filter(id=user.id).first()
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if not (user_instance and game_instance):
            return Response({"message": "Invalid game or user ID."})

        if user_instance not in game_instance.users.all():
            return Response({"message": "User is not associated with this game."})

        shoots_info = {}
        shoots = game.models.Shots.objects.filter(user=user, game=game_instance).first()
        if shoots is not None:
            shoots_info = {
                "quantity": shoots.quantity,
            }
        else:
            shoots_info = {
                "quantity": 0
            }

        field_info = {
            "name": game_instance.name,
            "description": game_instance.description,
            "creator": game_instance.created_by.user.username if game_instance.created_by else None,
        }

        prizes_queryset = game.models.Prize.objects.prefetch_related("cell").filter(cell__game=game_instance)
        unwon_prizes = prizes_queryset.filter(cell__used=False)
        prizes_won_queryset = prizes_queryset.filter(user=user)

        prizes = api.serializers.PrizesSerializer(prizes_queryset, many=True, context={"infoviewer": True, "user_id": request.user.id}).data
        won_prizes = api.serializers.PrizesSerializer(prizes_won_queryset, many=True, context={"infoviewer": True, "won_list": True}).data



        return Response({
            "field_info": field_info,
            "shoots_info": shoots_info,
            "unwon": unwon_prizes.count(),
            "user_won": won_prizes,
            "all_prizes": prizes
        })


class GetAdminInfoViewer(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        game_id = request.GET.get("game_id")
        user_instance = auth_users.models.User.objects.filter(id=user.id).first()
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if not (user_instance and game_instance):
            return Response({"message": "Invalid game or user ID."})

        if user_instance not in game_instance.users.all():
            return Response({"message": "User is not associated with this game."})
        game_cells = game.models.Cell.objects.filter(game=game_instance)

        game_prizes_info = []
        for cell in game_cells:
            prize = cell.prize
            if prize:
                prize_data = {
                    "name": prize.name,
                    "avatar": prize.avatar.url if prize.avatar else None,
                }
                game_prizes_info.append(prize_data)

        game_user_prizes_used = []
        for cell in game_cells:
            prize = cell.prize
            if prize:
                if prize.user:
                    prize_data = {
                        "name": prize.name,
                        "avatar": prize.avatar.url if prize.avatar else None,
                    }
                    game_user_prizes_used.append(prize_data)

        cells_used = 0
        for cell in game_cells:
            used = cell.used
            if used:
                cells_used += 1

        return Response({
            "cells": len(game_cells),
            "cells_used": cells_used,
            "prizes_info": game_prizes_info,
            "game_user_prizes_used": game_user_prizes_used,
        })


class UpdateUserAvatar(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        image_file = request.data.get('avatar')
        user = request.user

        user.avatar = image_file
        user.save()

        return Response({'message': 'error'}, status=201)


class UpdateUsername(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        new_username = request.data.get('new_username')
        user = request.user
        user.username = new_username
        user.save()
        return Response({'message': 'error'}, status=201)

class ChangePrize(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        coordinate = int(request.data.get('coordinate'))
        field_id = int(request.data.get('fieldID'))
        title = request.data.get('title')
        description = request.data.get('description')
        image_file = request.data.get('imageFile')
        prize = game.models.Prize.objects.create(name=title, description=description, avatar=image_file)
        cell = get_object_or_404(game.models.Cell, game_id=field_id, coord=coordinate)
        cell.prize = prize
        cell.is_prize = True
        cell.save()

        return Response({'message': 'error'}, status=201)

class CreateField(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        size = int(request.data.get('size'))
        name_field = request.data.get('name')
        description = request.data.get('description')
        if not name_field:
            return Response({'message': 'Name is missing.'}, status=400)
        user = request.user
        admin = auth_users.models.Admins.objects.filter(user=user).first()
        new_game = game.models.Game.objects.create(name=name_field, description=description, size=size, created_by=admin)
        new_game.save()

        return Response({'message': 'error'}, status=201)


class GetUserPrizeList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not user:
            return Response({"message": "Invalid user ID."})
        val_sort = request.GET.get('sortValue')
        filter_sort = request.GET.get('filterValue')

        prize_list_with_game = []
        organization = []
        id_orgs = []
        prize_list = game.models.Prize.objects.filter(user=user)
        organization.append({
            "label": "Все",
            "value": 0,
        })

        for prize in prize_list:
            cell = game.models.Cell.objects.filter(prize=prize).first()
            game_of_prize = cell.game if cell else None
            if game_of_prize:
                prize_list_with_game.append({
                    "name": prize.name,
                    "owner": game_of_prize.created_by.user.username,
                    "owner_id": game_of_prize.created_by.user.id,
                    "fieldName": game_of_prize.name,
                    "fieldId": game_of_prize.id,
                    "description": prize.description,
                    "avatar": utils.get_absolute_url(reverse_lazy('game:image', kwargs={'prize_id': prize.id})) if prize.avatar else ""
                })
                if not game_of_prize.created_by.user.id in id_orgs:
                    organization.append({
                        "label": game_of_prize.created_by.user.username,
                        "value": game_of_prize.created_by.user.id,
                    })
                    id_orgs.append(game_of_prize.created_by.user.id)
        if filter_sort != "0":
            new_prize_list_with_game = []
            for prize in prize_list_with_game:
                if f'{prize["owner_id"]}' == filter_sort:
                    new_prize_list_with_game.append(prize)
            prize_list_with_game = new_prize_list_with_game
        if val_sort == "alphabet":
            prize_list_with_game.sort(key=lambda x: x["name"])
        elif val_sort == "reverse":
            prize_list_with_game.sort(key=lambda x: x["name"], reverse=True)
        return Response({
            "prize_list_with_game": prize_list_with_game,
            "organization": organization
        })



class GetAdminPrizeList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not user:
            return Response({"message": "Invalid user ID."})
        val_sort = request.GET.get('sortValue')
        filter_sort = request.GET.get('filterValue')

        prize_list_with_game = []
        admin = auth_users.models.Admins.objects.filter(user=user).first()
        prize_list = game.models.Prize.objects.filter(created_by=admin)

        for prize in prize_list:
            cell = game.models.Cell.objects.filter(prize=prize).first()
            game_of_prize = cell.game if cell else None
            if game_of_prize:
                winner = ''
                if prize.user:
                    winner = prize.user.username
                prize_list_with_game.append({
                    "name": prize.name,
                    "owner": game_of_prize.created_by.user.username,
                    "owner_id": game_of_prize.created_by.user.id,
                    "winner": winner,
                    "fieldName": game_of_prize.name,
                    "fieldId": game_of_prize.id,
                    "description": prize.description,
                    "avatar": utils.get_absolute_url(reverse_lazy('game:image', kwargs={'prize_id': prize.id})) if prize.avatar else ""
                })
        if filter_sort == "won":
            new_prize_list_with_game = []
            for prize in prize_list_with_game:
                if f'{prize["winner"]}' != '':
                    new_prize_list_with_game.append(prize)
            prize_list_with_game = new_prize_list_with_game
        elif filter_sort == "unwon":
            new_prize_list_with_game = []
            for prize in prize_list_with_game:
                if f'{prize["winner"]}' == '':
                    new_prize_list_with_game.append(prize)
            prize_list_with_game = new_prize_list_with_game
        if val_sort == "alphabet":
            prize_list_with_game.sort(key=lambda x: x["name"])
        elif val_sort == "reverse":
            prize_list_with_game.sort(key=lambda x: x["name"], reverse=True)
        return Response({
            "prize_list_with_game": prize_list_with_game,
        })
