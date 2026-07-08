from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()

# Roles a user is allowed to pick when self-registering through the public
# endpoint. TEACHER and ADMIN are intentionally excluded — they are
# provisioned (Django admin, or an admin-only endpoint later) so nobody can
# escalate their own privileges by POSTing role="admin".
SELF_REGISTERABLE_ROLES = (User.Role.STUDENT, User.Role.PARENT)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    # Optional so the existing frontend keeps working; omitted -> STUDENT.
    role = serializers.ChoiceField(
        choices=SELF_REGISTERABLE_ROLES,
        required=False,
        default=User.Role.STUDENT,
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')
