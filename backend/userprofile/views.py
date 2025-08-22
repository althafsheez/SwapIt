from rest_framework import viewsets, permissions
from .models import UserProfile, NextAuthUser
from .serializers import UserProfileSerializer
from rest_framework.response import Response
from rest_framework import status

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]  # temporarily for testing Postman

    def get_queryset(self):
        # For testing: return all profiles
        return UserProfile.objects.all()

    def create(self, request, *args, **kwargs):
        # Find the NextAuthUser by email (passed in body)
        email = request.data.get("email")
        try:
            user = NextAuthUser.objects.get(email=email)
        except NextAuthUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
