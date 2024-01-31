from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

import auth_users.models
import game.models

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
    quanity = serializers.IntegerField()
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
        return {
            'placements': [CellSerializer(cell).data for cell in queryset],
            'editable': game_instance.editable,
            'size': game_instance.size,
        }

class PrizesSerializer(serializers.ModelSerializer):

    class Meta:
        model = game.models.Prize
        fields = ['id', 'name', 'avatar']

    def to_representation(self, instance):
        res = {"id": instance.id, "title": instance.name, "image_url": instance.avatar if instance.avatar else "", "won": instance.cell.first().used}
        return res
    

class UserForAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = game.models.Prize
        fields = ['id', 'username', 'avatar']
    
    def to_representation(self, instance):
        res = {"id": instance.id, "name": instance.username, "image_url": instance.avatar if instance.avatar else "", "shots_number": instance.shots_quantity}
        return res




User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar']



class AdminGameSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name', 'size']
    

    def to_representation(self, instance):
        resp = {'id': instance.id, 'size': instance.size, 'name': instance.name, "prizes_max": instance.cells.filter(is_prize=True).count(), 'prizes_out': instance.cells.filter(is_prize=True, used=True).count(), 'players': instance.users.all().count()}
        return resp

class UserGameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    size = serializers.IntegerField()
    shots_quantity = serializers.IntegerField()