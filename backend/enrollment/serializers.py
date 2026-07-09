from rest_framework import serializers

from accounts.models import User

from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    """Read/write a Group.

    ``teacher`` and ``students`` are role-filtered at the field level, so the
    API enforces what ``limit_choices_to`` only enforces in the admin: a
    non-teacher id for ``teacher`` (or a non-student in ``students``) is a 400,
    not a silent bad row.
    """

    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.TEACHER),
        required=False,  # defaulted to request.user for teacher creators
    )
    students = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.STUDENT),
        many=True,
        required=False,
    )

    class Meta:
        model = Group
        fields = ('id', 'name', 'teacher', 'course', 'students', 'created_at')
        read_only_fields = ('created_at',)


class EnrollStudentSerializer(serializers.Serializer):
    """Payload for the enroll/unenroll actions: a single student id.

    The queryset filter validates both existence and role in one step.
    """

    student = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.STUDENT)
    )
