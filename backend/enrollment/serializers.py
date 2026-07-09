from rest_framework import serializers

from accounts.models import User

from .models import Group


class GroupUserSerializer(serializers.ModelSerializer):
    """Minimal user shape for embedding in group responses (roster/teacher)."""

    class Meta:
        model = User
        fields = ('id', 'username')


class GroupSerializer(serializers.ModelSerializer):
    """Read/write a Group.

    Writes take ids (``teacher``, ``students``); reads also carry the resolved
    names (``teacher_detail``, ``students_detail``) so clients can show people
    without a second round-trip. ``teacher``/``students`` are role-filtered at
    the field level, so the API enforces what ``limit_choices_to`` only
    enforces in the admin: a non-teacher id for ``teacher`` (or a non-student
    in ``students``) is a 400, not a silent bad row.
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
    teacher_detail = GroupUserSerializer(source='teacher', read_only=True)
    students_detail = GroupUserSerializer(
        source='students', many=True, read_only=True
    )

    class Meta:
        model = Group
        fields = (
            'id',
            'name',
            'teacher',
            'teacher_detail',
            'course',
            'students',
            'students_detail',
            'created_at',
        )
        read_only_fields = ('created_at',)


class EnrollStudentSerializer(serializers.Serializer):
    """Payload for the enroll/unenroll actions: a single student id.

    The queryset filter validates both existence and role in one step.
    """

    student = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.STUDENT)
    )
