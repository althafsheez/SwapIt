from django.db import models

# Create your models here.
from django.db import models
from cloudinary.models import CloudinaryField
from users.models import NextAuthUser

class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(NextAuthUser, on_delete=models.CASCADE, related_name="profile")
    location = models.CharField(max_length=255)  # required
    profile_image = CloudinaryField("image", blank=True, null=True)  # optional
    address = models.TextField(blank=True, null=True)                  # optional
    contact_number = models.CharField(max_length=20)                  # required
    contact_email = models.EmailField()     

    class Meta:
        db_table = 'user_profiles'  # your Django table for profiles

    def _str_(self):
        return f"{self.user.name}'s Profile"
