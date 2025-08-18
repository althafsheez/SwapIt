from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_pic", "location", "bio", "rating"]
        read_only_fields = ["id", "email", "rating"]
