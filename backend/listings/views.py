from rest_framework import generics, permissions
from .models import Listing
from .serializers import ListingSerializer

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all().order_by("-created_at")
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    



class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny] 

    def perform_update(self, serializer):
        # Ensure only the owner can edit
        if self.request.user != self.get_object().user:
            raise PermissionError("You do not have permission to edit this item.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure only the owner can delete
        if self.request.user != instance.user:
            raise PermissionError("You do not have permission to delete this item.")
        instance.delete()
