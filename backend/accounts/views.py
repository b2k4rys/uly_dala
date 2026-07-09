from rest_framework import generics, permissions

from .models import User
from .permissions import IsAdminRole, IsTeacher
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """Public endpoint to create a new user account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    """Return the currently authenticated user."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class StudentListView(generics.ListAPIView):
    """List student accounts so teachers/admins can build an enrollment picker.

    Restricted to teachers and admins — students/parents have no need to
    enumerate the whole student body.
    """

    serializer_class = UserSerializer
    permission_classes = [IsTeacher | IsAdminRole]
    queryset = User.objects.filter(role=User.Role.STUDENT).order_by('username')
