from django.db import models
from cloudinary.models import CloudinaryField

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    profile_image = CloudinaryField('image')

    def __str__(self):
        return self.name
