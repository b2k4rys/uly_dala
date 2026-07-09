"""Group CRUD plus student enrollment.

A ``ModelViewSet`` gives the standard list/retrieve/create/update/destroy for
groups; two extra detail actions manage the students M2M without forcing the
client to PUT the whole roster:

    POST /api/enrollment/groups/{id}/enroll/     {"student": <id>}
    POST /api/enrollment/groups/{id}/unenroll/   {"student": <id>}

Who can do what:
    list / retrieve   any authenticated user
    everything else   teachers and admins only, and a teacher may only touch
                      groups they own (admins are unrestricted)
"""
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.models import User
from accounts.permissions import IsAdminRole, IsTeacher

from .models import Group
from .serializers import EnrollStudentSerializer, GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [(IsTeacher | IsAdminRole)()]

    def perform_create(self, serializer):
        """Teachers always own the groups they create; admins may name one."""
        user = self.request.user
        if user.role == User.Role.TEACHER:
            serializer.save(teacher=user)
        elif serializer.validated_data.get('teacher') is None:
            raise PermissionDenied("teacher is required when an admin creates a group.")
        else:
            serializer.save()

    def _assert_can_manage(self, group):
        """A teacher may only manage their own groups; admins, any."""
        user = self.request.user
        if user.role == User.Role.TEACHER and group.teacher_id != user.id:
            raise PermissionDenied("You can only manage groups you teach.")

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        group = self.get_object()
        self._assert_can_manage(group)
        serializer = EnrollStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group.students.add(serializer.validated_data['student'])
        return Response(GroupSerializer(group).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unenroll(self, request, pk=None):
        group = self.get_object()
        self._assert_can_manage(group)
        serializer = EnrollStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group.students.remove(serializer.validated_data['student'])
        return Response(GroupSerializer(group).data, status=status.HTTP_200_OK)
