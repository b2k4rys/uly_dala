from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """UserAdmin plus the app-level ``role`` field.

    This is the provisioning path for TEACHER and ADMIN roles, which the
    public registration endpoint refuses to create.
    """

    list_display = UserAdmin.list_display + ('role',)
    list_filter = UserAdmin.list_filter + ('role',)
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
