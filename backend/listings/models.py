import uuid
from django.db import models
from django.contrib.auth.models import User  # if using Django's default User
from cloudinary.models import CloudinaryField
import cloudinary.uploader
from users.models import NextAuthUser

class Listing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(NextAuthUser, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = CloudinaryField("image", default="https://res.cloudinary.com/demo/image/upload/placeholder.png")  # <-- cloudinary
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    def delete(self, *args, **kwargs):
        # also delete from Cloudinary when listing is deleted
        if self.image:
            try:
                cloudinary.uploader.destroy(self.image.public_id)
            except Exception as e:
                print(f"Cloudinary delete error: {e}")
        super().delete(*args, **kwargs)
