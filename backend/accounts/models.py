from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for the project.

    Extends Django's AbstractUser so we keep username/password/permissions
    while being able to add project-specific fields over time. Defining this
    now (before the first migration) avoids a painful swap later.
    """

    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
