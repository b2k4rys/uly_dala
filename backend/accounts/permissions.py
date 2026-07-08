"""Role-based DRF permissions.

Each class checks the authenticated user's ``role`` field. Compose them with
the standard ``IsAuthenticated`` gate that DRF applies by default; these only
add the role requirement on top of an already-authenticated request.
"""
from rest_framework.permissions import BasePermission

from .models import User


class HasRole(BasePermission):
    """Base class: grant access only to users whose role is in ``roles``.

    Subclass and set ``roles`` rather than instantiating directly.
    """

    roles: tuple[str, ...] = ()

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and user.role in self.roles
        )


class IsStudent(HasRole):
    roles = (User.Role.STUDENT,)


class IsTeacher(HasRole):
    roles = (User.Role.TEACHER,)


class IsParent(HasRole):
    roles = (User.Role.PARENT,)


class IsAdminRole(HasRole):
    """App-level ADMIN role — distinct from Django's is_staff/is_superuser."""

    roles = (User.Role.ADMIN,)
