from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.urls import reverse_lazy


import auth_users.models
import game.models
import sea_battle.utils as utils

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            admin = user.admin
            token['role'] = 'admin'
        except:
            token['role'] = 'user'
        
        token['user_id'] = user.id
        return token


class ShotsSerializer(serializers.Serializer):
    quantity = serializers.IntegerField()
    user_id = serializers.IntegerField()
    game_id = serializers.IntegerField()


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = game.models.Game
        fields = ['id', 'name', 'editable', 'size']  # Include any other fields you need


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = game.models.Cell
        fields = ['id', 'game', 'coord', 'is_prize', 'used', 'forbidden']
    
    def to_representation(self, instance):
        res = {"coordinate": instance.coord}

        if instance.game.editable:
            if instance.forbidden:
                res["status"] = "Forbidden"
            elif instance.is_prize:
                res["status"] = "Prize"
            elif not instance.is_prize:
                res["status"] = "Empty"
        else:
            if instance.is_prize and instance.used:
                res["status"] = "Won"
            elif instance.is_prize and not instance.used:
                res["status"] = "Unwon"
            elif instance.used and not instance.is_prize:
                res["status"] = "Missed"
            else:
                res["status"] = "Untouched"
        return res


class UserCellSerializer(serializers.ModelSerializer):
    class Meta:
        model = game.models.Cell
        fields = ['id', 'game', 'coord', 'is_prize', 'used', 'forbidden', 'prize']

    def to_representation(self, instance):
        res = {"coordinate": instance.coord}
        user_id = self.context.get('user_id', 0)
        if instance.is_prize and instance.prize.user:
            if instance.prize.user.id == user_id:
                res["status"] = "Won"
            else:
                res["status"] = "Unwon"
        elif instance.used:
            res["status"] = "Missed"
        elif not instance.used:
            res["status"] = "Untouched"
        return res



class PlacementSerializer(serializers.Serializer):
    placements = CellSerializer(many=True)
    editable = serializers.BooleanField()
    size = serializers.IntegerField()


    def to_representation(self, queryset):
        # Assuming queryset is a list of Cell instances
        game_instance = queryset.first().game  # Assuming all cells belong to the same game
        context = self.context
        for_admin = context.get('for_admin', False)
        size = context.get('size', 0)
        user_id = context.get('user_id', 0)
        shots = game.models.Shots.objects.filter(user_id=user_id, game=game_instance).first()
        if for_admin:
            return {
                'placements': [CellSerializer(cell).data for cell in queryset],
                'editable': game_instance.editable,
                'size': game_instance.size,
                'FieldName': game_instance.name,
                'Players': game_instance.users.count(),
                'GiftOut': queryset.filter(used=True, is_prize=True).count(),
                'GiftMax': queryset.filter(is_prize=True).count()
            }
        return {
            'placements': [UserCellSerializer(cell, context={'user_id': user_id}).data for cell in queryset],
            'editable': game_instance.editable,
            'size': game_instance.size,
            'FieldName': game_instance.name,
            'Players': game_instance.users.count(),
            'GiftOut': queryset.filter(used=True, is_prize=True).count(),
            'GiftMax': queryset.filter(is_prize=True).count(),
            'Shots': shots.quantity if shots is not None else 0
        }

class PrizesSerializer(serializers.ModelSerializer):

    class Meta:
        model = game.models.Prize
        fields = ['id', 'name', 'avatar']

    def to_representation(self, instance):
        inforviewer = self.context.get("infoviewer", None)
        user_id = self.context.get("user_id", None)
        won_list = self.context.get("won_list", None)
        res = {"id": instance.id, "title": instance.name, "image_url": utils.get_absolute_url(reverse_lazy('game:image', kwargs={'prize_id': instance.id})) if instance.avatar else ""}
        if inforviewer:
            res["description"] = instance.description
        if won_list is None:
            res["won"] = instance.cell.used
        if won_list is None and inforviewer:
            res["won_by_user"] = instance.user_id == user_id
        return res




class UserForAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth_users.models.User
        fields = ['id', 'username', 'avatar']
    
    def to_representation(self, instance):
        shots = instance.shots.first()
        res = {"id": instance.id, "name": instance.username, "image_url": utils.get_absolute_url(reverse_lazy('authorisation:image', kwargs={'user_id': instance.id})) if instance.avatar else "", "shots_number": shots.quantity if shots is not None else 0}
        return res




User = get_user_model()
class UserSerializer(serializers.Serializer):
    # class Meta:
    #     model = User
    #     fields = ['id', 'username', 'email', 'avatar']
    
    def to_representation(self, instance):
        resp = {'id': instance.id, 'username': instance.username, 'email': instance.email, 'avatar': utils.get_absolute_url(reverse_lazy('authorisation:image', kwargs={'user_id': instance.id})) if instance.avatar else ''}
        return resp



class AdminGameSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name', 'size']
    

    def to_representation(self, instance):
        resp = {'id': instance.id, 'size': instance.size, 'name': instance.name, "prizes_max": instance.cells.filter(is_prize=True).count(), 'prizes_out': instance.cells.filter(is_prize=True, used=True).count(), 'players': instance.users.all().count()}
        return resp

class UserGameSerializer(serializers.Serializer):
    class Meta:
        fields = ['id', 'name', 'size', 'shots_quantity']

    def to_representation(self, instance):
        resp = {'id': instance.id, 'size': instance.size, 'name': instance.name, "prizes_max": instance.cells.filter(is_prize=True).count(), 'prizes_out': instance.cells.filter(is_prize=True, used=True).count(), 'shots_quantity': instance.shots_quantity}
        return resp