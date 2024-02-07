from django.http import JsonResponse
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
from PIL import Image
from django.core.files.base import ContentFile
from io import BytesIO
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import get_object_or_404

import api.serializers
import game.models
import auth_users.models
import api.validators

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
    permission_classes = [AllowAny]
    def get(self, request):
        game_id = request.GET.get("game")
        game_instance = game.models.Game.objects.filter(id=game_id).first()
        if game_instance is None:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        prizes_queryset = game.models.Prize.objects.prefetch_related("cell").filter(cell__game=game_instance).order_by('cell__used')
        users_queryset = game_instance.users.prefetch_related("shots").annotate(shots_quantity=Sum('shots__quantity', default=0))
        cells = game.models.Cell.objects.filter(game=game_instance)
        statistic_data = {
            "shootsNumber": cells.filter(used=True).count(),
            "missedCount": cells.filter(used=True, is_prize=False).count(),
            "prizesCount": cells.filter(is_prize=True).count(),
            "wonCount": cells.filter(is_prize=True, used=True).count(),
            "unwonCount": cells.filter(is_prize=True, used=False).count()

        }
        prizes_serializer = api.serializers.PrizesSerializer(instance=prizes_queryset, many=True)
        users_serializer = api.serializers.UserForAdminSerializer(
            instance=users_queryset,
            many=True
        )
        resp = {"editable": game_instance.editable, "statistics": statistic_data,"clientsNumber": len(users_queryset), "clients": users_serializer.data, "prizesNumber": len(prizes_queryset), "prizes": prizes_serializer.data}
        print(resp)
        return Response(resp, status=status.HTTP_200_OK)



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

        email = request.data.get("email")
        password = request.data.get("password")
        if api.validators.validate_email(email):
            return Response({"message": "invalid email"})
        if api.validators.validate_password(password):
            return Response({"message": "invalid password"})
        user = authenticate(request, username=email, password=password)
        if user is not None:
            response = super(CustomObtainTokenPairView, self).post(request, *args, **kwargs)
            refresh = RefreshToken.for_user(user)
            response.data['refresh'] = str(refresh)
            return response
        else:
            return Response({'message': 'Invalid credentials'})




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
        select_related_fields = [field.name for field in user.games.all().first()._meta.get_fields() if field.is_relation and field.related_model]
        user_games = user.games.prefetch_related('shots', 'cells').filter(shots__user=user).annotate(shots_quantity=Sum('shots__quantity', default=0))
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
        print(user, game_id, coord)
        print(user, game_id, coord)
        print(user, game_id, coord)

        cell = game.models.Cell.objects.get(game__id=game_id, coord=coord)
        print(cell)
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
            shot.save()



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
    permission_classes = [AllowAny]
    def get(self, request):
        game_id = request.GET.get('game')
        user_id = request.user.id
        try:
            game_instance = game.models.Game.objects.get(id=game_id)
            cells_queryset = game.models.Cell.objects.filter(game=game_instance)
        except game.models.Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        print(game_instance.created_by.user.id, user_id)
        print(request)
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
            print(prizes_queryset.values())
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
        shot.save()
        return Response(ok_data)


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
        game_instance.users.add(user_instance)
        game_instance.save()
        return Response({"message": "Ok"})

class DeletePrize(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        print(request.data)
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



class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def upload_avatar(self, instance, image_data):
        if not image_data:
            return Response({'error': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Пример изменения размера изображения до 300x300
        img = Image.open(BytesIO(image_data.read()))
        img = img.resize((300, 300), Image.ANTIALIAS)

        # Сохранение изображения
        image_name = f'{instance.id}_avatar.jpg'
        instance.avatar.save(image_name, ContentFile(img.tobytes()))

        return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = request.user
        image_data = request.data.get('avatar')
        self.upload_avatar(user, image_data)

        # Обновление JWT-токена после загрузки аватара
        refresh = RefreshToken.for_user(user)
        access_token = UserSerializer.get_token(user)
        response_data = {
            'access_token': str(access_token),
            'refresh_token': str(refresh),
        }

        return Response(response_data, status=status.HTTP_200_OK)




class PrizeUploadView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        title = request.data.get('name')
        description = request.data.get('description')
        image_file = request.data.get('avatar')
        coordinate = int(request.data.get('coordinate'))
        field_id = int(request.data.get('fieldID'))

        prize = game.models.Prize.objects.create(name=title, description=description, avatar=image_file)

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
        print(fieldID, coordinate)
        cell = get_object_or_404(game.models.Cell, coord=coordinate, game_id=fieldID)

        if cell.is_prize and cell.prize:
            prize_avatar_url = cell.prize.avatar.url if cell.prize.avatar else None
            print(prize_avatar_url)
            return Response({'prize_avatar_url': prize_avatar_url})
        else:
            return Response({'prize_avatar_url': None})