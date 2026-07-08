"""Teaching groups: the join between people and curriculum.

A Group is a class/cohort — one teacher, a set of students, studying one
course. It sits between ``accounts`` (who) and ``curriculum`` (what), and
is the anchor future assignments hang off: homework/tests get assigned to a
(group, curriculum-item) pair rather than to content in the abstract.

Roles are enforced at the edge via ``limit_choices_to`` (forms/admin); the
``role`` field on User remains the single source of truth.
"""
from django.conf import settings
from django.db import models

from accounts.models import User


class Group(models.Model):
    """A set of students taught by one teacher within a single course."""

    name = models.CharField(max_length=200)  # e.g. "10-A Trigonometry"
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="groups_teaching",
        limit_choices_to={"role": User.Role.TEACHER},
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="groups",
        limit_choices_to={"role": User.Role.STUDENT},
        blank=True,
    )
    course = models.ForeignKey(
        "curriculum.Course",
        on_delete=models.PROTECT,
        related_name="groups",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
