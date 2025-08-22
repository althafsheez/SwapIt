
# serializers.py
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'location', 'profile_image', 'address', 'contact_number', 'contact_email']
        read_only_fields = ['user']  # user is linked in view
