from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for the project.

    Extends Django's AbstractUser so we keep username/password/permissions
    while being able to add project-specific fields over time. Defining this
    now (before the first migration) avoids a painful swap later.

    ``role`` is the single source of truth for what kind of user this is. It
    is deliberately one-per-user and app-level: it drives API permissions and
    frontend routing, and stays decoupled from Django's is_staff/is_superuser
    (so the ADMIN role and Django-admin-site access evolve independently).
    Role-specific data (a parent's children, a teacher's courses) belongs in
    separate OneToOne profile models added when those relationships are real.
    """

    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        TEACHER = "teacher", "Teacher"
        PARENT = "parent", "Parent"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices)

    def __str__(self):
        return self.username

class ParentStudent(models.Model):
    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='children_links',
        limit_choices_to={'role': User.Role.PARENT}
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='parents_links',
        limit_choices_to={'role': User.Role.STUDENT}
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["parent", "student"], name="unique_parent_student"
            ),
        ]

    def __str__(self):
        return f"{self.parent} → {self.student}"