from django.contrib import admin

from .models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("name", "teacher", "course", "created_at")
    list_filter = ("course",)
    search_fields = ("name",)
    filter_horizontal = ("students",)
