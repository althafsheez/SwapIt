from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Better-Auth will provide email / user id
    better_auth_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    profile_pic = models.ImageField(upload_to="profiles/", null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.username or self.email
