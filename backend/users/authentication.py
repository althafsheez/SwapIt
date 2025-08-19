import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from .models import User

# Use your Better-Auth secret/public key (depending on config)
BETTER_AUTH_SECRET = "your_better_auth_secret_here"

class BetterAuthJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        # Get or create user
        better_auth_id = payload.get("sub")
        email = payload.get("email")

        if not email:
            raise exceptions.AuthenticationFailed("No email in token")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": better_auth_id, "better_auth_id": better_auth_id}
        )

        return (user, None)
    