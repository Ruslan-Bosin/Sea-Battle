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
        print(token['role'])
        return token


class ShotsSerializer(serializers.Serializer):
    quanity = serializers.IntegerField()
    user_id = serializers.IntegerField()
    game_id = serializers.IntegerField()


# class PrizesSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     row = serializers.IntegerField()
#     column = serializers.IntegerField()
#     user_id = serializers.IntegerField()
#     game_id = serializers.IntegerField()
#     created_by_id = serializers.IntegerField()


class CellSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    # game = serializers.IntegerField()
    # user_id = serializers.In()
    row = serializers.IntegerField()
    column = serializers.IntegerField()
    is_prize = serializers.IntegerField()
    used = serializers.IntegerField()


class DeletePrizeSerializer(serializers.Serializer):
    row = serializers.IntegerField()
    column = serializers.IntegerField()
    game_id = serializers.IntegerField()


class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    size = serializers.IntegerField()
    cell_count_with_condition = serializers.IntegerField()


class UserGameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    size = serializers.IntegerField()
    shots_quantity = serializers.IntegerField()
